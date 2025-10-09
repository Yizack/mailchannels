---
outline: deep
---

# 📊 Metrics <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
This module allows you to retrieve metrics for messages sent from your account.
<!-- #endregion description -->

## Engagement <Badge type="info" text="method" />

Retrieve engagement metrics for messages sent from your account, including counts of open and click events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Metrics } from 'mailchannels-sdk/modules'

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

- `options` `MetricsOptions` <Badge type="info" text="optional" />: Optional filter options.
  - `startTime` `string` <Badge type="info" text="optional" />: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info" text="optional" />: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info" text="optional" />: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info" text="optional" />: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `engagement` `MetricsEngagement | null` <Badge type="warning" text="nullable" />
  - `buckets` `object` <Badge text="guaranteed" />
    - `click` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `clickTrackingDelivered` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `open` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `openTrackingDelivered` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
  - `click` `number` <Badge text="guaranteed" />
  - `clickTrackingDelivered` `number` <Badge text="guaranteed" />
  - `endTime` `string` <Badge text="guaranteed" />
  - `open` `number` <Badge text="guaranteed" />
  - `openTrackingDelivered` `number` <Badge text="guaranteed" />
  - `startTime` `string` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Performance <Badge type="info" text="method" />

Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Metrics } from 'mailchannels-sdk/modules'

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

- `options` `MetricsOptions` <Badge type="info" text="optional" />: Optional filter options.
  - `startTime` `string` <Badge type="info" text="optional" />: The beginning of the time range for retrieving message performance metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info" text="optional" />: The end of the time range for retrieving message performance metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info" text="optional" />: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info" text="optional" />: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `performance` `MetricsPerformance | null` <Badge type="warning" text="nullable" />
  - `bounced` `number` <Badge text="guaranteed" />: Count of messages bounced during the specified time range.
  - `buckets` `object` <Badge text="guaranteed" />
    - `bounced` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `delivered` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `processed` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
  - `delivered` `number` <Badge text="guaranteed" />: Count of messages delivered during the specified time range.
  - `endTime` `string` <Badge text="guaranteed" />: The end of the time range for retrieving message performance metrics (exclusive).
  - `processed` `number` <Badge text="guaranteed" />: Count of messages processed during the specified time range.
  - `startTime` `string` <Badge text="guaranteed" />: The beginning of the time range for retrieving message performance metrics (inclusive).
- `error` `string | null` <Badge type="warning" text="nullable" />

## Recipient Behaviour <Badge type="info" text="method" />

Retrieve recipient behaviour metrics for messages sent from your account, including counts of unsubscribed events. Supports optional filters for time range, and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Metrics } from 'mailchannels-sdk/modules'

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

- `options` `MetricsOptions` <Badge type="info" text="optional" />: Optional filter options.
  - `startTime` `string` <Badge type="info" text="optional" />: The beginning of the time range for retrieving recipient behaviour metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info" text="optional" />: The end of the time range for retrieving recipient behaviour metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info" text="optional" />: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info" text="optional" />: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `behaviour` `MetricsRecipientBehaviour | null` <Badge type="warning" text="nullable" />
  - `buckets` `object` <Badge text="guaranteed" />
    - `unsubscribeDelivered` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `unsubscribed` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
  - `endTime` `string` <Badge text="guaranteed" />: The end of the time range for retrieving recipient behaviour metrics (exclusive).
  - `startTime` `string` <Badge text="guaranteed" />: The beginning of the time range for retrieving recipient behaviour metrics (inclusive).
  - `unsubscribeDelivered` `number` <Badge text="guaranteed" />: Count of recipients of delivered messages that include at least one of the unsubscribe link or unsubscribe headers. Since the unsubscribe feature requires exactly one recipient per message, this count also represents the total number of delivered messages.
  - `unsubscribed` `number` <Badge text="guaranteed" />: Count of unsubscribed events by recipients.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Volume <Badge type="info" text="method" />

Retrieve volume metrics for messages sent from your account, including counts of processed, delivered and dropped events. Supports optional filters for time range and campaign ID.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Metrics } from 'mailchannels-sdk/modules'

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

- `options` `MetricsOptions` <Badge type="info" text="optional" />: Optional filter options.
  - `startTime` `string` <Badge type="info" text="optional" />: The beginning of the time range for retrieving message volume metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime` `string` <Badge type="info" text="optional" />: The end of the time range for retrieving message volume metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId` `string` <Badge type="info" text="optional" />: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval` `"hour" | "day" | "week" | "month"` <Badge type="info" text="optional" />: The interval for aggregating metrics data. Defaults to `day`.

### Response

- `volume` `MetricsVolume | null` <Badge type="warning" text="nullable" />
  - `buckets` `object` <Badge text="guaranteed" />
    - `delivered` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `dropped` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
    - `processed` `MetricsBucket[]` <Badge text="guaranteed" />
      - `count` `number` <Badge text="guaranteed" />: The number of events or occurrences aggregated within this time period.
      - `periodStart` `string` <Badge text="guaranteed" />: The starting date and time of the time period this bucket represents.
  - `delivered` `number` <Badge text="guaranteed" />: Count of messages delivered during the specified time range.
  - `dropped` `number` <Badge text="guaranteed" />: Count of messages dropped during the specified time range.
  - `endTime` `string` <Badge text="guaranteed" />: The end of the time range for retrieving message volume metrics (exclusive).
  - `processed` `number` <Badge text="guaranteed" />: Count of messages processed during the specified time range.
  - `startTime` `string` <Badge text="guaranteed" />: The beginning of the time range for retrieving message volume metrics (inclusive).
- `error` `string | null` <Badge type="warning" text="nullable" />

## Usage <Badge type="info" text="method" />

Retrieves usage statistics during the current billing period.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Metrics } from 'mailchannels-sdk/modules'

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

- `usage` `object | null` <Badge type="warning" text="nullable" />
  - `endDate` `string` <Badge text="guaranteed" />: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge text="guaranteed" />: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge text="guaranteed" />: The total usage for the current billing period.
- `error` `string | null` <Badge type="warning" text="nullable" />

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

  **Volume type declarations**

  <<< @/snippets/metrics-volume.ts
  <<< @/snippets/metrics-volume-response.ts

  **Usage type declarations**

  <<< @/snippets/metrics-usage-response.ts
</details>
