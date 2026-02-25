---
title: Add List Entry
titleTemplate: 📋 Lists
---

# Add List Entry<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/lists">📋 Lists</a></Badge></llm-exclude>

Add an entry to an account-level blocklist or safelist.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Lists } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { data, error } = await lists.addListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.lists.addListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

## Params

- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The list to add the item to.
  - `item` `string` <Badge type="danger">required</Badge>: The item to add to the list. This can be a domain, email address, or IP address.

## Response

- `data` `ListEntry | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/lists-method-add-list-entry.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**List Entry type declarations**

<<< @/snippets/list-names.ts
<<< @/snippets/list-entry-options.ts
<<< @/snippets/list-entry.ts
<<< @/snippets/list-entry-response.ts
