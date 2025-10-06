---
outline: deep
---

# 🚫 Suppressions <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
Manage your MailChannels account suppressions list.
<!-- #endregion description -->

## Create <Badge type="info" text="method" />

Creates suppression entries for the specified account. Parent accounts can create suppression entries for all associated sub-accounts. If `types` is not provided, it defaults to `non-transactional`. The operation is atomic, meaning all entries are successfully added or none are added if an error occurs.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Suppressions } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { success } = await suppressions.create({
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

const { success } = await mailchannels.suppressions.create({
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

- `addToSubAccounts`: If true, the parent account creates suppression entries for all associated sub-accounts. This field is only applicable to parent accounts. Sub-accounts cannot create entries for other sub-accounts.
- `entries`: The total number of suppression entries to create, for the parent and/or its sub-accounts, must not exceed `1000`.
  - `notes`: Optional. Must be less than `1024` characters.
  - `recipient`: The email address to suppress. Must be a valid email address format and less than `255` characters.
  - `types`: An array of types of suppression to apply to the recipient. If not provided, it defaults to `["non-transactional"]`.
    > [!NOTE]
    > Possible type values are: `transactional`, `non-transactional`.

## Delete <Badge type="info" text="method" />

Deletes suppression entry associated with the account based on the specified recipient and source.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Suppressions } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { success } = await suppressions.delete("name@example.com", "api")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.suppressions.delete("name@example.com", "api")
```
:::

### Params

- `recipient`: The email address of the suppression entry to delete.
- `source`: Optional. The source of the suppression entry to be deleted. If source is not provided, it defaults to `api`. If source is set to `all`, all suppression entries related to the specified recipient will be deleted.
  > [!NOTE]
  > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`, `all`

## List <Badge type="info" text="method" />

Retrieve suppression entries associated with the specified account. Supports filtering by recipient, source and creation date range. The response is paginated, with a default limit of `1000` entries per page and an offset of `0`.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Suppressions } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const suppressions = new Suppressions(mailchannels)

const { list } = await suppressions.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { list } = await mailchannels.suppressions.list()
```
:::

### Params

- `options`: Optional filter options.
  - `recipient`: The email address of the suppression entry to search for. If provided, the search will return the suppression entry associated with this recipient. If not provided, the search will return all suppression entries for the account.
  - `source`: The source of the suppression entries to filter by. If not provided, suppression entries from all sources will be returned.
    > [!NOTE]
    > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`.
  - `startTime`: The date and/or time before which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `endTime`: The date and/or time after which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `limit`: The maximum number of suppression entries to return in the response. Default is `1000`. Maximum is `1000`.
  - `offset`: The number of suppression entries to skip before starting to collect the result set. Default is `0`.

## Type declarations

<<< @/snippets/suppressions.ts

<details>
  <summary>All type declarations</summary>

  **Create type declarations**

  <<< @/snippets/suppressions-types.ts
  <<< @/snippets/suppressions-create-options.ts

  **List type declarations**

  <<< @/snippets/suppressions-source.ts
  <<< @/snippets/suppressions-list-options.ts
  <<< @/snippets/suppressions-list-entry.ts
  <<< @/snippets/suppressions-list-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/suppressions.ts)
