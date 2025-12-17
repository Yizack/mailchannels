---
outline: deep
---

# 🚫 Suppressions <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
Manage your MailChannels account suppressions list.
<!-- #endregion description -->

## Create <Badge type="info">method</Badge>

Creates suppression entries for the specified account. Parent accounts can create suppression entries for all associated sub-accounts. If `types` is not provided, it defaults to `non-transactional`. The operation is atomic, meaning all entries are successfully added or none are added if an error occurs.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Suppressions } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { success, error } = await suppressions.create({
  addToSubAccounts: false,
  entries: [
    {
      notes: "test",
      recipient: "name@example.com",
      types: ["transactional"]
    }
  ]
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.suppressions.create({
  addToSubAccounts: false,
  entries: [
    {
      notes: "test",
      recipient: "name@example.com",
      types: ["transactional"]
    }
  ]
})
```
:::

### Params

- `options` `SuppressionsCreateOptions` <Badge type="danger">required</Badge>: The details of the suppression entries to create.
  - `addToSubAccounts` `boolean` <Badge type="info">optional</Badge>: If `true`, the parent account creates suppression entries for all associated sub-accounts. This field is only applicable to parent accounts. Sub-accounts cannot create entries for other sub-accounts.
  - `entries` `object[]` <Badge type="danger">required</Badge>: The total number of suppression entries to create, for the parent and/or its sub-accounts, must not exceed `1000`.
    - `notes` `string` <Badge type="info">optional</Badge>: Must be less than `1024` characters.
    - `recipient` `string` <Badge type="danger">required</Badge>: The email address to suppress. Must be a valid email address format and less than `255` characters.
    - `types` `("transactional" | "non-transactional")[]` <Badge type="info">optional</Badge>: An array of types of suppression to apply to the recipient. If not provided, it defaults to `["non-transactional"]`.
      > [!NOTE]
      > Possible type values are: `transactional`, `non-transactional`.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Delete <Badge type="info">method</Badge>

Deletes suppression entry associated with the account based on the specified recipient and source.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Suppressions } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { success, error } = await suppressions.delete("name@example.com", "api")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.suppressions.delete("name@example.com", "api")
```
:::

### Params

- `recipient` `string` <Badge type="danger">required</Badge>: The email address of the suppression entry to delete.
- `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint" | "all"` <Badge type="info">optional</Badge>: Optional. The source of the suppression entry to be deleted. If source is not provided, it defaults to `api`. If source is set to `all`, all suppression entries related to the specified recipient will be deleted.
  > [!NOTE]
  > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`, `all`

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## List <Badge type="info">method</Badge>

Retrieve suppression entries associated with the specified account. Supports filtering by recipient, source and creation date range. The response is paginated, with a default limit of `1000` entries per page and an offset of `0`.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Suppressions } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { data, error } = await suppressions.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.suppressions.list()
```
:::

### Params

- `options` `SuppressionsListOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `recipient` `string` <Badge type="info">optional</Badge>: The email address of the suppression entry to search for. If provided, the search will return the suppression entry associated with this recipient. If not provided, the search will return all suppression entries for the account.
  - `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint"` <Badge type="info">optional</Badge>: The source of the suppression entries to filter by. If not provided, suppression entries from all sources will be returned.
    > [!NOTE]
    > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`.
  - `createdBefore` `string` <Badge type="info">optional</Badge>: The date and/or time before which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `createdAfter` `string` <Badge type="info">optional</Badge>: The date and/or time after which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of suppression entries to return. Must be between `1` and `1000`. Defaults to `1000`.
  - `offset` `number` <Badge type="info">optional</Badge>: The number of suppression entries to skip before returning results. Defaults to `0`.

### Response

- `data` `SuppressionsListEntry[] | null` <Badge type="warning">nullable</Badge>
  - `createdAt` `string` <Badge>guaranteed</Badge>
  - `notes` `string | null` <Badge type="info">optional</Badge>
  - `recipient` `string` <Badge>guaranteed</Badge>: The email address that is suppressed.
  - `sender` `string | null` <Badge type="info">optional</Badge>
  - `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint" | "all"` <Badge>guaranteed</Badge>
  - `types` `("transactional" | "non-transactional")[]` <Badge>guaranteed</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Type declarations

<<< @/snippets/suppressions.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
  <<< @/snippets/success-response.ts

  **Create type declarations**

  <<< @/snippets/suppressions-types.ts
  <<< @/snippets/suppressions-create-options.ts

  **List type declarations**

  <<< @/snippets/suppressions-source.ts
  <<< @/snippets/suppressions-list-options.ts
  <<< @/snippets/suppressions-list-entry.ts
  <<< @/snippets/suppressions-list-response.ts
</details>
