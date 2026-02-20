# Recipient Behaviour<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/metrics">📊 Metrics</a></Badge></llm-exclude>

Retrieve recipient behaviour metrics for messages sent from your account, including counts of unsubscribed events. Supports optional filters for time range, and campaign ID.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.recipientBehaviour()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.recipientBehaviour()
```
:::

## Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving recipient behaviour metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving recipient behaviour metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

## Response

- `data` `MetricsRecipientBehaviour | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>: A series of metrics aggregations bucketed by time interval (e.g. hour, day).
    - `unsubscribeDelivered` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `unsubscribed` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
  - `endTime` `string` <Badge>guaranteed</Badge>: The end of the time range for retrieving recipient behaviour metrics (exclusive).
  - `startTime` `string` <Badge>guaranteed</Badge>: The beginning of the time range for retrieving recipient behaviour metrics (inclusive).
  - `unsubscribeDelivered` `number` <Badge>guaranteed</Badge>: Count of recipients of delivered messages that include at least one of the unsubscribe link or unsubscribe headers. Since the unsubscribe feature requires exactly one recipient per message, this count also represents the total number of delivered messages.
  - `unsubscribed` `number` <Badge>guaranteed</Badge>: Count of unsubscribed events by recipients.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/metrics-method-recipient-behaviour.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Shared metrics type declarations**

<<< @/snippets/metrics-options.ts
<<< @/snippets/metrics-bucket.ts

**Recipient Behaviour type declarations**

<<< @/snippets/metrics-recipient-behaviour.ts
<<< @/snippets/metrics-recipient-behaviour-response.ts
