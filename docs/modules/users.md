---
outline: deep
---

# 📥 Users <Badge>module</Badge> <Badge>Inbound API</Badge>

<!-- #region description -->
Manage your MailChannels Inbound recipient users.
<!-- #endregion description -->

## Create <Badge type="info">method</Badge>

Create a recipient user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Users } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { data, error } = await users.create('name@example.com', {
  admin: true
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.users.create('name@example.com', {
  admin: true
})
```
:::

### Params

- `email` `string` <Badge type="danger">required</Badge>: The email address of the user to create.
- `options` `UsersCreateOptions` <Badge type="info">optional</Badge>: Options for creating the user.
  - `admin` `boolean` <Badge type="info">optional</Badge>: Flag to indicate if the user is a domain admin or a regular user.
    > [!NOTE]
    > If `admin` is not set, defaults to `false`.
  - `filter` `boolean | "compute"` <Badge type="info">optional</Badge>: Whether or not to filter mail for this recipient. There are three valid values. Defaults to `compute`.
    > [!TIP]
    > Possible values are `false`, `true`, and `compute`.
    > - `false`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, return an error.
    > - `true`: Filtering policy will not be applied to messages intended for this recipient.
    > - `compute`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, filtering policy will not be applied, and no error will be returned.
  - `listEntries` `object` <Badge type="info">optional</Badge>: Safelist and blocklist entries to be added.
    - `blocklist` `string[]` <Badge type="info">optional</Badge>: A list of items to add to the blocklist.
    - `safelist` `string[]` <Badge type="info">optional</Badge>: A list of items to add to the safelist.

### Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `email` `string` <Badge>guaranteed</Badge>
  - `roles` `string[]` <Badge>guaranteed</Badge>
  - `filter` `boolean` <Badge type="info">optional</Badge>
  - `listEntries` `object[]` <Badge>guaranteed</Badge>
    - `item` `string` <Badge>guaranteed</Badge>
    - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
    - `action` `"safelist" | "blocklist"` <Badge>guaranteed</Badge>
<!-- @include: _parts/error-response.md -->

## Add List Entry <Badge type="info">method</Badge>

Add an entry to a recipient user blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Users } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { data, error } = await users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email` `string` <Badge type="danger">required</Badge>: The email address of the recipient whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The list to add the item to.
  - `item` `string` <Badge type="danger">required</Badge>: The item to add to the list. This can be a domain, email address, or IP address.

### Response

- `data` `ListEntry | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
<!-- @include: _parts/error-response.md -->

## List Entries <Badge type="info">method</Badge>

Get recipient list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Users } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { data, error } = await users.listEntries('name@example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.users.listEntries('name@example.com', 'safelist')
```
:::

### Params

- `email` `string` <Badge type="danger">required</Badge>: The email address of the recipient whose list will be fetched.
- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to fetch.

### Response

- `data` `ListEntry[] | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
<!-- @include: _parts/error-response.md -->

## Delete List Entry <Badge type="info">method</Badge>

Delete item from recipient list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Users } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { success, error } = await users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email` `string` <Badge type="danger">required</Badge>: The email address of the recipient whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger">required</Badge>: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Type declarations

<<< @/snippets/users.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
  <<< @/snippets/success-response.ts

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
