---
title: Create SMTP Password
titleTemplate: 🪪 Sub-Accounts
---

# Create SMTP Password<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Creates a new API key for the specified sub-account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.createSmtpPassword('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.createSmtpPassword('validhandle123')
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to create SMTP password for.

## Response

- `data` `SubAccountsSmtpPassword | null` <Badge type="warning">nullable</Badge>
  - `enabled` `boolean` <Badge>guaranteed</Badge>: Whether the SMTP password is enabled.
  - `id` `number` <Badge>guaranteed</Badge>: The SMTP password ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: SMTP password for the sub-account.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-create-smtp-password.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**SMTP Password type declarations**

<<< @/snippets/sub-accounts-smtp-password.ts
<<< @/snippets/sub-accounts-create-smtp-password-response.ts
