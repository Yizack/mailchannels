---
outline: deep
---

# ⚙️ Service <Badge>module</Badge> <Badge>Inbound API</Badge>

<!-- #region description -->
Get information about the service.
<!-- #endregion description -->

## Status <Badge type="info">method</Badge>

Retrieve the condition of the service.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { success } = await service.status()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.service.status()
```
:::

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>
## Subscriptions <Badge type="info">method</Badge>

Get a list of your subscriptions to MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { subscriptions } = await service.subscriptions()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { subscriptions } = await mailchannels.service.subscriptions()
```
:::

### Response

- `subscriptions` `object[]` <Badge>guaranteed</Badge>
  - `active` `boolean` <Badge>guaranteed</Badge>
  - `activeAccountsCount` `number` <Badge>guaranteed</Badge>
  - `handle` `string` <Badge>guaranteed</Badge>
  - `limits` `object[]` <Badge>guaranteed</Badge>
    - `featureHandle` `string` <Badge>guaranteed</Badge>
    - `value` `string` <Badge>guaranteed</Badge>
  - `plan` `object` <Badge>guaranteed</Badge>
    - `handle` `string` <Badge>guaranteed</Badge>
    - `name` `string` <Badge>guaranteed</Badge>
- `error` `string | null` <Badge type="warning">nullable</Badge>
## Report <Badge type="info">method</Badge>

Submit a false negative or false positive report.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { success } = await service.report({
  type: 'false_positive',
  messageContent: 'Your message content'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.service.report({
  type: 'false_positive',
  messageContent: 'Your message content'
})
```
:::

### Params

- `options` `ServiceReportOptions` <Badge type="danger">required</Badge>: The report options.
  - `type` `"false_negative" | "false_positive"` <Badge type="danger">required</Badge>: The type of report. Can be either `false_positive` or `false_negative`.
  - `messageContent` `string` <Badge type="danger">required</Badge>: The full, unaltered message content in accordance with the RFC 2822 specifications without dot stuffing.
  - `smtpEnvelopeInformation` `object` <Badge type="info">optional</Badge>: The SMTP envelope information.
    - `ehlo` `string` <Badge>guaranteed</Badge>
    - `mailFrom` `string` <Badge>guaranteed</Badge>
    - `rcptTo` `string` <Badge>guaranteed</Badge>
  - `sendingHostInformation` `object` <Badge type="info">optional</Badge>: The sending host information.
    - `name` `string` <Badge>guaranteed</Badge>

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Type declarations

<<< @/snippets/service.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **Subscriptions type declarations**

  <<< @/snippets/service-subscriptions-response.ts

  **Report type declarations**

  <<< @/snippets/service-report-options.ts
</details>
