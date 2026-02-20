# Set Limit<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/sub-accounts">🪪 Sub-Accounts</a></Badge></llm-exclude>

Sets the limit for the specified sub-account.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.setLimit('validhandle123', { sends: 1000 })
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.setLimit('validhandle123', { sends: 1000 })
```
:::

## Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to set the limit for.
- `limits` `object` <Badge type="danger">required</Badge>: The limits to set for the sub-account.
  - `sends` `number` <Badge type="danger">required</Badge>
  > [!TIP]
  > The minimum allowed sends is `0`.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/sub-accounts-method-set-limit.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Limit type declaration**

<<< @/snippets/sub-accounts-limit.ts
