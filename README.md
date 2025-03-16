# MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

MailChannels API library for Node.js.

- [✨ Release Notes](CHANGELOG.md)

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick setup](#quick-setup)
- [Configuration](#configuration)
- [Simple usage](#simple-usage)
- [Send method](#send-method)
  - [Arguments](#arguments)
  - [Options](#options)
  - [Response](#response)
  - [Examples](#examples)
- [Roadmap](#roadmap)
- [Contribution](#contribution)

## Features

- Send emails using [MailChannels Email API](https://docs.mailchannels.net/email-api)
- Email DKIM signing
- Supports mustache templates
- Text and HTML content types

## Requirements

- MailChannels account and Email API key

## Quick setup

1. Add `@yizack/mailchannels` dependency to your project

```sh
# npm
npm i @yizack/mailchannels

# yarn
yarn add @yizack/mailchannels

# pnpm
pnpm add @yizack/mailchannels
```

## Simple usage

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: {
    email: 'from@example.com',
    name: 'Example 2'
  },
  to: {
    email: 'to@example.com',
    name: 'Example 1'
  },
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

## Send method

The `send` method sends an email using the MailChannels API.

### Arguments

| Argument | Type | Description | Required |
| --- | --- | --- | --- |
| `options` | [`Options`](#options) | The email options to send | ✅ |
| `dryRun` | `boolean` | When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`. | ❌ |

### Options

Available options for the `send` method.

| Property | Description | Required |
| --- | --- | --- |
| `attachments` | An array of attachments to add to the email. Each attachment should be an object with `filename`, `content`, and `type` properties. | ❌ |
| `bcc` | The BCC recipients of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. | ❌ |
| `cc` | The CC recipients of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. | ❌ |
| `from` | The sender of the email. Can be a string or an object with `email` and `name` properties. | ✅ |
| `to` | The recipient of the email. Can be an object with `email` and `name` properties or a single email address string or an array of them. | ✅ |
| `replyTo` | The email address to reply to. Can be a string or an object with `email` and `name` properties. | ❌ |
| `subject` | The subject of the email. | ✅ |
| `html` | The HTML content of the email. Required if `text` is not set. | 🟡 |
| `text` | The plain text content of the email. Required if `html` is not set. | 🟡 |
| `mustaches` | Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings. | ❌ |

> [!TIP]
> Including a plain text version of your email ensures that all recipients can read your message, including those with email clients that lack HTML support.
>
> You can use the [`html-to-text`](https://www.npmjs.com/package/html-to-text) package to convert your HTML content to plain text.

### Response

The `send` method returns a promise that resolves to an object with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates the success or failure of the email sending operation. |
| `payload` | `object` | The payload sent to the MailChannels Email API. |
| `data` | `string[]` or `undefined` | The fully rendered message if the `dryRun` argument is set to `true`. |


### Examples

Use the `send` method inside your API routes to send emails.

The recipient parameters can be either an email address string or an object with `email` and `name` properties.

#### Using object recipients (recommended)

This is the best way to add names to the recipients.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: {
    email: 'from@example.com',
    name: 'Example 2'
  },
  to: {
    email: 'to@example.com',
    name: 'Example 1'
  },
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

#### Using string recipients

This is the simplest way to send an email.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

#### Array of recipients

You can also send an email to multiple recipients.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: {
    email: 'from@example.com',
    name: 'Example 3'
  },
  to: [
    {
      email: 'to1@example.com',
      name: 'Example 1'
    },
    {
      email: 'to2@example.com',
      name: 'Example 2'
    }
  ],
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

or

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: ['to1@example.com', 'to2@example.com'],
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

#### Using mustache templates

You can use the `mustaches` property to render mustache templates.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Mustaches test',
  html: '<p>Hello {{ world }}</p>',
  text: 'Hello {{ world }}',
  mustaches: {
    world: 'World',
  },
})
```

#### Dry run

You can set the `dryRun` argument to test your email without sending it. It will return the fully rendered message in the `data` property of the response.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: 'from@example.com',
  to: 'to@example.com',
  subject: 'Test',
  html: '<p>Test</p>',
  text: 'Test',
}, true) // <-- `true` = dryRun enabled
```

#### Name-address pairs

You can use name-address pairs string format.

```ts
const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  from: 'Sender Name <sender@example.com>',
  to: 'Recipient Name <recipient@example.com>',
  subject: 'Your subject',
  html: '<p>Your email content</p>',
  text: 'Your email content',
})
```

## Roadmap

I plan to implement the following features in the future. Already implemented features are marked with a checkmark.

- Email API
  - 🚧 Activate Sub-account
  - 🚧 Create Sub-account API Key
  - 🚧 Create Sub-account SMTP password
  - 🚧 Create Sub-account
  - ✅ Delete Customer Webhooks
  - 🚧 Delete Sub-account API Key
  - 🚧 Delete Sub-account SMTP password
  - 🚧 Delete Sub-account
  - ✅ DKIM, SPF & Domain Lockdown Check
  - ✅ Enroll for Webhook Notifications
  - ✅ Retrieve Customer Webhooks
  - 🚧 Retrieve Sub-account API Keys
  - 🚧 Retrieve Sub-account SMTP Passwords
  - 🚧 Retrieve Sub-accounts
  - 🚧 Retrieve Webhook Signing Key
  - ✅ Send an Email
  - 🚧 Suspend Sub-account

## Contribution

<details>
  <summary>Local development</summary>
  
```sh
# Install dependencies
pnpm install

# Build the package
npm run build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Run typecheck
npm run test:types

# Release new version
npm run release
```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@yizack/mailchannels/latest.svg?style=flat&colorA=333333&colorB=ca0000
[npm-version-href]: https://npmjs.com/package/@yizack/mailchannels

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-mailchannels.svg?style=flat&colorA=333333&colorB=ca0000
[npm-downloads-href]: https://npmjs.com/package/nuxt-mailchannels
