# Documentation project instructions

## About this project

- This is the official documentation site for **Routa**, a MultiON product: messaging infrastructure (WhatsApp first) with a REST API, an official Node.js SDK and webhooks.
- Built on [Mintlify](https://mintlify.com). Pages are MDX files with YAML frontmatter. Configuration lives in `docs.json`.
- The content language is **Brazilian Portuguese**. Commit messages, code comments and this file are in English.
- Sources of truth, in order: the running API and its OpenAPI document (`http://localhost:3000/docs/json`), the `routa` repository (`apps/api`, `packages/*`), then the `routa-nodejs-sdk` repository. The architecture documents in `routa/docs/architecture` describe intent and can be ahead of the code. When they disagree with the code or with a live response, document the code.
- The API reference pages are generated from `openapi.json`, which `scripts/build-openapi.mjs` builds. Never edit `openapi.json` by hand. Change `scripts/openapi-copy.mjs` and rebuild.
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP.
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP.

## Terminology

Use the same Portuguese term everywhere.

| Use | Avoid |
| --- | --- |
| chave de API | token, API key (in prose) |
| projeto | tenant, workspace |
| canal | número, linha (a channel is a configured address, not a phone line) |
| mensagem | SMS, notificação |
| franquia | cota, quota (in prose) |
| entrega (de webhook) | tentativa, callback |
| endpoint de webhook | webhook (when you mean the registered resource) |
| aceita (`accepted`) | enviada, when the message has not reached the provider |
| painel | dashboard, console |

- Keep API identifiers, field names, error codes and event types in English and in code formatting: `message.delivered`, `channel_inactive`, `Idempotency-Key`.
- Write `WhatsApp`, `Routa`, `MultiON`, `Meta` as shown.
- Never expose the provider as a public concept. Say "provedor", not the provider's product name, except in the supported-media table where WhatsApp limits apply.

## Style preferences

- Use active voice and second person ("você").
- Keep sentences concise: one idea per sentence.
- Use sentence case for headings.
- Bold for UI elements: clique em **Configurações**.
- Code formatting for file names, commands, paths, fields and code references.
- Show `cURL` and Node.js side by side in a `<CodeGroup>` whenever both exist.
- Use `<Note>`, `<Info>`, `<Tip>` and `<Warning>` sparingly. A `<Warning>` is for something that causes data loss, duplicates, security exposure or surprise charges.
- Start every endpoint-related claim by checking the code or a live response. Do not copy numbers (limits, timeouts, retention) from architecture documents without confirming them.

## Content boundaries

Document:

- The public data-plane API authenticated by API key: messages, events, webhook endpoints, templates, media, usage and `whoami`.
- Behavior a customer can observe: statuses, events, errors, headers, limits and retention that are part of the published contract.
- The official Node.js SDK and its known gaps.

Do not document:

- Control-plane routes authenticated by session cookie (organizations, sessions, projects, API key management, channels, members, invitations, billing checkout), except as "done in the dashboard".
- Provider webhook receivers (`/providers/...`), internal queues, workers, database schema, dispatch states and other internals.
- Provider-specific payloads or error codes.
- Prices and plan limits that are marked provisional in the product. Link to the website instead.
- Features that are only planned. If the SDK or API does not support something yet, say so in a "not supported yet" note.
