# Signing Key<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Retrieves the public key used to verify signatures on incoming webhook payloads.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.getSigningKey('key-id')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.getSigningKey('key-id')
```
:::

## Params

- `keyId` `string` <Badge type="danger">required</Badge>: The ID name of the signing key.
  > [!TIP]
  > The `keyId` can be found in the `signature-input` request header of the webhook notification.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `key` `string` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-get-signing-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Signing Key type declarations**

<<< @/snippets/webhooks-signing-key-response.ts
