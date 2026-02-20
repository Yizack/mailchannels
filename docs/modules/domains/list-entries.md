# List Entries<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge></llm-exclude>

Get domain list entries.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.listEntries('example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.listEntries('example.com', 'safelist')
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name whose list will be fetched.
- `listName` `ListNames` <Badge type="danger">required</Badge>: The name of the list to fetch.

## Response

- `data` `ListEntry[] | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-list-entries.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**List Entry type declarations**

<<< @/snippets/list-names.ts
<<< @/snippets/list-entry.ts
<<< @/snippets/list-entries-response.ts
