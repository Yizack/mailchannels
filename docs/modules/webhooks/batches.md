---
title: Batches
titleTemplate: 📢 Webhooks
---

# Batches<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge></llm-exclude>

Retrieves paged webhook batches associated with the customer. The time range specified by `createdAfter` and `createdBefore` must not exceed 31 days. If neither is specified, the default time range is the last 3 days.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.batches()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.batches()
```
:::

## Params

- `createdAfter` `string` <Badge type="info">optional</Badge>: Inclusive lower bound (UTC) for filtering webhook batches by creation time. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
- `createdBefore` `string` <Badge type="info">optional</Badge>: Exclusive upper bound (UTC) for filtering webhook batches by creation time. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
- `statuses` `WebhooksBatchStatus[]` <Badge type="info">optional</Badge>: Filters webhook batches by webhook response status category. If not provided, batches with all categories are returned. Possible values: `1xx`, `2xx`, `3xx`, `4xx`, `5xx`, `no_response`.
- `webhook` `string` <Badge type="info">optional</Badge>: Filters webhook batches by the webhook endpoint to which events in the batch were posted.
- `limit` `number` <Badge type="info">optional</Badge>: The maximum number of webhook batches to return. Must be between `1` and `500`. Default is `500`.
- `offset` `number` <Badge type="info">optional</Badge>: The number of webhook batches to skip before starting to collect the result set. Default is `0`.

## Response

- `data` `WebhooksBatch[] | null` <Badge type="warning">nullable</Badge>
  - `batchId` `number` <Badge>guaranteed</Badge>: Unique identifier for the webhook batch.
  - `createdAt` `string` <Badge>guaranteed</Badge>: Timestamp of when the webhook batch was created.
  - `customerHandle` `string` <Badge>guaranteed</Badge>: The customer handle associated with the webhook batch.
  - `duration` `object` <Badge type="info">optional</Badge>: Duration of the webhook batch, measured from the time the request was sent to the webhook endpoint until the response was received.
    - `unit` `string` <Badge>guaranteed</Badge>: The unit of time for the duration. Possible values: `milliseconds`.
    - `value` `number` <Badge>guaranteed</Badge>: The value of the duration in the specified unit.
  - `eventCount` `number` <Badge>guaranteed</Badge>: Number of events in the webhook batch.
  - `status` `WebhooksBatchResponseStatus` <Badge>guaranteed</Badge>: Status of the webhook batch. Possible values: `1xx_response`, `2xx_response`, `3xx_response`, `4xx_response`, `5xx_response`, `no_response`.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: HTTP status code returned by the webhook endpoint.
  - `webhook` `string` <Badge>guaranteed</Badge>: Webhook endpoint to which events in the batch were posted.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-batches.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Batches type declarations**

<<< @/snippets/webhooks-batch-status.ts
<<< @/snippets/webhooks-batches-options.ts
<<< @/snippets/webhooks-batch-response-status.ts
<<< @/snippets/webhooks-batch.ts
<<< @/snippets/webhooks-batches-response.ts
