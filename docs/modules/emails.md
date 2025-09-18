---
outline: deep
---

# 📧 Emails <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
This module allows you to send emails and check domain settings for secure email delivery.
<!-- #endregion description -->

## Send <Badge type="info" text="method" />

Sends an email message to one or more recipients.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { success } = await emails.send({
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

const { success } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```
:::

### Params

- `options`: Send options.
  - `attachments`: An array of attachments to be sent with the email.
    - `content`: The attachment data, encoded in base64
    - `filename`: The name of the attachment file
    - `type`: The MIME type of the attachment
  - `campaignId`: The campaign identifier. If specified, this ID will be included in all relevant webhooks. It can be up to 48 UTF-8 characters long and must not contain spaces.
  - `bcc`: The BCC recipients of the email.
  - `cc`: The CC recipients of the email.
  - `dkim`: The DKIM settings for the email.
    - `domain`: The domain to sign the email with.
    - `privateKey`: The private key to sign the email with.
    - `selector`: The DKIM selector to use.
  - `from`: The sender of the email.
  - `to`: The recipients of the email.
  - `tracking` Adjust open and click tracking for the message.
    > [!INFO]
    > Tracking for your messages requires a [subscription](https://www.mailchannels.com/pricing/#for_devs) that supports open and click tracking.
    >
    > Only links (`<a>` tags) meeting all of the following conditions are processed for click tracking:
    > - The URL is non-empty.
    > - The URL starts with `http` or `https`.
    > - The link does not have a `clicktracking` attribute set to `off`.
  - `replyTo`: The reply-to address of the email.
  - `subject`: The subject of the email.
  - `html`: The HTML content of the email. Required if `text` is not set.
  - `text`: The plain text content of the email. Required if `html` is not set.
    > [!IMPORTANT]
    > Either `html` or `text` must be provided.
    <!---->
    > [!TIP]
    > Including a plain text version of your email ensures that all recipients can read your message, including those with email clients that lack HTML support.
    >
    > You can use the [`html-to-text`](https://www.npmjs.com/package/html-to-text) package to convert your HTML content to plain text.
  - `mustaches`: Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering.
  - `transactional`: Mark these messages as transactional or non-transactional. In order for a message to be marked as non-transactional, it must have exactly one recipient per personalization, and it must be DKIM signed. 400 Bad Request will be returned if there are more than one recipient in any personalization for non-transactional messages. If a message is marked as non-transactional, it changes the sending process as follows:
    List-Unsubscribe headers will be added.
- `dryRun`: When set to `true`, the email will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response.
  > [!TIP]
  > Use `dryRun` to test your email message before sending it.

## Check Domain <Badge type="info" text="method" />

*DKIM, SPF & Domain Lockdown Check*

Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This method checks whether the domain is properly configured for secure email delivery.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { results } = await emails.checkDomain({
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

const { success } = await mailchannels.emails.checkDomain({
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

- `options`: Check domain options.
  - `dkim`: The DKIM settings for the domain.
    - `domain`: The DKIM domain to sign the email with.
    - `privateKey`: The DKIM private key to sign the email with. Encoded in Base64.
    - `selector`: The DKIM selector to use.
  - `domain`: Domain used for sending emails.
  - `senderId`: The sender ID to check the domain with.
    > [!INFO]
    > Your `senderId` is the `X-MailChannels-Sender-Id` header value in emails sent via MailChannels.

## Create DKIM Key <Badge type="info" text="method" />

Create a DKIM key pair for a specified domain and selector using the specified algorithm and key length, for the current customer.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { key } = await emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```
:::

### Params

- `domain`: The domain to create the DKIM key for.
- `options`: Create DKIM key options.
  - `algorithm`: Algorithm used for the new key pair Currently, only RSA is supported. Defaults to `rsa`.
  - `length`: Key length in bits. For RSA, must be a multiple of `1024`.
    > [!TIP]
    > Defaults to `2048`.
    > Common values: `1024` or `2048`.
  - `selector`: Selector for the new key pair. Must be a maximum of 63 characters.

## Get DKIM Keys <Badge type="info" text="method" />

Search for DKIM keys by customer handle and domain, with optional filters. If selector is provided, at most one key will be returned.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { keys } = await emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { keys } = await mailchannels.emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```
:::

### Params

- `domain`: The domain to get the DKIM keys for.
- `options`: Optional filter options.
  - `selector`: Selector to filter keys by. Must be a maximum of 63 characters.
  - `status`: Status to filter keys by.
    > [!TIP]
    > Possible values: `active`, `revoked`, `retired`.
  - `offset`: Number of results to skip from the start. Must be a positive integer. Defaults to `0`.
  - `limit`: Maximum number of keys to return. Maximum is `100` and minimum is `1`. Defaults to `10`.
  - `includeDnsRecord`: If `true`, includes the suggested DKIM DNS record for each returned key. Defaults to `false`.

## Update DKIM Key <Badge type="info" text="method" />

Update fields of an existing DKIM key pair for the specified domain and selector, for the current customer. Currently, only the `status` field can be updated.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { success } = await emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```
:::

### Params

- `domain`: The domain of the DKIM key to update.
- `options`: Update DKIM key options.
  - `selector`: Selector of the DKIM key to update. Must be a maximum of 63 characters.
  - `status`: New status of the DKIM key pair.
    > [!TIP]
    > Possible values: `revoked`, `retired`.
    > - `revoked`: Indicates that the key is compromised and should not be used.
    > - `retired`: Indicates that the key has been rotated and is no longer in use.

## Type declarations

<<< @/snippets/emails.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **Send type declarations**

  <<< @/snippets/emails-send-options.ts
  <<< @/snippets/emails-send-options-base.ts
  <<< @/snippets/emails-send-attachment.ts
  <<< @/snippets/emails-send-recipient.ts
  <<< @/snippets/emails-send-tracking.ts
  <<< @/snippets/emails-send-response.ts

  **Check Domain type declarations**

  <<< @/snippets/emails-check-domain-options.ts
  <<< @/snippets/emails-check-domain-response.ts
  <<< @/snippets/emails-check-domain-verdict.ts
  <<< @/snippets/emails-check-domain-dkim.ts

  **Create DKIM Key type declarations**

  <<< @/snippets/emails-dkim-key.ts
  <<< @/snippets/emails-create-dkim-key-options.ts
  <<< @/snippets/emails-create-dkim-key-response.ts

  **Get DKIM Keys type declarations**

  <<< @/snippets/emails-get-dkim-keys-options.ts
  <<< @/snippets/emails-get-dkim-keys-response.ts

  **Update DKIM Key type declarations**

  <<< @/snippets/emails-update-dkim-key-options.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails.ts)
