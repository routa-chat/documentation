# Routa documentation

Official documentation for [Routa](https://routa.chat), the messaging infrastructure by MultiON. Built with [Mintlify](https://mintlify.com). The content is written in Brazilian Portuguese.

## What is covered

| Tab | Content |
| --- | --- |
| **Documentação** | Quickstart, API keys and scopes, environments, concepts (data model, messages, events, templates, media), guides, webhooks, reliability (idempotency, rate limits, pagination, delivery guarantees), errors and billing. |
| **Referência da API** | Introduction (base URL, formats, limits, conventions) and one page per public endpoint, generated from `openapi.json`. |
| **SDK Node.js** | Installation, configuration, resources, webhooks, pagination, error handling and types for `@routa-chat/sdk`. |

Only the public, API-key-authenticated surface (`/v1/messages`, `/v1/events`, `/v1/webhook_endpoints`, `/v1/templates`, `/v1/media`, `/v1/usage`, `/v1/whoami`) is documented. Dashboard routes (sessions, projects, API keys, channels, members, billing) are intentionally left out.

## Repository layout

```text
docs.json                 Mintlify configuration and navigation
index.mdx, quickstart.mdx Entry pages
authentication.mdx        API keys and scopes
environments.mdx          Live and test projects
concepts/                 Data model, messages, events, templates, media
guides/                   Task-oriented guides
webhooks/                 Setup, signatures, retries, event types, reconciliation
reliability/              Idempotency, rate limits, pagination, delivery guarantees
errors/                   Error format and code catalog
billing/                  Plans, allowance and usage
api-reference/            Introduction and endpoint pages
sdk/                      Node.js SDK documentation
openapi.json              Public OpenAPI spec (generated, do not edit by hand)
scripts/                  Spec generator and its Portuguese copy
```

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) and run the preview at the root of the repository, where `docs.json` lives:

```bash
npm i -g mint
mint dev
```

The preview runs at `http://localhost:3000`. If the Routa API is already using that port, pick another one:

```bash
mint dev --port 3333
```

Before opening a pull request, run:

```bash
mint validate
mint broken-links
```

## Updating the API reference

`openapi.json` is generated from the live OpenAPI document that `apps/api` of the `routa` repository serves outside production. Do not edit it by hand.

1. Start the Routa API locally (it serves `http://localhost:3000/docs/json`).
2. Rebuild the spec:

   ```bash
   node scripts/build-openapi.mjs
   # or from a saved file or another URL
   node scripts/build-openapi.mjs path/to/docs-json.json
   ```

3. Review the diff of `openapi.json`.
4. If the API gained an operation, the script stops and asks for its copy. Add it to `scripts/openapi-copy.mjs` (summary, description, required scope), create the matching page under `api-reference/endpoint/`, and add it to `docs.json`.

The script keeps only the public routes, converts the Elysia output into plain OpenAPI 3.0, extracts shared schemas into `components`, and applies the Portuguese titles, descriptions and examples from `scripts/openapi-copy.mjs`.

## Writing guidelines

See [`AGENTS.md`](./AGENTS.md) for terminology, style and content boundaries.

## Publishing

Install the Mintlify GitHub app from the [dashboard](https://dashboard.mintlify.com/settings/organization/github-app). Changes are deployed to production automatically after pushing to the default branch.

## License

[MIT](./LICENSE)
