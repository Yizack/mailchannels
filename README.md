# MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

MailChannels API library for Node.js.

This library provides a simple way to interact with the MailChannels API. It is written in TypeScript and can be used in both TypeScript and JavaScript projects and in different runtimes.

- [✨ Release Notes](CHANGELOG.md)
- [📖 Documentation](https://mailchannels.yizack.com)

## Contents

- 🚀 [Features](#features)
- 📏 [Requirements](#requirements)
- 🏃 [Quick setup](#quick-setup)
- 🚧 [Roadmap](#roadmap)
- ⚖️ [License](LICENSE.md)
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

[MIT License](LICENSE.md)

<!-- #region roadmap -->
## <a name="roadmap">🚧 Roadmap</a>

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
