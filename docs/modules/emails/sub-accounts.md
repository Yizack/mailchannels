---
outline: deep
---

# Sub Accounts

Manage your sub-accounts associated with your MailChannels account.

## List method

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new CheckDomain(mailchannels)

const { results } = await emails.listSubAccounts();
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.emails.listSubAccounts();
```
:::

### Params

- `options`: List sub-accounts options.
  - `limit`: The number of sub-accounts to return. Possible values are 1 to 1000.
  - `offset`: The offset number to start returning sub-accounts from.

## Type declarations

<<< @/snippets/sub-accounts.ts

<details>
  <summary>All type declarations</summary>

  <<< @/snippets/sub-accounts-list-options.ts
  <<< @/snippets/sub-accounts-list-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails/check-domain.ts)
