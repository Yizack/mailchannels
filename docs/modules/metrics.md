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

- `options`: Optional filter options.
  - `startTime`: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime`: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId`: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval`: The interval for aggregating metrics data. Possible values are `hour`, `day`, `week`, and `month`. Defaults to `day`.

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

- `options`: Optional filter options.
  - `startTime`: The beginning of the time range for retrieving message performance metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime`: The end of the time range for retrieving message performance metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId`: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval`: The interval for aggregating metrics data. Possible values are `hour`, `day`, `week`, and `month`. Defaults to `day`.

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

- `options`: Optional filter options.
  - `startTime`: The beginning of the time range for retrieving recipient behaviour metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime`: The end of the time range for retrieving recipient behaviour metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId`: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval`: The interval for aggregating metrics data. Possible values are `hour`, `day`, `week`, and `month`. Defaults to `day`.

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

- `options`: Optional filter options.
  - `startTime`: The beginning of the time range for retrieving message volume metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime`: The end of the time range for retrieving message volume metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId`: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval`: The interval for aggregating metrics data. Possible values are `hour`, `day`, `week`, and `month`. Defaults to `day`.

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

  ***Recipient Behaviour type declarations**

  <<< @/snippets/metrics-recipient-behaviour.ts
  <<< @/snippets/metrics-recipient-behaviour-response.ts

  **Volume type declarations**

  <<< @/snippets/metrics-volume.ts
  <<< @/snippets/metrics-volume-response.ts

  **Usage type declarations**

  <<< @/snippets/metrics-usage-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/metrics.ts)
