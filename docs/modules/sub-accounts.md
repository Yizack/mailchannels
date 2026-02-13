# 🪪 Sub-Accounts <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
Manage your sub-accounts associated with your MailChannels account.
<!-- #endregion description -->

> [!IMPORTANT]
> Sub-accounts are only available to parent accounts on 100K and higher plans.

## Create <Badge type="info">method</Badge>

Creates a new sub-account under the parent account.

### Usage

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

### Params

- `companyName` `string` <Badge type="danger">required</Badge>: The name of the company associated with the sub-account.
  > [!TIP]
  > This name is used for display purposes only and does not affect the functionality of the sub-account. The length must be between 3 and 128 characters.
- `handle` `string` <Badge type="info">optional</Badge>: The handle of the sub-account to create.
  > [!TIP]
  > The length must be between 3 and 128 characters, and it may contain only lowercase letters and numbers.
  >
  > If no handle is provided, a random handle will be generated.

### Response

- `data` `SubAccountsAccount | null` <Badge type="warning">nullable</Badge>
  - `companyName` `string` <Badge>guaranteed</Badge>: The name of the company associated with the sub-account.
  - `enabled` `boolean` <Badge>guaranteed</Badge>: If the sub-account is enabled.
  - `handle` `string` <Badge>guaranteed</Badge>: The handle for the sub-account.
<!-- @include: _parts/error-response.md -->

## List <Badge type="info">method</Badge>

Retrieves all sub-accounts associated with the parent account.

### Usage

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

### Params

- `options` `SubAccountsListOptions` <Badge type="info">optional</Badge>: List sub-accounts options.
  - `limit` `number` <Badge type="info">optional</Badge>: The number of sub-accounts to return. Possible values are 1 to 1000.
  - `offset` `number` <Badge type="info">optional</Badge>: The offset number to start returning sub-accounts from.
  > [!TIP]
  > If no options are provided, the default limit is `1000` and the offset is `0`.

### Response

- `data` `SubAccountsAccount[] | null` <Badge type="warning">nullable</Badge>
  - `companyName` `string` <Badge>guaranteed</Badge>: The name of the company associated with the sub-account.
  - `enabled` `boolean` <Badge>guaranteed</Badge>: If the sub-account is enabled.
  - `handle` `string` <Badge>guaranteed</Badge>: The handle for the sub-account.
<!-- @include: _parts/error-response.md -->

## Delete <Badge type="info">method</Badge>

Deletes the sub-account identified by its handle.

### Usage

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

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to be deleted.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Suspend <Badge type="info">method</Badge>

Suspends the sub-account identified by its handle. This action disables the account, preventing it from sending any emails until it is reactivated.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.suspend('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.suspend('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to be suspended.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Activate <Badge type="info">method</Badge>

Activates a suspended sub-account identified by its handle, restoring its ability to send emails.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.activate('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.activate('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to be activated.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Create API Key <Badge type="info">method</Badge>

Creates a new API key for the specified sub-account.

### Usage

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

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to create API key for.

### Response

- `data` `SubAccountsApiKey | null` <Badge type="warning">nullable</Badge>
  - `id` `number` <Badge>guaranteed</Badge>: The API key ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: API key for the sub-account.
<!-- @include: _parts/error-response.md -->

## List API Keys <Badge type="info">method</Badge>

Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.listApiKeys('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.listApiKeys('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to retrieve the API keys for.
- `options` `SubAccountsListApiKeyOptions` <Badge type="info">optional</Badge>: List API keys options.
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of API keys included in the response. Possible values are `1` to `1000`.
  - `offset` `number` <Badge type="info">optional</Badge>: Offset into the list of API keys to return.
  > [!TIP]
  > If no options are provided, the default limit is `100` and the offset is `0`.

### Response

- `data` `SubAccountsApiKey[] | null` <Badge type="warning">nullable</Badge>
  - `id` `number` <Badge>guaranteed</Badge>: The API key ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: API key for the sub-account.
<!-- @include: _parts/error-response.md -->

## Delete API Key <Badge type="info">method</Badge>

Deletes the API key identified by its ID for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.deleteApiKey('validhandle123', 1)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.deleteApiKey('validhandle123', 1)
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account for which the API key should be deleted.
- `id` `number` <Badge type="danger">required</Badge>: The ID of the API key to delete.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Create SMTP Password <Badge type="info">method</Badge>

Creates a new API key for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.createSmtpPassword('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.createSmtpPassword('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to create SMTP password for.

### Response

- `data` `SubAccountsSmtpPassword | null` <Badge type="warning">nullable</Badge>
  - `enabled` `boolean` <Badge>guaranteed</Badge>: Whether the SMTP password is enabled.
  - `id` `number` <Badge>guaranteed</Badge>: The SMTP password ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: SMTP password for the sub-account.
<!-- @include: _parts/error-response.md -->

## List SMTP Passwords <Badge type="info">method</Badge>

Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.

### Usage

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

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to retrieve the SMTP passwords for.

### Response

- `data` `SubAccountsSmtpPassword[] | null` <Badge type="warning">nullable</Badge>
  - `enabled` `boolean` <Badge>guaranteed</Badge>: Whether the SMTP password is enabled.
  - `id` `number` <Badge>guaranteed</Badge>: The SMTP password ID for the sub-account.
  - `value` `string` <Badge>guaranteed</Badge>: SMTP password for the sub-account.
<!-- @include: _parts/error-response.md -->

## Delete SMTP Password <Badge type="info">method</Badge>

Deletes the SMTP password identified by its ID for the specified sub-account.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.deleteSmtpPassword('validhandle123', 1)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.deleteSmtpPassword('validhandle123', 1)
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account for which the SMTP password should be deleted.
- `id` `number` <Badge type="danger">required</Badge>: The ID of the SMTP password to delete.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Get Limit <Badge type="info">method</Badge>

Retrieves the limit of a specified sub-account.

> [!TIP]
> A value of `-1` indicates that the sub-account inherits the parent account's limit, allowing the sub-account to utilize any remaining capacity within the parent account's allocation.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { data, error } = await subAccounts.getLimit('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.subAccounts.getLimit('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to retrieve the limit for.

### Response

- `data` `SubAccountsLimit | null` <Badge type="warning">nullable</Badge>
  - `sends` `number` <Badge>guaranteed</Badge>
<!-- @include: _parts/error-response.md -->

## Set Limit <Badge type="info">method</Badge>

Sets the limit for the specified sub-account.

### Usage

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

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to set the limit for.
- `limits` `object` <Badge type="danger">required</Badge>: The limits to set for the sub-account.
  - `sends` `number` <Badge type="danger">required</Badge>
  > [!TIP]
  > The minimum allowed sends is `0`.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Delete Limit <Badge type="info">method</Badge>

Deletes the limit for the specified sub-account. After a successful deletion, the specified sub-account will be limited to the parent account's limit.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, SubAccounts } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const subAccounts = new SubAccounts(mailchannels)

const { success, error } = await subAccounts.deleteLimit('validhandle123')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.subAccounts.deleteLimit('validhandle123')
```
:::

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to delete the limit for.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: _parts/error-response.md -->

## Get Usage <Badge type="info">method</Badge>

Retrieves usage statistics for the specified sub-account during the current billing period.

### Usage

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

### Params

- `handle` `string` <Badge type="danger">required</Badge>: The handle of the sub-account to query usage stats for.

### Response

- `data` `SubAccountsUsage | null` <Badge type="warning">nullable</Badge>
  - `endDate` `string` <Badge type="info">optional</Badge>: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge type="info">optional</Badge>: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge>guaranteed</Badge>: The total usage for the current billing period.
<!-- @include: _parts/error-response.md -->

## Type declarations

<<< @/snippets/sub-accounts.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
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
