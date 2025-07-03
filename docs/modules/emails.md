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
});
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
});
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

## Type declarations

<<< @/snippets/emails.ts

<details>
  <summary>All type declarations</summary>

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
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails.ts)
