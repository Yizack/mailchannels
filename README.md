# MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

MailChannels API library. Node.js SDK to integrate MailChannels into your JavasScript or TypeScript applications.

This library provides a simple way to interact with the MailChannels API. It is written in TypeScript and can be used in both TypeScript and JavaScript projects and in different runtimes.

- [✨ Release Notes](CHANGELOG.md)
- [📖 Documentation](https://mailchannels.yizack.com)

## Contents

- 🚀 [Features](#features)
- 📏 [Requirements](#requirements)
- 🏃 [Quick setup](#quick-setup)
- 🚧 [Roadmap](#roadmap)
- ⚖️ [License](#license)
- 💻 [Development](#development)

## <a name="features">🚀 Features</a>

- Send transactional emails
- Check DKIM, SPF & Domain Lockdown
- Webhook notifications

## <a name="requirements">📏 Requirements</a>

- MailChannels account
- Email API key

## <a name="quick-setup">🏃 Quick setup</a>

1. Add `@yizack/mailchannels` dependency to your project

```sh
# npm
npm i @yizack/mailchannels

# yarn
yarn add @yizack/mailchannels

# pnpm
pnpm add @yizack/mailchannels
```

## <a name="license">⚖️ License</a>

[MIT License](LICENSE)

<!-- #region roadmap -->
## <a name="roadmap">🚧 Roadmap</a>

I plan to implement the following features in the future. Already implemented features are marked with a checkmark.

### [Email API](https://docs.mailchannels.net/email-api/api-reference/email-api)
- Send
  - ✅ Send an Email
- Check Domain
  - ✅ DKIM, SPF & Domain Lockdown Check
- Webhooks
  - ✅ Enroll for Webhook Notifications
  - ✅ Retrieve Customer Webhooks
  - ✅ Delete Customer Webhooks
  - ✅ Retrieve Webhook Signing Key
- Sub Accounts
  - 🚧 Create Sub-account
  - ✅ Retrieve Sub-accounts
  - 🚧 Delete Sub-account
  - 🚧 Activate Sub-account
  - 🚧 Suspend Sub-account
  - 🚧 Create Sub-account API Key
  - 🚧 Delete Sub-account API Key
  - 🚧 Retrieve Sub-account API Keys
  - 🚧 Create Sub-account SMTP password
  - 🚧 Delete Sub-account SMTP password
  - 🚧 Retrieve Sub-account SMTP Passwords
<!-- #endregion roadmap -->

## <a name="development">💻 Development</a>

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
