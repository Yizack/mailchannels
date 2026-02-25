---
title: Senders
titleTemplate: 📊 Metrics
---

# Senders<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/metrics">📊 Metrics</a></Badge></llm-exclude>

Retrieves a list of senders, either sub-accounts or campaigns, with their associated message metrics. Sorted by total # of sent messages (processed + dropped). Supports optional filter for time range, and optional settings for limit, offset, and sort order. Note: senders without any messages in the given time range will not be included in the results. The default time range is from one month ago to now, and the default sort order is descending.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.senders("campaigns")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.senders("campaigns")
```
:::

## Params

- `type` `MetricsSendersType` <Badge type="danger">required</Badge>: The type of senders to retrieve metrics for. Can be either `sub-accounts` or `campaigns`.
- `options` `MetricsSendersOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving top senders metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving top senders metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of senders to return. Possible values are 1 to 1000. Defaults to 10 if not provided.
  - `offset` `number` <Badge type="info">optional</Badge>: The number of senders to skip before returning results. Defaults to 0 if not provided.
  - `sortOrder` `"asc" | "desc"` <Badge type="info">optional</Badge>: The order in which to sort the results, based on total messages (processed + dropped). Defaults to `desc` if not provided.

## Response

- `data` `MetricsSenders | null` <Badge type="warning">nullable</Badge>
  - `endTime` `string` <Badge>guaranteed</Badge>
  - `limit` `number` <Badge>guaranteed</Badge>
  - `offset` `number` <Badge>guaranteed</Badge>
  - `senders` `object[]` <Badge>guaranteed</Badge>
    - `bounced` `number` <Badge>guaranteed</Badge>
    - `delivered` `number` <Badge>guaranteed</Badge>
    - `dropped` `number` <Badge>guaranteed</Badge>
    - `name` `string` <Badge>guaranteed</Badge>
    - `processed` `number` <Badge>guaranteed</Badge>
  - `startTime` `string` <Badge>guaranteed</Badge>
  - `total` `number` <Badge>guaranteed</Badge>: The total number of senders in this category that sent messages in the given time range.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/metrics-method-senders.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Shared metrics type declarations**

<<< @/snippets/metrics-options.ts

**Senders type declarations**

<<< @/snippets/metrics-senders-type.ts
<<< @/snippets/metrics-senders-options.ts
<<< @/snippets/metrics-senders.ts
<<< @/snippets/metrics-senders-response.ts
