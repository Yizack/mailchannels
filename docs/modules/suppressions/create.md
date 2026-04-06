---
title: Create
titleTemplate: 🚫 Suppressions
---

# Create<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/suppressions">🚫 Suppressions</a></Badge></llm-exclude>

Creates suppression entries for the specified account. Parent accounts can create suppression entries for all associated sub-accounts. If `types` is not provided, it defaults to `non-transactional`. The operation is atomic, meaning all entries are successfully added or none are added if an error occurs.

## Usage

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

## Params

- `options` `SuppressionsCreateOptions` <Badge type="danger">required</Badge>: The details of the suppression entries to create.
  - `addToSubAccounts` `boolean` <Badge type="info">optional</Badge>: If `true`, the parent account creates suppression entries for all associated sub-accounts. This field is only applicable to parent accounts. Sub-accounts cannot create entries for other sub-accounts.
  - `entries` `object[]` <Badge type="danger">required</Badge>: The total number of suppression entries to create, for the parent and/or its sub-accounts, must not exceed `1000`.
    - `notes` `string` <Badge type="info">optional</Badge>: Must be less than `1024` characters.
    - `recipient` `string` <Badge type="danger">required</Badge>: The email address to suppress. Must be a valid email address format and less than `255` characters.
    - `types` `("transactional" | "non-transactional")[]` <Badge type="info">optional</Badge>: An array of types of suppression to apply to the recipient. If not provided, it defaults to `["non-transactional"]`.
      > [!NOTE]
      > Possible type values are: `transactional`, `non-transactional`.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/suppressions-method-create.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Create type declarations**

<<< @/snippets/suppressions-types.ts
<<< @/snippets/suppressions-create-options.ts
