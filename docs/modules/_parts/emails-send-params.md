<!-- #region options -->
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
  - `envelopeFrom` `EmailsSendRecipient | string` <Badge type="info">optional</Badge>: Optional envelope sender address. If not set, the envelope sender defaults to the `from.email` field. Can be overridden per-personalization. Only the email portion is used; the name field is ignored.
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
    <!-- #endregion options -->
- `dryRun` `boolean` <Badge type="info">optional</Badge>: When set to `true`, the email will not be sent. Instead, the fully rendered message will be returned in the `data.rendered` property of the response.
  > [!TIP]
  > Use `dryRun` to test your email message before sending it.
