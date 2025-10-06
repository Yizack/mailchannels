# 🪪 Sub-Accounts <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
Manage your sub-accounts associated with your MailChannels account.
<!-- #endregion description -->

> [!IMPORTANT]
> Sub-accounts are only available to parent accounts on 100K and higher plans.

## Create <Badge type="info" text="method" />

Creates a new sub-account under the parent account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { account } = await subAccounts.create('My Company', 'validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { account } = await mailchannels.subAccounts.create('My Company', 'validhandle123')
```
:::

### Params

- `companyName`: The name of the company associated with the sub-account.
  > [!TIP]
  > This name is used for display purposes only and does not affect the functionality of the sub-account. The length must be between 3 and 128 characters.
- `handle`: The handle of the sub-account to create.
  > [!TIP]
  > The length must be between 3 and 128 characters, and it may contain only lowercase letters and numbers.
  >
  > If no handle is provided, a random handle will be generated.

## List <Badge type="info" text="method" />

Retrieves all sub-accounts associated with the parent account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { accounts } = await subAccounts.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
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
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.delete('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.delete('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to be deleted.

## Suspend <Badge type="info" text="method" />

Suspends the sub-account identified by its handle. This action disables the account, preventing it from sending any emails until it is reactivated.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.suspend('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.suspend('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to be suspended.

## Activate <Badge type="info" text="method" />

Activates a suspended sub-account identified by its handle, restoring its ability to send emails.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.activate('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.activate('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to be activated.

## Create API Key <Badge type="info" text="method" />

Creates a new API key for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { key } = await subAccounts.createApiKey('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
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
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { keys } = await subAccounts.listApiKeys('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { keys } = await mailchannels.subAccounts.listApiKeys('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to retrieve the API keys for.

## Delete API Key <Badge type="info" text="method" />

Deletes the API key identified by its ID for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { key } = await subAccounts.deleteApiKey('validhandle123', 1)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.subAccounts.deleteApiKey('validhandle123', 1)
```
:::

### Params

- `handle`: The handle of the sub-account for which the API key should be deleted.
- `id`: The ID of the API key to delete.

## Create SMTP Password <Badge type="info" text="method" />

Creates a new API key for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { password } = await subAccounts.createSmtpPassword('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
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
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { keys } = await subAccounts.listSmtpPasswords('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { keys } = await mailchannels.subAccounts.listSmtpPasswords('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to retrieve the SMTP passwords for.

## Delete SMTP Password <Badge type="info" text="method" />

Deletes the SMTP password identified by its ID for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { key } = await subAccounts.deleteSmtpPassword('validhandle123', 1)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.subAccounts.deleteSmtpPassword('validhandle123', 1)
```
:::

### Params

- `handle`: The handle of the sub-account for which the SMTP password should be deleted.
- `id`: The ID of the SMTP password to delete.

## Get Limit <Badge type="info" text="method" />

Retrieves the limit of a specified sub-account.

> [!TIP]
> A value of `-1` indicates that the sub-account inherits the parent account's limit, allowing the sub-account to utilize any remaining capacity within the parent account's allocation.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { limit } = await subAccounts.getLimit('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { limit } = await mailchannels.subAccounts.getLimit('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to retrieve the limit for.

## Set Limit <Badge type="info" text="method" />

Sets the limit for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.setLimit('validhandle123', { sends: 1000 })
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.setLimit('validhandle123', { sends: 1000 })
```
:::

### Params

- `handle`: The handle of the sub-account to set the limit for.
- `limits`: The limits to set for the sub-account.
  - `sends`
  > [!TIP]
  > The minimum allowed sends is `0`.

## Delete Limit <Badge type="info" text="method" />

Deletes the limit for the specified sub-account. After a successful deletion, the specified sub-account will be limited to the parent account's limit.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success } = await subAccounts.deleteLimit('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.subAccounts.deleteLimit('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to delete the limit for.

## Get Usage <Badge type="info" text="method" />

Retrieves usage statistics for the specified sub-account during the current billing period.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { SubAccounts } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { usage } = await subAccounts.getUsage('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { usage } = await mailchannels.subAccounts.getUsage('validhandle123')
```
:::

### Params

- `handle`: The handle of the sub-account to query usage stats for.

## Type declarations

<<< @/snippets/sub-accounts.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **Account type declarations**

  <<< @/snippets/sub-accounts-account.ts
  <<< @/snippets/sub-accounts-create-response.ts
  <<< @/snippets/sub-accounts-list-options.ts
  <<< @/snippets/sub-accounts-list-response.ts

  **API Key type declarations**

  <<< @/snippets/sub-accounts-api-key.ts
  <<< @/snippets/sub-accounts-create-api-key-response.ts
  <<< @/snippets/sub-accounts-list-api-key-response.ts

  **SMTP Password type declarations**

  <<< @/snippets/sub-accounts-smtp-password.ts
  <<< @/snippets/sub-accounts-create-smtp-password-response.ts
  <<< @/snippets/sub-accounts-list-smtp-password-response.ts

  **Limit type declaration**

  <<< @/snippets/sub-accounts-limit.ts
  <<< @/snippets/sub-accounts-limit-response.ts

  **Usage type declarations**

  <<< @/snippets/sub-accounts-usage.ts
  <<< @/snippets/sub-accounts-usage-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/sub-accounts.ts)
