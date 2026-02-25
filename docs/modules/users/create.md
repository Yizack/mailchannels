---
title: Create
titleTemplate: 📥 Users
---

# Create<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/users">📥 Users</a></Badge></llm-exclude>

Create a recipient user.

## Usage

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

## Params

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

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `email` `string` <Badge>guaranteed</Badge>
  - `roles` `string[]` <Badge>guaranteed</Badge>
  - `filter` `boolean` <Badge type="info">optional</Badge>
  - `listEntries` `object[]` <Badge>guaranteed</Badge>
    - `item` `string` <Badge>guaranteed</Badge>
    - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
    - `action` `"safelist" | "blocklist"` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/users-method-create.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Create type declarations**

<<< @/snippets/users-create-options.ts
<<< @/snippets/users-create-response.ts
