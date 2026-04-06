---
title: Delete
titleTemplate: 🚫 Suppressions
---

# Delete<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/suppressions">🚫 Suppressions</a></Badge></llm-exclude>

Deletes suppression entry associated with the account based on the specified recipient and source.

## Usage

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

## Params

- `recipient` `string` <Badge type="danger">required</Badge>: The email address of the suppression entry to delete.
- `source` `"api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint" | "all"` <Badge type="info">optional</Badge>: Optional. The source of the suppression entry to be deleted. If source is not provided, it defaults to `api`. If source is set to `all`, all suppression entries related to the specified recipient will be deleted.
  > [!NOTE]
  > Possible values are: `api`, `unsubscribe_link`, `list_unsubscribe`, `hard_bounce`, `spam_complaint`, `all`

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/suppressions-method-delete.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Delete type declarations**

<<< @/snippets/suppressions-source.ts
