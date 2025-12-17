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

const { data, error } = await metrics.engagement()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.engagement()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

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
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Performance <Badge type="info">method</Badge>

Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.

### Usage

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

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message performance metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message performance metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

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
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Recipient Behaviour <Badge type="info">method</Badge>

Retrieve recipient behaviour metrics for messages sent from your account, including counts of unsubscribed events. Supports optional filters for time range, and campaign ID.

### Usage

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

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving recipient behaviour metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving recipient behaviour metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

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
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Volume <Badge type="info">method</Badge>

Retrieve volume metrics for messages sent from your account, including counts of processed, delivered and dropped events. Supports optional filters for time range and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.volume()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.volume()
```
:::

### Params

- `options` `MetricsOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving message volume metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving message volume metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info">optional</Badge>: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `data` `MetricsVolume | null` <Badge type="warning">nullable</Badge>
  - `buckets` `object` <Badge>guaranteed</Badge>: A series of metrics aggregations bucketed by time interval (e.g. hour, day).
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
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Usage <Badge type="info">method</Badge>

Retrieves usage statistics during the current billing period.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Metrics } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const metrics = new Metrics(mailchannels)

const { data, error } = await metrics.usage()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.metrics.usage()
```
:::

### Response

- `usage` `object | null` <Badge type="warning">nullable</Badge>
  - `endDate` `string` <Badge>guaranteed</Badge>: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge>guaranteed</Badge>: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge>guaranteed</Badge>: The total usage for the current billing period.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Senders <Badge type="info">method</Badge>

Retrieves a list of senders, either sub-accounts or campaigns, with their associated message metrics. Sorted by total # of sent messages (processed + dropped). Supports optional filter for time range, and optional settings for limit, offset, and sort order. Note: senders without any messages in the given time range will not be included in the results. The default time range is from one month ago to now, and the default sort order is descending.

### Usage

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

### Params

- `type` `MetricsSendersType` <Badge type="danger">required</Badge>: The type of senders to retrieve metrics for. Can be either `sub-accounts` or `campaigns`.
- `options` `MetricsSendersOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `startTime` `string` <Badge type="info">optional</Badge>: The beginning of the time range for retrieving top senders metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info">optional</Badge>: The end of the time range for retrieving top senders metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of senders to return. Possible values are 1 to 1000. Defaults to 10 if not provided.
  - `offset` `number` <Badge type="info">optional</Badge>: The number of senders to skip before returning results. Defaults to 0 if not provided.
  - `sortOrder` `"asc" | "desc"` <Badge type="info">optional</Badge>: The order in which to sort the results, based on total messages (processed + dropped). Defaults to `desc` if not provided.

### Response

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
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Type declarations

<<< @/snippets/metrics.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts

  **Shared metrics type declarations**

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

  **Volume type declarations**

  <<< @/snippets/metrics-volume.ts
  <<< @/snippets/metrics-volume-response.ts

  **Usage type declarations**

  <<< @/snippets/metrics-usage-response.ts

  **Senders type declarations**

  <<< @/snippets/metrics-senders-type.ts
  <<< @/snippets/metrics-senders-options.ts
  <<< @/snippets/metrics-senders.ts
  <<< @/snippets/metrics-senders-response.ts
</details>
