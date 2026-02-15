# Create API Key <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge>

Creates a new API key for the specified sub-account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.createApiKey('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.createApiKey('validhandle123')
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to create API key for.

## Response

- `data` `SubAccountsApiKey | null` <Badge type="warning">nullable</Badge>
  - `id` `number` <Badge>guaranteed</Badge>: The API key ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: API key for the sub-account.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-create-api-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**API Key type declarations**

<<< @/snippets/sub-accounts-api-key.ts
<<< @/snippets/sub-accounts-create-api-key-response.ts
