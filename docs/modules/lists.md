---
outline: deep
---

# 📋 Lists <Badge type="tip" text="module" /> <Badge type="tip" text="Inbound API" />

<!-- #region description -->
Manage account-level lists.
<!-- #endregion description -->

## Add List Entry <Badge type="info" text="method" />

Add an entry to an account-level blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Lists } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { entry } = await lists.addListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.lists.addListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `options` `ListEntryOptions` <Badge type="danger" text="required" />: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The list to add the item to.
  - `item` `string` <Badge type="danger" text="required" />: The item to add to the list. This can be a domain, email address, or IP address.

### Response

- `entry` `ListEntry | null` <Badge type="warning" text="nullable" />
  - `action` `"blocklist" | "safelist"` <Badge text="guaranteed" />
  - `item` `string` <Badge text="guaranteed" />
  - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## List Entries <Badge type="info" text="method" />

Get account-level list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Lists } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { entries } = await lists.listEntries('safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entries } = await mailchannels.lists.listEntries('safelist')
```
:::

### Params

- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to fetch.

### Response

- `entries` `ListEntry[]` <Badge text="guaranteed" />
  - `action` `"blocklist" | "safelist"` <Badge text="guaranteed" />
  - `item` `string` <Badge text="guaranteed" />
  - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Delete List Entry <Badge type="info" text="method" />

Delete item from account-level list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Lists } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const lists = new Lists(mailchannels)

const { success } = await lists.deleteListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.lists.deleteListEntry({
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `options` `ListEntryOptions` <Badge type="danger" text="required" />: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger" text="required" />: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Type declarations

<<< @/snippets/lists.ts

<details>
  <summary>All type declarations</summary>

  **List Entry type declarations**

  <<< @/snippets/list-names.ts
  <<< @/snippets/list-entry-options.ts
  <<< @/snippets/list-entry.ts
  <<< @/snippets/list-entry-response.ts
  <<< @/snippets/list-entries-response.ts
</details>
