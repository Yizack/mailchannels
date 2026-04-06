---
outline: deep
---

# 📊 Metrics <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
This module allows you to retrieve metrics for messages sent from your account.
<!-- #endregion description -->

## Engagement <Badge type="info">method</Badge>

Retrieve engagement metrics for messages sent from your account, including counts of open and click events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { engagement } = await metrics.engagement()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { engagement } = await mailchannels.metrics.engagement()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `engagement` `MetricsEngagement | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>
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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Performance <Badge type="info">method</Badge>

Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { performance } = await metrics.performance()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { performance } = await mailchannels.metrics.performance()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message performance metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message performance metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `performance` `MetricsPerformance | null` <Badge type="warning">nullable</Badge>
  - `bounced` `number` <Badge>guaranteed</Badge>: Count of messages bounced during the specified time range.
  - `buckets` `object` <Badge>guaranteed</Badge>
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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Recipient Behaviour <Badge type="info">method</Badge>

Retrieve recipient behaviour metrics for messages sent from your account, including counts of unsubscribed events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { behaviour } = await metrics.recipientBehaviour()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { behaviour } = await mailchannels.metrics.recipientBehaviour()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving recipient behaviour metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving recipient behaviour metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `behaviour` `MetricsRecipientBehaviour | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>
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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Sender Metrics <Badge type="info">method</Badge>

Retrieve sender metrics for top campaigns or sub-accounts.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { senders } = await metrics.senderMetrics('campaigns', {
  limit: 25,
  sortOrder: 'desc'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { senders } = await mailchannels.metrics.senderMetrics('campaigns', {
  limit: 25,
  sortOrder: 'desc'
})
```
:::

### Params

- `senderType` `"campaigns" | "sub-accounts"` <Badge type="danger">required</Badge>: Sender category to query.
- `options` `MetricsSenderOptions` <Badge type="info">optional</Badge>: Optional filters and pagination controls.
  - `startTime` `string` <Badge type="info">optional</Badge>: Inclusive lower bound for the metrics time range. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
  - `endTime` `string` <Badge type="info">optional</Badge>: Exclusive upper bound for the metrics time range. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
  - `limit` `number` <Badge type="info">optional</Badge>: Maximum number of senders to return. Range: `1` to `1000`.
  - `offset` `number` <Badge type="info">optional</Badge>: Number of senders to skip. Minimum: `0`.
  - `sortOrder` `"asc" | "desc"` <Badge type="info">optional</Badge>: Sort order by total message volume. Defaults to `desc`.

### Response

- `senders` `MetricsSender[]` <Badge>guaranteed</Badge>
  - `bounced` `number` <Badge>guaranteed</Badge>
  - `delivered` `number` <Badge>guaranteed</Badge>
  - `dropped` `number` <Badge>guaranteed</Badge>
  - `name` `string` <Badge>guaranteed</Badge>
  - `processed` `number` <Badge>guaranteed</Badge>
- `total` `number` <Badge>guaranteed</Badge>
- `limit` `number` <Badge>guaranteed</Badge>
- `offset` `number` <Badge>guaranteed</Badge>
- `startTime` `string` <Badge type="info">optional</Badge>
- `endTime` `string` <Badge type="info">optional</Badge>
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Volume <Badge type="info">method</Badge>

Retrieve volume metrics for messages sent from your account, including counts of processed, delivered and dropped events. Supports optional filters for time range and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { volume } = await metrics.volume()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { volume } = await mailchannels.metrics.volume()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message volume metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message volume metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `volume` `MetricsVolume | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>
    - `delivered` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `dropped` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
    - `processed` `MetricsBucket[]` <Badge>guaranteed</Badge>
      - `count` `number` <Badge>guaranteed</Badge>: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge>guaranteed</Badge>: The starting date and time of the time period this bucket represents.
  - `delivered` `number` <Badge>guaranteed</Badge>: Count of messages delivered during the specified time range.
  - `dropped` `number` <Badge>guaranteed</Badge>: Count of messages dropped during the specified time range.
  - `endTime` `string` <Badge>guaranteed</Badge>: The end of the time range for retrieving message volume metrics (exclusive).
  - `processed` `number` <Badge>guaranteed</Badge>: Count of messages processed during the specified time range.
  - `startTime` `string` <Badge>guaranteed</Badge>: The beginning of the time range for retrieving message volume metrics (inclusive).
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Usage <Badge type="info">method</Badge>

Retrieves usage statistics during the current billing period.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { usage } = await metrics.usage()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { usage } = await mailchannels.metrics.usage()
```
:::

### Response

- `usage` `object | null` <Badge type="warning">nullable</Badge>
  - `endDate` `string` <Badge>guaranteed</Badge>: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge>guaranteed</Badge>: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge>guaranteed</Badge>: The total usage for the current billing period.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Type declarations

<<< @/snippets/metrics.ts

<details>
  <summary>All type declarations</summary>

  <<< @/snippets/metrics-options.ts
  <<< @/snippets/metrics-bucket.ts

  **Engagement type declarations**

  <<< @/snippets/metrics-engagement.ts
  <<< @/snippets/metrics-engagement-response.ts

  **Performance type declarations**

  <<< @/snippets/metrics-performance.ts
  <<< @/snippets/metrics-performance-response.ts

  **Recipient Behaviour type declarations**

  <<< @/snippets/metrics-recipient-behaviour.ts
  <<< @/snippets/metrics-recipient-behaviour-response.ts

  **Sender Metrics type declarations**

  <<< @/snippets/metrics-sender-type.ts
  <<< @/snippets/metrics-sender-options.ts
  <<< @/snippets/metrics-sender.ts
  <<< @/snippets/metrics-sender-response.ts

  **Volume type declarations**

  <<< @/snippets/metrics-volume.ts
  <<< @/snippets/metrics-volume-response.ts

  **Usage type declarations**

  <<< @/snippets/metrics-usage-response.ts
</details>
