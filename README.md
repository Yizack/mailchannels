# MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

MailChannels API library for Node.js.

- [✨ Release Notes](CHANGELOG.md)

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick setup](#quick-setup)
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
<!-- #region roadmap -->
## Roadmap

I plan to implement the following features in the future. Already implemented features are marked with a checkmark.

- [Email API](https://docs.mailchannels.net/email-api/api-reference/email-api)
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
  - ✅ Retrieve Webhook Signing Key
  - ✅ Send an Email
  - 🚧 Suspend Sub-account
<!-- #endregion roadmap -->

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
