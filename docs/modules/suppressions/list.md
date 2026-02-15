# List <Badge type="info">method</Badge> <Badge><a href="/modules/suppressions">🚫 Suppressions</a></Badge>

Retrieve suppression entries associated with the specified account. Supports filtering by recipient, source and creation date range. The response is paginated, with a default limit of `1000` entries per page and an offset of `0`.

## Usage

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

## Params

- `options` `SuppressionsListOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `recipient` `string` <Badge type="info">optional</Badge>: The email address of the suppression entry to search for. If provided, the search will return the suppression entry associated with this recipient. If not provided, the search will return all suppression entries for the account.
  - `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint"` <Badge type="info">optional</Badge>: The source of the suppression entries to filter by. If not provided, suppression entries from all sources will be returned.
    > [!NOTE]
    > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`.
  - `createdBefore` `string` <Badge type="info">optional</Badge>: The date and/or time before which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `createdAfter` `string` <Badge type="info">optional</Badge>: The date and/or time after which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of suppression entries to return. Must be between `1` and `1000`. Defaults to `1000`.
  - `offset` `number` <Badge type="info">optional</Badge>: The number of suppression entries to skip before returning results. Defaults to `0`.

## Response

- `data` `SuppressionsListEntry[] | null` <Badge type="warning">nullable</Badge>
  - `createdAt` `string` <Badge>guaranteed</Badge>
  - `notes` `string` <Badge type="info">optional</Badge>
  - `recipient` `string` <Badge>guaranteed</Badge>: The email address that is suppressed.
  - `sender` `string` <Badge type="info">optional</Badge>
  - `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint" | "all"` <Badge>guaranteed</Badge>
  - `types` `("transactional" | "non-transactional")[]` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/suppressions-method-list.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**List type declarations**

<<< @/snippets/suppressions-source.ts
<<< @/snippets/suppressions-list-options.ts
<<< @/snippets/suppressions-types.ts
<<< @/snippets/suppressions-list-entry.ts
<<< @/snippets/suppressions-list-response.ts
