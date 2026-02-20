# List<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Retrieves all sub-accounts associated with the parent account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.list()
```
:::

## Params

- `options` `SubAccountsListOptions` <Badge type="info">optional</Badge>: List sub-accounts options.
  - `limit` `number` <Badge type="info">optional</Badge>: The number of sub-accounts to return. Possible values are 1 to 1000.
  - `offset` `number` <Badge type="info">optional</Badge>: The offset number to start returning sub-accounts from.
  > [!TIP]
  > If no options are provided, the default limit is `1000` and the offset is `0`.

## Response

- `data` `SubAccountsAccount[] | null` <Badge type="warning">nullable</Badge>
  - `companyName` `string` <Badge>guaranteed</Badge>: The name of the company associated with the sub-account.
  - `enabled` `boolean` <Badge>guaranteed</Badge>: If the sub-account is enabled.
  - `handle` `string` <Badge>guaranteed</Badge>: The handle for the sub-account.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-list.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Account type declarations**

<<< @/snippets/sub-accounts-account.ts
<<< @/snippets/sub-accounts-list-options.ts
<<< @/snippets/sub-accounts-list-response.ts
