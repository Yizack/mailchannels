---
outline: deep
---

# 📥 Users <Badge type="tip" text="module" /> <Badge type="tip" text="Inbound API" />

<!-- #region description -->
Manage your MailChannels Inbound recipient users.
<!-- #endregion description -->

## Create <Badge type="info" text="method" />

Create a recipient user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Users } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { user } = await users.create('name@example.com', {
  admin: true
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { user } = await mailchannels.users.create('name@example.com', {
  admin: true
})
```
:::

### Params

- `email` `string` <Badge type="danger" text="required" />: The email address of the user to create.
- `options` `UsersCreateOptions` <Badge type="info" text="optional" />: Options for creating the user.
  - `admin` `boolean` <Badge type="info" text="optional" />: Flag to indicate if the user is a domain admin or a regular user.
    > [!NOTE]
    > If `admin` is not set, defaults to `false`.
  - `filter` `boolean | "compute"` <Badge type="info" text="optional" />: Whether or not to filter mail for this recipient. There are three valid values. Defaults to `compute`.
    > [!TIP]
    > Possible values are `false`, `true`, and `compute`.
    > - `false`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, return an error.
    > - `true`: Filtering policy will not be applied to messages intended for this recipient.
    > - `compute`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, filtering policy will not be applied, and no error will be returned.
  - `listEntries` `object` <Badge type="info" text="optional" />: Safelist and blocklist entries to be added.
    - `blocklist` `string[]` <Badge type="info" text="optional" />: A list of items to add to the blocklist.
    - `safelist` `string[]` <Badge type="info" text="optional" />: A list of items to add to the safelist.

### Response

- `user` `object | null` <Badge type="warning" text="nullable" />
  - `email` `string` <Badge text="guaranteed" />
  - `roles` `string[]` <Badge text="guaranteed" />
  - `filter` `boolean` <Badge type="info" text="optional" />
  - `listEntries` `object[]` <Badge text="guaranteed" />
    - `item` `string` <Badge text="guaranteed" />
    - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
    - `action` `"safelist" | "blocklist"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Add List Entry <Badge type="info" text="method" />

Add an entry to a recipient user blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Users } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { entry } = await users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email` `string` <Badge type="danger" text="required" />: The email address of the recipient whose list will be modified.
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

Get recipient list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Users } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { entries } = await users.listEntries('name@example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entries } = await mailchannels.users.listEntries('name@example.com', 'safelist')
```
:::

### Params

- `email` `string` <Badge type="danger" text="required" />: The email address of the recipient whose list will be fetched.
- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to fetch.

### Response

- `entries` `ListEntry[]` <Badge text="guaranteed" />
  - `action` `"blocklist" | "safelist"` <Badge text="guaranteed" />
  - `item` `string` <Badge text="guaranteed" />
  - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Delete List Entry <Badge type="info" text="method" />

Delete item from recipient list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Users } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { success } = await users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email` `string` <Badge type="danger" text="required" />: The email address of the recipient whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger" text="required" />: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger" text="required" />: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Type declarations

<<< @/snippets/users.ts

<details>
  <summary>All type declarations</summary>

  **Create type declarations**

  <<< @/snippets/users-create-options.ts
  <<< @/snippets/users-create-response.ts

  **List Entry type declarations**

  <<< @/snippets/list-names.ts
  <<< @/snippets/list-entry-options.ts
  <<< @/snippets/list-entry.ts
  <<< @/snippets/list-entry-response.ts
  <<< @/snippets/list-entries-response.ts
</details>
