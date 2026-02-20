# Delete<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Deletes all registered webhook endpoints for the user.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success, error } = await webhooks.delete()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.webhooks.delete()
```
:::

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-delete.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
