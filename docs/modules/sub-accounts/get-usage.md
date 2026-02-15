# Get Usage <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge>

Retrieves usage statistics for the specified sub-account during the current billing period.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.getUsage('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.getUsage('validhandle123')
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to query usage stats for.

## Response

- `data` `SubAccountsUsage | null` <Badge type="warning">nullable</Badge>
  - `endDate` `string` <Badge type="info">optional</Badge>: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge type="info">optional</Badge>: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge>guaranteed</Badge>: The total usage for the current billing period.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-get-usage.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Usage type declarations**

<<< @/snippets/sub-accounts-usage.ts
<<< @/snippets/sub-accounts-usage-response.ts
