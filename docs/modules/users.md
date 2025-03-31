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

## Type declarations

<<< @/snippets/users.ts

<details>
  <summary>All type declarations</summary>

  **Create type declarations**

  <<< @/snippets/users-create-options.ts
  <<< @/snippets/users-create-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/users.ts)
