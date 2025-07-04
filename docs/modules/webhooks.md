---
outline: deep
---

# 📢 Webhooks <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
Receive notifications of your email events via webhooks.
<!-- #endregion description -->

## Enroll <Badge type="info" text="method" />

Enrolls the user to receive event notifications via webhooks.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success } = await webhooks.enroll("https://example.com/api/webhooks/mailchannels");
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannel.webhooks.enroll("https://example.com/api/webhooks/mailchannels");
```
:::

### Params

- `endpoint`: The URL to receive the webhook notifications.

## List <Badge type="info" text="method" />

Lists all the webhook endpoints that are enrolled to receive event notifications.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { webhooks: webhooksList } = await webhooks.list();
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { webhooks } = await mailchannels.webhooks.list();
```
:::

## Delete <Badge type="info" text="method" />

Deletes all registered webhook endpoints for the user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success } = await webhooks.delete();
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.webhooks.delete();
```
:::

## Signing Key <Badge type="info" text="method" />

Retrieves the public key used to verify signatures on incoming webhook payloads.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { key } = await webhooks.getSigningKey('key-id');
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.webhooks.getSigningKey('key-id');
```
:::

### Params

- `keyId`: The ID name of the signing key.
  > [!TIP]
  > The `keyId` can be found in the `signature-input` request header of the webhook notification.

## Type declarations

<<< @/snippets/webhooks.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **List type declarations**

  <<< @/snippets/webhooks-list-response.ts

  **Signing Key type declarations**

  <<< @/snippets/webhooks-signing-key-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/webhooks.ts)
