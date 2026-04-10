---
title: Resend Batch
titleTemplate: 📢 Webhooks
---

# Resend Batch<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Synchronously resends the webhook batch with the provided `batchId` for the customer. The result is returned in the response.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.resendBatch(123)
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.resendBatch(123)
```
:::

## Params

- `batchId` `number` <Badge>guaranteed</Badge>: Unique identifier for the webhook batch.

## Response

- `data` `WebhooksResendBatch | null` <Badge type="warning">nullable</Badge>
  - `batchId` `number` <Badge>guaranteed</Badge>: Unique identifier for the webhook batch.
  - `createdAt` `string` <Badge>guaranteed</Badge>: Timestamp of when the webhook batch was created.
  - `customerHandle` `string` <Badge>guaranteed</Badge>: The customer handle associated with the webhook batch.
  - `duration` `number | null` <Badge type="warning">nullable</Badge>: Duration of the webhook batch in milliseconds. `null` indicates that no response was returned from the webhook endpoint.
  - `eventCount` `number` <Badge>guaranteed</Badge>: Number of events in the webhook batch.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: HTTP status code returned by the webhook endpoint.
  - `webhook` `string` <Badge>guaranteed</Badge>: Webhook endpoint to which events in the batch were posted.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-resend-batch.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Resend Batch type declarations**

<<< @/snippets/webhooks-resend-batch.ts
<<< @/snippets/webhooks-resend-batch-response.ts
