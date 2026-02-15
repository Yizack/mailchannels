# Engagement <Badge type="info">method</Badge> <Badge><a href="/modules/metrics">📊 Metrics</a></Badge>

Retrieve engagement metrics for messages sent from your account, including counts of open and click events. Supports optional filters for time range, and campaign ID.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.engagement()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.engagement()
```
:::

## Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

## Response

- `data` `MetricsEngagement | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>: A series of metrics aggregations bucketed by time interval (e.g. hour, day).
    - `click` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `clickTrackingDelivered` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `open` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `openTrackingDelivered` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
  - `click` `number` <Badge>guaranteed</Badge>
  - `clickTrackingDelivered` `number` <Badge>guaranteed</Badge>
  - `endTime` `string` <Badge>guaranteed</Badge>
  - `open` `number` <Badge>guaranteed</Badge>
  - `openTrackingDelivered` `number` <Badge>guaranteed</Badge>
  - `startTime` `string` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/metrics-method-engagement.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Shared metrics type declarations**

<<< @/snippets/metrics-options.ts
<<< @/snippets/metrics-bucket.ts

**Engagement type declarations**

<<< @/snippets/metrics-engagement.ts
<<< @/snippets/metrics-engagement-response.ts
