---
outline: deep
---

# ⚙️ Service <Badge type="tip" text="module" /> <Badge type="tip" text="Inbound API" />

<!-- #region description -->
Get information about the service.
<!-- #endregion description -->

## Status <Badge type="info" text="method" />

Retrieve the condition of the service.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Service } from 'mailchannels-sdk/modules'

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

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />
## Subscriptions <Badge type="info" text="method" />

Get a list of your subscriptions to MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Service } from 'mailchannels-sdk/modules'

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
  
- `subscriptions` `object[]` <Badge text="guaranteed" />
  - `active` `boolean` <Badge text="guaranteed" />
  - `activeAccountsCount` `number` <Badge text="guaranteed" />
  - `handle` `string` <Badge text="guaranteed" />
  - `limits` `object[]` <Badge text="guaranteed" />
    - `featureHandle` `string` <Badge text="guaranteed" />
    - `value` `string` <Badge text="guaranteed" />
  - `plan` `object` <Badge text="guaranteed" />
    - `handle` `string` <Badge text="guaranteed" />
    - `name` `string` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />
## Report <Badge type="info" text="method" />

Submit a false negative or false positive report.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Service } from 'mailchannels-sdk/modules'

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

- `options` `ServiceReportOptions` <Badge type="danger" text="required" />: The report options.
  - `type` `"false_negative" | "false_positive"` <Badge type="danger" text="required" />: The type of report. Can be either `false_positive` or `false_negative`.
  - `messageContent` `string` <Badge type="danger" text="required" />: The full, unaltered message content in accordance with the RFC 2822 specifications without dot stuffing.
  - `smtpEnvelopeInformation` `object` <Badge type="info" text="optional" />: The SMTP envelope information.
    - `ehlo` `string` <Badge text="guaranteed" />
    - `mailFrom` `string` <Badge text="guaranteed" />
    - `rcptTo` `string` <Badge text="guaranteed" />
  - `sendingHostInformation` `object` <Badge type="info" text="optional" />: The sending host information.
    - `name` `string` <Badge text="guaranteed" />

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

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
