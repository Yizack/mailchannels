---
title: List SMTP Passwords
titleTemplate: 🪪 Sub-Accounts
---

# List SMTP Passwords<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.listSmtpPasswords('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.listSmtpPasswords('validhandle123')
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to retrieve the SMTP passwords for.

## Response

- `data` `SubAccountsSmtpPassword[] | null` <Badge type="warning">nullable</Badge>
  - `enabled` `boolean` <Badge>guaranteed</Badge>: Whether the SMTP password is enabled.
  - `id` `number` <Badge>guaranteed</Badge>: The SMTP password ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: SMTP password for the sub-account.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-list-smtp-passwords.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**SMTP Password type declarations**

<<< @/snippets/sub-accounts-smtp-password.ts
<<< @/snippets/sub-accounts-list-smtp-password-response.ts
