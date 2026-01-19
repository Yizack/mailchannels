---
outline: deep
---

# 📧 Emails <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
This module allows you to send emails and check domain settings for secure email delivery.
<!-- #endregion description -->

## Send <Badge type="info">method</Badge>

Sends an email message to one or more recipients.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { success, data, error } = await emails.send({
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

const { success, data, error } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```
:::

### Params

- `options` `EmailsSendOptions` <Badge type="danger">required</Badge>: Send options `EmailsSendOptions`.
  - `attachments` `EmailsSendAttachment[]` <Badge type="info">optional</Badge>: An array of attachments to be sent with the email.
    - `content` `string` <Badge type="danger">required</Badge>: The attachment data, encoded in Base64.
    - `filename` `string` <Badge type="danger">required</Badge>: The name of the attachment file.
    - `type` `string` <Badge type="danger">required</Badge>: The MIME type of the attachment.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The campaign identifier. If specified, this ID will be included in all relevant webhooks. It can be up to 48 UTF-8 characters long and must not contain spaces.
  - `bcc` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="info">optional</Badge>: The BCC recipients of the email.
  - `cc` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="info">optional</Badge>: The CC recipients of the email.
  - `dkim` `object` <Badge type="info">optional</Badge>: The DKIM settings for the email.
    - `domain` `string` <Badge type="danger">required</Badge>: The domain to sign the email with.
    - `privateKey` `string` <Badge type="info">optional</Badge>: The private key to sign the email with. Can be undefined if the domain has an active DKIM key.
    - `selector` `string` <Badge type="danger">required</Badge>: The DKIM selector to use.
  - `from` `EmailsSendRecipient | string` <Badge type="danger">required</Badge>: The sender of the email.
  - `headers` `Record<string, string>` <Badge type="info">optional</Badge>: An object containing key-value pairs, where both keys (header names) and values must be strings. These pairs represent custom headers to be substituted.
    > [!IMPORTANT]
    > Please note the following restrictions and behavior:
    > - **Reserved headers**: The following headers cannot be modified: `Authentication-Results`, `BCC`, `CC`, `Content-Transfer-Encoding`, `Content-Type`, `DKIM-Signature`, `From`, `Message-ID`, `Received`, `Reply-To`, `Subject`, `To`.
    > - **Header precedence**: If a header is defined in both the personalizations object and the root headers, the value from personalizations will be used.
    > - **Case sensitivity**: Headers are treated as case-insensitive. If multiple headers differ only by case, only one will be used, with no guarantee of which one.
  - `to` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="danger">required</Badge>: The recipients of the email.
  - `tracking` `EmailsSendTracking` <Badge type="info">optional</Badge>: Adjust open and click tracking for the message.
    > [!INFO]
    > Tracking for your messages requires a [subscription](https://www.mailchannels.com/pricing/#for_devs) that supports open and click tracking.
    >
    > Only links (`<a>` tags) meeting all of the following conditions are processed for click tracking:
    > - The URL is non-empty.
    > - The URL starts with `http` or `https`.
    > - The link does not have a `clicktracking` attribute set to `off`.
  - `replyTo` `EmailsSendRecipient | string` <Badge type="info">optional</Badge>: The reply-to address of the email.
  - `subject` `string` <Badge type="danger">required</Badge>: The subject of the email.
  - `html` `string` <Badge type="info">optional</Badge>: The HTML content of the email. Required if `text` is not set.
  - `text` `string` <Badge type="info">optional</Badge>: The plain text content of the email. Required if `html` is not set.
    > [!IMPORTANT]
    > Either `html` or `text` must be provided.
    <!---->
    > [!TIP]
    > Including a plain text version of your email ensures that all recipients can read your message, including those with email clients that lack HTML support.
    >
    > You can use the [`html-to-text`](https://www.npmjs.com/package/html-to-text) package to convert your HTML content to plain text.
  - `mustaches` `Record<string, unknown>` <Badge type="info">optional</Badge>: Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering.
  - `transactional` `boolean` <Badge type="info">optional</Badge>: Mark these messages as transactional or non-transactional. In order for a message to be marked as non-transactional, it must have exactly one recipient per personalization, and it must be DKIM signed. 400 Bad Request will be returned if there are more than one recipient in any personalization for non-transactional messages. If a message is marked as non-transactional, it changes the sending process as follows:
    List-Unsubscribe headers will be added.
- `dryRun` `boolean` <Badge type="info">optional</Badge>: When set to `true`, the email will not be sent. Instead, the fully rendered message will be returned in the `data.rendered` property of the response.
  > [!TIP]
  > Use `dryRun` to test your email message before sending it.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Indicates if the email was successfully sent.
- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `rendered` `string[]` <Badge type="info">optional</Badge>: Fully rendered message if `dryRun` was set to `true`. A string representation of a rendered message.
  - `requestId` `string` <Badge type="info">optional</Badge>: The Request ID is a unique identifier generated by the service to track the HTTP request. It will also be included in all webhooks for reference.
  - `results` `object` <Badge type="info">optional</Badge>:
    - `index` `number` <Badge type="info">optional</Badge>: The index of the personalization in the request. Starts at 0.
    - `messageId` `string` <Badge>guaranteed</Badge>: The Message ID is a unique identifier generated by the service. Each personalization has a distinct Message ID, which is also used in the `Message-Id` header and included in webhooks.
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of the status.
    - `status` `"sent" | "failed"` <Badge>guaranteed</Badge>: The status of the message. Note that 'sent' is a temporary status; the final status will be provided through webhooks, if configured.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the email failed to send.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Send Async <Badge type="info">method</Badge>

Queues an email message for asynchronous processing and returns immediately with a request ID.

The email will be processed in the background, and you'll receive webhook events for all delivery status updates (e.g. `dropped`, `processed`, `delivered`, `hard-bounced`). These webhook events are identical to those sent for the synchronous /send endpoint.

Use this endpoint when you need to send emails without waiting for processing to complete. This can improve your application's response time, especially when sending to multiple recipients.

### Usage

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

### Params

- `options` `EmailsSendOptions` <Badge type="danger">required</Badge>: Send options `EmailsSendOptions`.
  - `attachments` `EmailsSendAttachment[]` <Badge type="info">optional</Badge>: An array of attachments to be sent with the email.
    - `content` `string` <Badge type="danger">required</Badge>: The attachment data, encoded in Base64.
    - `filename` `string` <Badge type="danger">required</Badge>: The name of the attachment file.
    - `type` `string` <Badge type="danger">required</Badge>: The MIME type of the attachment.
  - `campaignId` `string` <Badge type="info">optional</Badge>: The campaign identifier. If specified, this ID will be included in all relevant webhooks. It can be up to 48 UTF-8 characters long and must not contain spaces.
  - `bcc` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="info">optional</Badge>: The BCC recipients of the email.
  - `cc` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="info">optional</Badge>: The CC recipients of the email.
  - `dkim` `object` <Badge type="info">optional</Badge>: The DKIM settings for the email.
    - `domain` `string` <Badge type="danger">required</Badge>: The domain to sign the email with.
    - `privateKey` `string` <Badge type="info">optional</Badge>: The private key to sign the email with. Can be undefined if the domain has an active DKIM key.
    - `selector` `string` <Badge type="danger">required</Badge>: The DKIM selector to use.
  - `from` `EmailsSendRecipient | string` <Badge type="danger">required</Badge>: The sender of the email.
  - `headers` `Record<string, string>` <Badge type="info">optional</Badge>: An object containing key-value pairs, where both keys (header names) and values must be strings. These pairs represent custom headers to be substituted.
    > [!IMPORTANT]
    > Please note the following restrictions and behavior:
    > - **Reserved headers**: The following headers cannot be modified: `Authentication-Results`, `BCC`, `CC`, `Content-Transfer-Encoding`, `Content-Type`, `DKIM-Signature`, `From`, `Message-ID`, `Received`, `Reply-To`, `Subject`, `To`.
    > - **Header precedence**: If a header is defined in both the personalizations object and the root headers, the value from personalizations will be used.
    > - **Case sensitivity**: Headers are treated as case-insensitive. If multiple headers differ only by case, only one will be used, with no guarantee of which one.
  - `to` `EmailsSendRecipient[] | EmailsSendRecipient | string[] | string` <Badge type="danger">required</Badge>: The recipients of the email.
  - `tracking` `EmailsSendTracking` <Badge type="info">optional</Badge>: Adjust open and click tracking for the message.
    > [!INFO]
    > Tracking for your messages requires a [subscription](https://www.mailchannels.com/pricing/#for_devs) that supports open and click tracking.
    >
    > Only links (`<a>` tags) meeting all of the following conditions are processed for click tracking:
    > - The URL is non-empty.
    > - The URL starts with `http` or `https`.
    > - The link does not have a `clicktracking` attribute set to `off`.
  - `replyTo` `EmailsSendRecipient | string` <Badge type="info">optional</Badge>: The reply-to address of the email.
  - `subject` `string` <Badge type="danger">required</Badge>: The subject of the email.
  - `html` `string` <Badge type="info">optional</Badge>: The HTML content of the email. Required if `text` is not set.
  - `text` `string` <Badge type="info">optional</Badge>: The plain text content of the email. Required if `html` is not set.
    > [!IMPORTANT]
    > Either `html` or `text` must be provided.
    <!---->
    > [!TIP]
    > Including a plain text version of your email ensures that all recipients can read your message, including those with email clients that lack HTML support.
    >
    > You can use the [`html-to-text`](https://www.npmjs.com/package/html-to-text) package to convert your HTML content to plain text.
  - `mustaches` `Record<string, unknown>` <Badge type="info">optional</Badge>: Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering.
  - `transactional` `boolean` <Badge type="info">optional</Badge>: Mark these messages as transactional or non-transactional. In order for a message to be marked as non-transactional, it must have exactly one recipient per personalization, and it must be DKIM signed. 400 Bad Request will be returned if there are more than one recipient in any personalization for non-transactional messages. If a message is marked as non-transactional, it changes the sending process as follows:
    List-Unsubscribe headers will be added.

### Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `queuedAt` `string` <Badge>guaranteed</Badge>: ISO 8601 timestamp when the request was queued for processing.
  - `requestId` `string` <Badge>guaranteed</Badge>: Unique identifier for tracking this async request. Will be included in all webhook events for this request.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the email failed to send.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Check Domain <Badge type="info">method</Badge>

*DKIM, SPF & Domain Lockdown Check*

Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This method checks whether the domain is properly configured for secure email delivery.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
})
```
:::

### Params

- `options` `EmailsCheckDomainOptions` <Badge type="danger">required</Badge>: Check domain options.
  - `dkim` `EmailsCheckDomainDkim[] | EmailsCheckDomainDkim` <Badge type="info">optional</Badge>: The DKIM settings for the domain.
    - `domain` `string` <Badge type="info">optional</Badge>: The DKIM domain to sign the email with.
    - `privateKey` `string` <Badge type="info">optional</Badge>: The DKIM private key to sign the email with. Encoded in Base64.
    - `selector` `string` <Badge type="info">optional</Badge>: The DKIM selector to use.
    > [!TIP]
    > The absence or presence of these fields affects how DKIM settings are validated:
    > 1. If `domain`, `selector`, and `privateKey` are all present, verify using the provided domain, selector, and key.
    > 2. If `domain` and `selector` are present, use the stored private key for the given domain and selector.
    > 3. If only `domain` is present, use all stored keys for the given domain.
    > 4. If none are present, use all stored keys for the `domain` provided in the domain field of the request.
    > 5. If `privateKey` is present, `selector` must be present.
    > 6. If `selector` is present and `domain` is not, the domain will be taken from the domain field of the request.
  - `domain` `string` <Badge type="danger">required</Badge>: Domain used for sending emails. If `dkim` settings are not provided, or `dkim` settings are provided with no `domain`, the stored dkim settings for this domain will be used.
  - `senderId` `string` <Badge type="info">optional</Badge>: Used exclusively for [Domain Lockdown](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown) verification. If you're not using senderid to associate your domain with your account, you can disregard this field.
    > [!INFO]
    > Your `senderId` is the `X-MailChannels-Sender-Id` header value in emails sent via MailChannels.

### Response

- `data` `object | null` <Badge type="warning">nullable</Badge>: The results of the domain checks.
  - `dkim` `object[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>
    - `keyStatus` `"active" | "revoked" | "retired" | "provided" | "rotated"` <Badge>guaranteed</Badge>: The human readable status of the DKIM key used for verification.
    - `selector` `string` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of DKIM check.
    - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `domainLockdown` `object` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of Domain Lockdown check.
    - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `senderDomain` `object` <Badge>guaranteed</Badge>: These results are here to help avoid [SDNF](https://support.mailchannels.com/hc/en-us/articles/203155500-550-5-2-1-SDNF-Sender-Domain-Not-Found) (Sender Domain Not Found) blocks. For messages not to get blocked by SDNF, we require either an MX or A record to exist for the sender domain.
    - `a` `object` <Badge>guaranteed</Badge>
      - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of A record check.
      - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
    - `mx` `object` <Badge>guaranteed</Badge>
      - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of MX record check.
      - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `spf` `object` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of SPF check.
    - `verdict` `"passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown"` <Badge>guaranteed</Badge>
  - `references` `string[]` <Badge type="info">optional</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error. Link to SPF, Domain Lockdown or DKIM references, displayed if any verdict is not passed.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Create DKIM Key <Badge type="info">method</Badge>

Create a DKIM key pair for a specified domain and selector using the specified algorithm and key length, for the current customer.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain to create the DKIM key for.
- `options` `EmailsCreateDkimKeyOptions` <Badge type="danger">required</Badge>: Create DKIM key options.
  - `algorithm` `"rsa"` <Badge type="info">optional</Badge>: Algorithm used for the new key pair Currently, only RSA is supported. Defaults to `rsa`.
  - `length` `1024 | 2048 | 3072 | 4096` <Badge type="info">optional</Badge>: Key length in bits. For RSA, must be a multiple of `1024`.
    > [!TIP]
    > Defaults to `2048`.
    > Common values: `1024` or `2048`.
  - `selector` `string` <Badge type="danger">required</Badge>: Selector for the new key pair. Must be a maximum of 63 characters.

### Response

- `data` `EmailsDkimKey | null` <Badge type="warning">nullable</Badge>: The created DKIM key information.
  - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
  - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
  - `dnsRecords` `object[]` <Badge>guaranteed</Badge>: Suggested DNS records for the DKIM key.
    - `name` `string` <Badge>guaranteed</Badge>
    - `type` `string` <Badge>guaranteed</Badge>
    - `value` `string` <Badge>guaranteed</Badge>
  - `domain` `string` <Badge>guaranteed</Badge>: Domain associated with the key pair.
  - `gracePeriodExpiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp after which you can no longer use the rotated key for signing.
  - `length` `1024 | 2048 | 3072 | 4096` <Badge>guaranteed</Badge>: Key length in bits.
  - `publicKey` `string` <Badge>guaranteed</Badge>
  - `retiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp when a rotated key pair is retired.
  - `selector` `string` <Badge>guaranteed</Badge>: Selector assigned to the key pair.
  - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge>guaranteed</Badge>: Status of the key.
  - `statusModifiedAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key was last modified.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Get DKIM Keys <Badge type="info">method</Badge>

Search for DKIM keys by domain, with optional filters. If selector is provided, at most one key will be returned.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain to get the DKIM keys for.
- `options` `EmailsGetDkimKeysOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `selector` `string` <Badge type="info">optional</Badge>: Selector to filter keys by. Must be a maximum of 63 characters.
  - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge type="info">optional</Badge>: Status to filter keys by.
    > [!TIP]
    > Possible values: `active`, `revoked`, `retired`, `rotated`.
  - `offset` `number` <Badge type="info">optional</Badge>: Number of results to skip from the start. Must be a positive integer. Defaults to `0`.
  - `limit` `number` <Badge type="info">optional</Badge>: Maximum number of keys to return. Maximum is `100` and minimum is `1`. Defaults to `10`.
  - `includeDnsRecord` `boolean` <Badge type="info">optional</Badge>: If `true`, includes the suggested DKIM DNS record for each returned key. Defaults to `false`.

### Response

- `data` `Optional<EmailsDkimKey, "dnsRecords">[] | null` <Badge type="warning">nullable</Badge>: List of keys matching the filter. Empty if no keys match the filter.
  - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
  - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
  - `dnsRecords` `object[]` <Badge type="info">optional</Badge>: Suggested DNS records for the DKIM key. Only included if `includeDnsRecord` is `true`.
    - `name` `string` <Badge>guaranteed</Badge>
    - `type` `string` <Badge>guaranteed</Badge>
    - `value` `string` <Badge>guaranteed</Badge>
  - `domain` `string` <Badge>guaranteed</Badge>: Domain associated with the key pair.
  - `gracePeriodExpiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp after which you can no longer use the rotated key for signing.
  - `length` `1024 | 2048 | 3072 | 4096` <Badge>guaranteed</Badge>: Key length in bits.
  - `publicKey` `string` <Badge>guaranteed</Badge>
  - `retiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp when a rotated key pair is retired.
  - `selector` `string` <Badge>guaranteed</Badge>: Selector assigned to the key pair.
  - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge>guaranteed</Badge>: Status of the key.
  - `statusModifiedAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key was last modified.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Update DKIM Key <Badge type="info">method</Badge>

Update fields of an existing DKIM key pair for the specified domain and selector, for the current customer. Currently, only the `status` field can be updated.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { success, error } = await emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain of the DKIM key to update.
- `options` `EmailsUpdateDkimKeyOptions` <Badge type="danger">required</Badge>: Update DKIM key options.
  - `selector` `string` <Badge type="danger">required</Badge>: Selector of the DKIM key to update. Must be a maximum of 63 characters.
  - `status` `"revoked" | "retired" | "rotated"` <Badge type="danger">required</Badge>: New status of the DKIM key pair.
    > [!TIP]
    > Possible values: `revoked`, `retired`, `rotated`.
    > - `revoked`: Indicates that the key is compromised and should not be used.
    > - `retired`: Indicates that the key has been rotated and is no longer in use.
    > - `rotated`: Indicates that the key is going through the rotation process. Only active key pairs can be updated to this status, and no new key pair is created. The rotated key can be used to sign emails for 3 days after the status update, and will automatically change to `retired` 2 weeks after update. For a smooth key transition, it is recommended to create and publish a new key pair before signing is disabled for the rotated key.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Rotate DKIM Key <Badge type="info">method</Badge>

Rotate an active DKIM key pair. Mark the original key as `rotated`, and create a new key pair with the required new key selector, reusing the same algorithm and key length. The rotated key remains valid for signing for a 3-day grace period, and is automatically changed to `retired` 2 weeks after rotation. Publish the new key to its DNS TXT record before rotated key expires for signing as emails sent with an unpublished key will fail DKIM validation by receiving providers. After the grace period, only the new key is valid for signing if published.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.rotateDkimKey('example.com', 'mailchannels', {
  newKey: {
    selector: 'new-selector'
  }
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.rotateDkimKey('example.com', 'mailchannels', {
  newKey: {
    selector: 'new-selector'
  }
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain the DKIM key belongs to.
- `selector` `string` <Badge type="danger">required</Badge>: The selector of the DKIM key to rotate. Must be a maximum of 63 characters.
- `options` `object` <Badge type="danger">required</Badge>: The options to rotate the DKIM key.
  - `newKey` `object` <Badge type="danger">required</Badge>: New DKIM key options.
    - `selector` `string` <Badge type="danger">required</Badge>: The selector for the new key pair. Must be a maximum of 63 characters.

### Response

- `data` `object | null` <Badge type="warning">nullable</Badge>: The rotated and new DKIM key information.
  - `new` `EmailsDkimKey` <Badge>guaranteed</Badge>
    - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
    - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
    - `dnsRecords` `object[]` <Badge>guaranteed</Badge>: Suggested DNS records for the DKIM key.
      - `name` `string` <Badge>guaranteed</Badge>
      - `type` `string` <Badge>guaranteed</Badge>
      - `value` `string` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: Domain associated with the key pair.
    - `gracePeriodExpiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp after which you can no longer use the rotated key for signing.
    - `length` `1024 | 2048 | 3072 | 4096` <Badge>guaranteed</Badge>: Key length in bits.
    - `publicKey` `string` <Badge>guaranteed</Badge>
    - `retiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp when a rotated key pair is retired.
    - `selector` `string` <Badge>guaranteed</Badge>: Selector assigned to the key pair.
    - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge>guaranteed</Badge>: Status of the key.
    - `statusModifiedAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key was last modified.
  - `rotated` `EmailsDkimKey` <Badge>guaranteed</Badge>
    - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
    - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
    - `dnsRecords` `object[]` <Badge>guaranteed</Badge>: Suggested DNS records for the DKIM key.
      - `name` `string` <Badge>guaranteed</Badge>
      - `type` `string` <Badge>guaranteed</Badge>
      - `value` `string` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: Domain associated with the key pair.
    - `gracePeriodExpiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp after which you can no longer use the rotated key for signing.
    - `length` `1024 | 2048 | 3072 | 4096` <Badge>guaranteed</Badge>: Key length in bits.
    - `publicKey` `string` <Badge>guaranteed</Badge>
    - `retiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp when a rotated key pair is retired.
    - `selector` `string` <Badge>guaranteed</Badge>: Selector assigned to the key pair.
    - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge>guaranteed</Badge>: Status of the key.
    - `statusModifiedAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key was last modified.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Type declarations

<<< @/snippets/emails.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
  <<< @/snippets/success-response.ts

  **Send type declarations**

  <<< @/snippets/emails-send-options.ts
  <<< @/snippets/emails-send-options-base.ts
  <<< @/snippets/emails-send-attachment.ts
  <<< @/snippets/emails-send-recipient.ts
  <<< @/snippets/emails-send-tracking.ts
  <<< @/snippets/emails-send-response.ts

  **Send Async type declarations**

  <<< @/snippets/emails-send-async-response.ts

  **Check Domain type declarations**

  <<< @/snippets/emails-check-domain-options.ts
  <<< @/snippets/emails-check-domain-response.ts
  <<< @/snippets/emails-check-domain-verdict.ts
  <<< @/snippets/emails-check-domain-dkim.ts

  **Create DKIM Key type declarations**

  <<< @/snippets/emails-create-dkim-key-options.ts
  <<< @/snippets/emails-dkim-key-status.ts
  <<< @/snippets/emails-dkim-key.ts
  <<< @/snippets/emails-create-dkim-key-response.ts

  **Get DKIM Keys type declarations**

  <<< @/snippets/emails-get-dkim-keys-options.ts
  <<< @/snippets/optional.ts
  <<< @/snippets/emails-get-dkim-keys-response.ts

  **Update DKIM Key type declarations**

  <<< @/snippets/emails-update-dkim-key-options.ts

  **Rotate DKIM Key type declarations**

  <<< @/snippets/emails-rotate-dkim-key-options.ts
  <<< @/snippets/emails-rotate-dkim-key-response.ts
</details>
