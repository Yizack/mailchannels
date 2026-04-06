---
title: Verify
titleTemplate: 📢 Webhooks
---

# Verify<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Verifies the authenticity of incoming webhook requests by validating their signatures using the provided options.

All webhooks are signed by default. There are three HTTP headers to consider during the signature verification process:

- `Content-Digest`: hash of the message body
- `Signature-Input`: describes what parts of the message are signed, along with other data about the signing method
- `Signature`: the cryptographic signature

## Usage

::: code-group
```ts [static.ts]
import { Webhooks } from 'mailchannels-sdk'

const isValid = await Webhooks.verify({
  payload: rawBody,
  headers: {
    'content-digest': req.headers['content-digest'],
    'signature': req.headers['signature'],
    'signature-input': req.headers['signature-input']
  },
  publicKey: 'MCowBQYD...'
})
```

```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const isValid = await webhooks.verify({
  payload: rawBody,
  headers: {
    'content-digest': req.headers['content-digest'],
    'signature': req.headers['signature'],
    'signature-input': req.headers['signature-input']
  },
  publicKey: 'MCowBQYD...'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const isValid = await mailchannels.webhooks.verify({
  payload: rawBody,
  headers: {
    'content-digest': req.headers['content-digest'],
    'signature': req.headers['signature'],
    'signature-input': req.headers['signature-input']
  },
  publicKey: 'MCowBQYD...'
})
```
:::

> [!NOTE]
> The `Webhooks` class provides both a static and an instance `verify` method. The static method is useful for quickly verifying webhook requests without needing to create an instance of the `MailChannels` class using your API Key. However, you can also use the instance method if you prefer, as both will yield the same result.

## Params

- `options` `WebhooksVerifyOptions` <Badge type="danger">required</Badge>: The options for verifying the webhook.
  - `payload` `string` <Badge type="danger">required</Badge>: The raw body of the incoming webhook request as a string. This should be the exact payload received from the webhook, without any modifications or parsing, to ensure accurate signature verification.
  - `headers` `Record<string, string>` <Badge type="danger">required</Badge>: The headers of the incoming webhook request as a record of key-value pairs. These headers should include `content-digest`, `signature`, and `signature-input` required for validating the authenticity of the webhook request.
  - `publicKey` `string` <Badge type="info">optional</Badge>: The public key used to verify the webhook signature. If not provided, the SDK will attempt to retrieve the appropriate public key based on the `keyid` specified in the `signature-input` header.
    > [!NOTE]
    > The key ID included in the `signature-input` header of each incoming webhook is used to identify the key used to sign the request.
    >
    <!---->
    > [!TIP]
    > The intended pattern is to [fetch the public key](/modules/webhooks/get-signing-key) once, cache it, and then reuse it for all subsequent requests. You'd only need to call the `getSigningKey` method again if you see a key ID you haven't encountered before (e.g. if MailChannels rotate the key), which is a rare event.
    >
    > The public key can be provided in PEM format or as a raw base64 string. The SDK will handle both formats correctly.

## Response

This method returns a `boolean` indicating whether the webhook request is valid or not. A return value of `true` means the webhook request is authentic and can be trusted, while `false` indicates that the signature verification failed, and the request may not be from MailChannels or could have been tampered with.

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-verify.ts

**Verify type declarations**

<<< @/snippets/webhooks-verify-options.ts
