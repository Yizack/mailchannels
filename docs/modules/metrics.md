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

- `options`: (Optional) Engagement options.
  - `startTime`: The beginning of the time range for retrieving message engagement metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
  - `endTime`: The end of the time range for retrieving message engagement metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
  - `campaignId`: The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
  - `interval`: The interval for aggregating metrics data. Possible values are `hour`, `day`, `week`, and `month`. Defaults to `day`.

## Type declarations

<<< @/snippets/metrics.ts

<details>
  <summary>All type declarations</summary>

  **Engagement type declarations**

  <<< @/snippets/metrics-engagement-options.ts
  <<< @/snippets/metrics-engagement.ts
  <<< @/snippets/metrics-engagement-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/metrics.ts)
