# Performance<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/metrics">📊 Metrics</a></Badge></llm-exclude>

Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.performance()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.performance()
```
:::

## Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message performance metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message performance metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

## Response

- `data` `MetricsPerformance | null` <Badge type="warning">nullable</Badge>
  - `bounced` `number` <Badge>guaranteed</Badge>: Count of messages bounced during the specified time range.
  - `buckets` `object` <Badge>guaranteed</Badge>: A series of metrics aggregations bucketed by time interval (e.g. hour, day).
    - `bounced` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `delivered` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `processed` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
  - `delivered` `number` <Badge>guaranteed</Badge>: Count of messages delivered during the specified time range.
  - `endTime` `string` <Badge>guaranteed</Badge>: The end of the time range for retrieving message performance metrics (exclusive).
  - `processed` `number` <Badge>guaranteed</Badge>: Count of messages processed during the specified time range.
  - `startTime` `string` <Badge>guaranteed</Badge>: The beginning of the time range for retrieving message performance metrics (inclusive).
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/metrics-method-performance.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Shared metrics type declarations**

<<< @/snippets/metrics-options.ts
<<< @/snippets/metrics-bucket.ts

**Performance type declarations**

<<< @/snippets/metrics-performance.ts
<<< @/snippets/metrics-performance-response.ts
