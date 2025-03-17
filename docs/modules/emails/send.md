---
outline: deep
---

# Send

Sends an email message to one or more recipients.

## Send method

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Send } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Send(mailchannels)

const { success } = await emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
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
  > [!TIP]
- `dryRun`: When set to `true`, the email will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response.
  > [!TIP]
  > Use `dryRun` to test your email message before sending it.

## Type declarations

<<< @/snippets/send.ts

<details>
  <summary>All type declarations</summary>

  <<< @/snippets/send-options.ts
  <<< @/snippets/send-options-base.ts
  <<< @/snippets/send-attachment.ts
  <<< @/snippets/send-content.ts
  <<< @/snippets/send-recipient.ts
  <<< @/snippets/send-tracking.ts
  <<< @/snippets/send-response.ts
  <<< @/snippets/send-personalization.ts
  <<< @/snippets/send-payload.ts

  > [!INFO]
  > `SendPayload` is the body sent to the MailChannels API. Reference: [Send an Email](https://docs.mailchannels.net/email-api/api-reference/send-an-email)
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails/send.ts)
