---
title: Delete SMTP Password
titleTemplate: 🪪 Sub-Accounts
---

# Delete SMTP Password<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Deletes the SMTP password identified by its ID for the specified sub-account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.deleteSmtpPassword('validhandle123', 1)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.deleteSmtpPassword('validhandle123', 1)
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account for which the SMTP password should be deleted.
- `id` `number` <Badge type="danger">required</Badge>: The ID of the SMTP password to delete.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-delete-smtp-password.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
