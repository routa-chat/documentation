#!/usr/bin/env node
// Builds ./openapi.json from the live Routa OpenAPI document.
//
// Usage:
//   node scripts/build-openapi.mjs [source]
//
// `source` is a URL or a file path. It defaults to http://localhost:3000/docs/json,
// the document `apps/api` serves outside production. The script keeps only the
// public (API key) routes, normalizes the Elysia output into plain OpenAPI 3.0,
// and applies the Portuguese copy from ./openapi-copy.mjs.

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COPY } from './openapi-copy.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = process.argv[2] ?? 'http://localhost:3000/docs/json'

const PUBLIC_PATH =
  /^\/v1\/(messages|whoami|events|webhook_endpoints|templates|media|usage)(\/|$)/
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete']

const load = async () => {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`GET ${source} responded ${response.status}`)
    return response.json()
  }
  return JSON.parse(await readFile(resolve(source), 'utf8'))
}

const canonical = (value) =>
  JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
      : v
  )

// Elysia emits JSON Schema flavoured output; OpenAPI 3.0 needs enum/nullable.
const normalize = (node) => {
  if (Array.isArray(node)) return node.map(normalize)
  if (!node || typeof node !== 'object') return node

  if (node.const !== undefined) {
    const { const: value, ...rest } = node
    return normalize({ ...rest, enum: [value] })
  }

  if (node.patternProperties) {
    const { patternProperties, ...rest } = node
    const [valueSchema] = Object.values(patternProperties)
    return normalize({ ...rest, additionalProperties: valueSchema })
  }

  if (Array.isArray(node.anyOf)) {
    // limit: Numeric string or number
    if (node.anyOf.some((v) => v.format === 'numeric')) {
      const numeric = node.anyOf.find((v) => v.type === 'number') ?? {}
      return {
        type: 'integer',
        minimum: numeric.minimum ?? 1,
        maximum: numeric.maximum ?? 100,
        default: 20,
      }
    }

    const variants = node.anyOf.map(normalize)
    const nonNull = variants.filter((v) => v.type !== 'null')
    const nullable = nonNull.length !== variants.length

    // anyOf of single-value string enums -> one enum
    if (nonNull.length > 0 && nonNull.every((v) => v.type === 'string' && Array.isArray(v.enum) && Object.keys(v).length === 2)) {
      const merged = { type: 'string', enum: nonNull.flatMap((v) => v.enum) }
      return nullable ? { ...merged, nullable: true } : merged
    }

    const { anyOf: _drop, ...rest } = node
    if (nonNull.length === 1) {
      const only = nonNull[0]
      return nullable ? { ...rest, ...only, nullable: true } : { ...rest, ...only }
    }
    return { ...rest, oneOf: nonNull, ...(nullable ? { nullable: true } : {}) }
  }

  const out = {}
  for (const [key, value] of Object.entries(node)) {
    if (key === 'format' && value === 'numeric') continue
    out[key] = normalize(value)
  }
  return out
}

const jsonOnly = (content) =>
  content?.['application/json'] ? { 'application/json': content['application/json'] } : undefined

const main = async () => {
  const raw = await load()
  const paths = {}
  const named = {}

  for (const [path, item] of Object.entries(raw.paths)) {
    if (!PUBLIC_PATH.test(path)) continue
    for (const method of HTTP_METHODS) {
      const op = item[method]
      if (!op) continue
      const key = `${method.toUpperCase()} ${path}`
      const copy = COPY.operations[key]
      if (!copy) throw new Error(`Missing copy for ${key}. Add it to scripts/openapi-copy.mjs`)

      const parameters = [
        ...(op.parameters ?? []).map((p) => ({
          ...normalize(p),
          description: copy.params?.[p.name] ?? COPY.params[p.name] ?? p.description,
        })),
        ...(copy.headers ?? []),
      ]

      let requestBody
      if (copy.requestBody) {
        requestBody = copy.requestBody
      } else if (op.requestBody) {
        requestBody = {
          required: op.requestBody.required ?? true,
          content: normalize(jsonOnly(op.requestBody.content)),
        }
      }

      if (requestBody?.content?.['application/json']?.schema) {
        const json = requestBody.content['application/json']
        json.schema = applyDescriptions(json.schema, copy.requestNotes)
        if (copy.requestExample) json.example = copy.requestExample
      }

      const responses = {}
      for (const [status, response] of Object.entries(op.responses)) {
        const content = jsonOnly(response.content)
        responses[status] = {
          description: COPY.statuses[status] ?? 'Resposta',
          ...(content ? { content: normalize(content) } : {}),
        }
      }

      paths[path] = paths[path] ?? {}
      paths[path][method] = {
        operationId: copy.id,
        tags: [copy.tag],
        summary: copy.summary,
        description: copy.description,
        ...(parameters.length ? { parameters } : {}),
        ...(requestBody ? { requestBody } : {}),
        responses,
        security: [{ bearerAuth: copy.scope ? [copy.scope] : [] }],
        ...(copy.scope ? { 'x-required-scope': copy.scope } : {}),
      }
    }
  }

  // Name the reusable schemas, then replace every identical inline copy by a $ref.
  const pick = (method, path, status) =>
    paths[path]?.[method]?.responses?.[status]?.content?.['application/json']?.schema
  const registry = {
    Error: pick('post', '/v1/messages', '401'),
    Message: pick('post', '/v1/messages', '202'),
    MessageList: pick('get', '/v1/messages', '200'),
    Event: pick('get', '/v1/events', '200')?.properties?.data?.items,
    EventList: pick('get', '/v1/events', '200'),
    Template: pick('post', '/v1/templates', '201'),
    TemplateList: pick('get', '/v1/templates', '200'),
    WebhookEndpoint: pick('get', '/v1/webhook_endpoints/{id}', '200'),
    WebhookEndpointWithSecret: pick('post', '/v1/webhook_endpoints', '201'),
    WebhookEndpointList: pick('get', '/v1/webhook_endpoints', '200'),
    WebhookDelivery: pick('get', '/v1/webhook_endpoints/{id}/deliveries', '200')?.properties?.data?.items,
    WebhookDeliveryList: pick('get', '/v1/webhook_endpoints/{id}/deliveries', '200'),
    ReplayResult: pick('post', '/v1/webhook_endpoints/{id}/deliveries/replay', '200'),
    Media: pick('get', '/v1/media/{id}', '200'),
    TemplateMedia: pick('post', '/v1/templates/media', '201'),
    Usage: pick('get', '/v1/usage', '200'),
    Whoami: pick('get', '/v1/whoami', '200'),
  }
  for (const [name, schema] of Object.entries(registry)) {
    if (!schema) throw new Error(`Could not locate the source schema for ${name}`)
    named[name] = structuredClone(schema)
  }
  const byShape = new Map(Object.entries(named).map(([name, s]) => [canonical(s), name]))

  const refify = (node, selfName) => {
    if (Array.isArray(node)) return node.map((n) => refify(n, selfName))
    if (!node || typeof node !== 'object') return node
    const hit = byShape.get(canonical(node))
    if (hit && hit !== selfName) return { $ref: `#/components/schemas/${hit}` }
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, refify(v, selfName)]))
  }

  for (const item of Object.values(paths)) {
    for (const op of Object.values(item)) {
      for (const response of Object.values(op.responses)) {
        if (response.content) response.content = refify(response.content)
      }
      if (op.requestBody?.content) op.requestBody.content = refify(op.requestBody.content)
    }
  }

  const schemas = {}
  for (const [name, schema] of Object.entries(named)) {
    // A component's own top level must stay inline; only its nested parts become refs.
    const inner = Object.fromEntries(
      Object.entries(schema).map(([k, v]) => [k, refify(v, name)])
    )
    schemas[name] = applyDescriptions(inner, COPY.schemas[name])
  }

  // A rotated or created endpoint repeats the base fields: keep the full object explicit.
  const spec = {
    openapi: '3.0.3',
    info: COPY.info,
    servers: [{ url: 'https://api.routa.chat', description: 'Produção' }],
    tags: COPY.tags,
    security: [{ bearerAuth: [] }],
    paths: sortPaths(paths),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description:
            'Chave de API do projeto, no formato `rt_live_...` ou `rt_test_...`, enviada como `Authorization: Bearer <chave>`.',
        },
      },
      schemas,
    },
  }

  await writeFile(resolve(root, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`)
  const count = Object.values(paths).reduce((n, item) => n + Object.keys(item).length, 0)
  console.log(`openapi.json written: ${count} operations, ${Object.keys(schemas).length} schemas`)
}

const sortPaths = (paths) => {
  const order = COPY.operationOrder
  const entries = []
  for (const [path, item] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(item)) {
      entries.push([`${method.toUpperCase()} ${path}`, path, method, op])
    }
  }
  entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
  const out = {}
  for (const [, path, method, op] of entries) {
    out[path] = out[path] ?? {}
    out[path][method] = op
  }
  return out
}

// Adds property descriptions/examples by dotted path, e.g. "content" or "data.items".
const applyDescriptions = (schema, notes = {}) => {
  const clone = structuredClone(schema)
  for (const [dotted, note] of Object.entries(notes)) {
    const segments = dotted.split('.')
    let target = clone
    for (const segment of segments) {
      if (!target) break
      target = segment === '[]' ? target.items : target.properties?.[segment]
    }
    if (!target || '$ref' in target) {
      console.warn(`warning: no inline property at ${dotted}`)
      continue
    }
    if (typeof note === 'string') target.description = note
    else Object.assign(target, note)
  }
  return clone
}

await main()
