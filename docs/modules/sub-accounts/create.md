# Create<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Creates a new sub-account under the parent account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.create('My Company', 'validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.create('My Company', 'validhandle123')
```
:::

## Params

- `companyName` `string` <Badge type="danger">required</Badge>: The name of the company associated with the sub-account.
  > [!TIP]
  > This name is used for display purposes only and does not affect the functionality of the sub-account. The length must be between 3 and 128 characters.
- `handle` `string` <Badge type="info">optional</Badge>: The handle of the sub-account to create.
  > [!TIP]
  > The length must be between 3 and 128 characters, and it may contain only lowercase letters and numbers.
  >
  > If no handle is provided, a random handle will be generated.

## Response

- `data` `SubAccountsAccount | null` <Badge type="warning">nullable</Badge>
  - `companyName` `string` <Badge>guaranteed</Badge>: The name of the company associated with the sub-account.
  - `enabled` `boolean` <Badge>guaranteed</Badge>: If the sub-account is enabled.
  - `handle` `string` <Badge>guaranteed</Badge>: The handle for the sub-account.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-create.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Account type declarations**

<<< @/snippets/sub-accounts-account.ts
<<< @/snippets/sub-accounts-create-response.ts
