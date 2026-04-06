---
title: Enroll
titleTemplate: 📢 Webhooks
---

# Enroll<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Enrolls the user to receive event notifications via webhooks.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success, error } = await webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```
:::

## Params

- `endpoint` `string` <Badge type="danger">required</Badge>: The URL to receive event notifications. Must be no longer than `8000` characters.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-enroll.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
