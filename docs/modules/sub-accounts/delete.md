# Delete<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Deletes the sub-account identified by its handle.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.delete('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.delete('validhandle123')
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to be deleted.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-delete.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
