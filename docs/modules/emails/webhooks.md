---
outline: deep
---

# Webhooks

Receive notifications of your email events via webhooks.

## Enroll method

Enrolls the user to receive event notifications via webhooks.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Webhooks } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Webhooks(mailchannels)

await emails.enrollWebhook("https://example.com/api/webhooks/mailchannels");
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

await mailchannel.emails.enrollWebhook("https://example.com/api/webhooks/mailchannels");
```
:::

### Params

- `endpoint`: The URL to receive the webhook notifications.

## List method

Lists all the webhook endpoints that are enrolled to receive event notifications.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Webhooks } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Webhooks(mailchannels)

const { webhooks } = await emails.listWebhooks();
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { webhooks } = await mailchannels.emails.listWebhooks();
```
:::

## Delete method

Deletes all registered webhook endpoints for the user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Webhooks } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Webhooks(mailchannels)

await emails.deleteWebhooks();
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

await mailchannels.emails.deleteWebhooks();
```
:::

## Signing key method

Retrieves the public key used to verify signatures on incoming webhook payloads.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Webhooks } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Webhooks(mailchannels)

const { webhooks } = await emails.getSigningKey('key-id');
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { webhooks } = await mailchannels.emails.getSigningKey('key-id');
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

  <<< @/snippets/webhooks-list-response.ts
  <<< @/snippets/webhooks-signing-key-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails/webhooks.ts)
