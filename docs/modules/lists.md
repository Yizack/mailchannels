---
outline: deep
---

# 📋 Lists <Badge>module</Badge> <Badge>Inbound API</Badge>

<!-- #region description -->
Manage account-level lists.
<!-- #endregion description -->

## Add List Entry <Badge type="info">method</Badge>

Add an entry to an account-level blocklist or safelist.

### Usage

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

### Params

- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The list to add the item to.
  - `item` `string` <Badge type="danger">required</Badge>: The item to add to the list. This can be a domain, email address, or IP address.

### Response

- `data` `ListEntry | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## List Entries <Badge type="info">method</Badge>

Get account-level list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Lists } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { data, error } = await lists.listEntries('safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.lists.listEntries('safelist')
```
:::

### Params

- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to fetch.

### Response

- `data` `ListEntry[] | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Delete List Entry <Badge type="info">method</Badge>

Delete item from account-level list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Lists } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { success, error } = await lists.deleteListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.lists.deleteListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger">required</Badge>: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Type declarations

<<< @/snippets/lists.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts

  **List Entry type declarations**

  <<< @/snippets/list-names.ts
  <<< @/snippets/list-entry-options.ts
  <<< @/snippets/list-entry.ts
  <<< @/snippets/list-entry-response.ts
  <<< @/snippets/list-entries-response.ts
</details>
