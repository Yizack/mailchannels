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
import { MailChannelsClient } from '@yizack/mailchannels'
import { Users } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { user } = await users.create('name@example.com', {
  admin: true
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { user } = await mailchannels.users.create('name@example.com', {
  admin: true
})
```
:::

### Params

- `email`: The email address of the user to create.
- `options`: Options for creating the user.
  - `admin`: Flag to indicate if the user is a domain admin or a regular user.
    > [!NOTE]
    > If `admin` is not set, defaults to `false`.
  - `filter`: Whether or not to filter mail for this recipient. There are three valid values.
    > [!TIP]
    > Possible values are `false`, `true`, and `compute`.
    > - `false`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, return an error.
    > - `true`: Filtering policy will not be applied to messages intended for this recipient.
    > - `compute`: Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, filtering policy will not be applied, and no error will be returned.
  - `listEntries`: Safelist and blocklist entries to be added.
    - `blocklist`: A list of items to add to the blocklist.
    - `safelist`: A list of items to add to the safelist.

## Add List Entry <Badge type="info" text="method" />

Add an entry to a recipient user blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Users } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { entry } = await users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.users.addListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email`: The email address of the recipient whose list will be modified.
- `options`: Add list entry options.
  - `listName`: The list to add the item to. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
  - `item`: The item to add to the list. This can be a domain, email address, or IP address.

## List Entries <Badge type="info" text="method" />

Get recipient list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Users } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { entry } = await users.listEntries('name@example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.users.listEntries('name@example.com', 'safelist')
```
:::

### Params

- `email`:  The email address of the recipient whose list will be fetched.
- `listName`: The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.

## Delete List Entry <Badge type="info" text="method" />

Delete item from recipient list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Users } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const users = new Users(mailchannels)

const { entry } = await users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.users.deleteListEntry('name@example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email`: The email address of the recipient whose list will be modified.
- `options`: Add list entry options.
  - `listName`: The name of the list to remove an entry from. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
  - `item`: The list entry which should be removed. This can be a domain, email address, or IP address.

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

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/users.ts)
