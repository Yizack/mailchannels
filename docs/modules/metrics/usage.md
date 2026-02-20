# Usage<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/metrics">📊 Metrics</a></Badge></llm-exclude>

Retrieves usage statistics during the current billing period.

## Usage

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

## Response

- `data` `MetricsUsageResponse | null` <Badge type="warning">nullable</Badge>
  - `endDate` `string` <Badge>guaranteed</Badge>: The end date of the current billing period (ISO 8601 format).
  - `startDate` `string` <Badge>guaranteed</Badge>: The start date of the current billing period (ISO 8601 format).
  - `total` `number` <Badge>guaranteed</Badge>: The total usage for the current billing period.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/metrics-method-usage.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Usage type declarations**

<<< @/snippets/metrics-usage-response.ts
