---
title: Bulk Create Login Links
titleTemplate: 🌐 Domains
---

# Bulk Create Login Links<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge></llm-exclude>

Generate a batch of links that allow a user to log in as a domain administrator to their different domains.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.bulkCreateLoginLinks([
  'example.com',
  'example2.com'
])
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.bulkCreateLoginLinks([
  'example.com',
  'example2.com'
])
```
:::

## Params

- `domains` `string[]` <Badge type="danger">required</Badge>: A list of domain names to generate login links for. Maximum of `1000` domains per request.

## Response

- `data` `DomainsBulkCreateLoginLinks | null` <Badge type="warning">nullable</Badge>
  - `successes` `DomainsBulkCreateLoginLinkResult[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: The domain the request was for.
    - `code` `200` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
    - `loginLink` `string` <Badge>guaranteed</Badge>: If a user browses to this URL, they will be automatically logged in as a domain admin.
  - `errors` `DomainsBulkCreateLoginLinkResult[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: The domain the request was for.
    - `code` `400 | 401 | 403 | 404 | 500` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-bulk-create-login-links.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Bulk Create Login Links type declarations**

<<< @/snippets/domains-bulk-create-login-link-result.ts
<<< @/snippets/domains-bulk-create-login-links.ts
<<< @/snippets/domains-bulk-create-login-links-response.ts
