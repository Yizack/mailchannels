# Sub-Accounts <Badge type="tip" text="module" />

<!-- #region description -->
Manage your sub-accounts associated with your MailChannels account.
<!-- #endregion description -->

## Create <Badge type="info" text="method" />

Creates a new sub-account under the parent account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { account } = await subAccounts.create('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { account } = await mailchannels.subAccounts.create('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to create.
  > [!TIP]
  > Sub-account handle must match the pattern `[a-z0-9]{3,128}`.
  >
  > If no handle is provided, a random handle will be generated.

## List <Badge type="info" text="method" />

Retrieves all sub-accounts associated with the parent account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { accounts } = await subAccounts.list()
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { accounts } = await mailchannels.subAccounts.list()
```
:::

### Params

- `options`: List sub-accounts options.
  - `limit`: The number of sub-accounts to return. Possible values are 1 to 1000.
  - `offset`: The offset number to start returning sub-accounts from.
  > [!TIP]
  > If no options are provided, the default limit is `1000` and the offset is `0`.

## Delete <Badge type="info" text="method" />

Deletes the sub-account identified by its handle.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.delete('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.delete('validhandle123')
```
:::

### Params

- `handle`: The handle of sub-account to be deleted.

## Create API Key <Badge type="info" text="method" />

Creates a new API key for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { key } = await subAccounts.createApiKey('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.subAccounts.createApiKey('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to create API key for.

## List API Keys <Badge type="info" text="method" />

Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { keys } = await subAccounts.listApiKeys('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { keys } = await mailchannels.subAccounts.listApiKeys('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to retrieve the API keys for.

## Create SMTP Password <Badge type="info" text="method" />

Creates a new API key for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { password } = await subAccounts.createSmtpPassword('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { password } = await mailchannels.subAccounts.createSmtpPassword('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to create SMTP password for.

## List SMTP Passwords <Badge type="info" text="method" />

Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { SubAccounts } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { keys } = await subAccounts.listSmtpPasswords('validhandle123')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { keys } = await mailchannels.subAccounts.listSmtpPasswords('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to retrieve the SMTP passwords for.

## Type declarations

<<< @/snippets/sub-accounts.ts

<details>
  <summary>All type declarations</summary>

  **Create type declarations**

  <<< @/snippets/sub-accounts-account.ts

  **List type declarations**

  <<< @/snippets/sub-accounts-list-options.ts

  **API Key type declarations**

  <<< @/snippets/sub-accounts-api-key.ts

  **SMTP Password type declarations**

  <<< @/snippets/sub-accounts-smtp-password.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/sub-accounts.ts)
