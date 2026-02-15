# Send Async <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge>

Queues an email message for asynchronous processing and returns immediately with a request ID.

The email will be processed in the background, and you'll receive webhook events for all delivery status updates (e.g. `dropped`, `processed`, `delivered`, `hard-bounced`). These webhook events are identical to those sent for the synchronous /send endpoint.

Use this endpoint when you need to send emails without waiting for processing to complete. This can improve your application's response time, especially when sending to multiple recipients.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.sendAsync({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.sendAsync({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```
:::

## Params

<!-- @include: ../_parts/emails-send-params.md#options -->

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `queuedAt` `string` <Badge>guaranteed</Badge>: ISO 8601 timestamp when the request was queued for processing.
  - `requestId` `string` <Badge>guaranteed</Badge>: Unique identifier for tracking this async request. Will be included in all webhook events for this request.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/emails-method-send-async.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Send type declarations**

<<< @/snippets/emails-send-options.ts
<<< @/snippets/emails-send-options-base.ts
<<< @/snippets/emails-send-attachment.ts
<<< @/snippets/emails-send-recipient.ts
<<< @/snippets/emails-send-tracking.ts
<<< @/snippets/emails-send-async-response.ts
