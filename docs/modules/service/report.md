# Report <Badge type="info">method</Badge> <Badge><a href="/modules/service">⚙️ Service</a></Badge>

Submit a false negative or false positive report.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { success, error } = await service.report({
  type: 'false_positive',
  messageContent: 'Your message content'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.service.report({
  type: 'false_positive',
  messageContent: 'Your message content'
})
```
:::

## Params

- `options` `ServiceReportOptions` <Badge type="danger">required</Badge>: The report options.
  - `type` `"false_negative" | "false_positive"` <Badge type="danger">required</Badge>: The type of report. Can be either `false_positive` or `false_negative`.
  - `messageContent` `string` <Badge type="danger">required</Badge>: The full, unaltered message content in accordance with the RFC 2822 specifications without dot stuffing.
  - `smtpEnvelopeInformation` `object` <Badge type="info">optional</Badge>: The SMTP envelope information.
    - `ehlo` `string` <Badge type="info">optional</Badge>
    - `mailFrom` `string` <Badge type="info">optional</Badge>
    - `rcptTo` `string` <Badge type="info">optional</Badge>
  - `sendingHostInformation` `object` <Badge type="info">optional</Badge>: The sending host information.
    - `name` `string` <Badge type="info">optional</Badge>

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/service-method-report.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Report type declarations**

<<< @/snippets/service-report-options.ts
