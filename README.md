![MailChannels](/docs/public/images/presentation.png)

# MailChannels

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-coverage-src]][codecov-coverage-href]

Node.js SDK to integrate [MailChannels API](https://docs.mailchannels.net/) into your JavaScript or TypeScript server-side applications.

<!-- #region overview -->
This library provides a simple way to interact with the [MailChannels API](https://docs.mailchannels.net/). It is written in TypeScript and can be used in both JavaScript and TypeScript projects and in different runtimes.
<!-- #endregion overview -->

<!-- #region note -->
> [!NOTE]
> This library is NOT officially maintained by [MailChannels Corporation](https://mailchannels.com/).
<!-- #endregion note -->

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
- Manage sub-accounts

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

Already implemented features are marked with a checkmark.

### [Email API](https://docs.mailchannels.net/email-api/api-reference/email-api)

Fully implemented now. Please open an issue if you find any bugs or missing features.

- 📧 Emails
  - ✅ Send an Email
  - ✅ DKIM, SPF & Domain Lockdown Check
- 📢 Webhooks
  - ✅ Enroll for Webhook Notifications
  - ✅ Retrieve Customer Webhooks
  - ✅ Delete Customer Webhooks
  - ✅ Retrieve Webhook Signing Key
- 🪪 Sub-accounts
  - ✅ Create Sub-account
  - ✅ Retrieve Sub-accounts
  - ✅ Delete Sub-account
  - ✅ Suspend Sub-account
  - ✅ Activate Sub-account
  - ✅ Create Sub-account API Key
  - ✅ Delete Sub-account API Key
  - ✅ Retrieve Sub-account API Keys
  - ✅ Create Sub-account SMTP password
  - ✅ Delete Sub-account SMTP password
  - ✅ Retrieve Sub-account SMTP Passwords

### [Inbound API](https://docs.mailchannels.net/inbound-api/API-reference/inbound-api)

Soon to be implemented.

- Domains
  - ✅ Provision domain
  - 🚧 Remove domain
  - 🚧 List domains
  - 🚧 Bulk provision domains
  - 🚧 Add domain list entry
  - 🚧 Get domain list entries
  - ✅ Create login link
  - 🚧 Set downstream address
  - 🚧 Fetch downstream addresses
  - 🚧 Update API key
- Lists
  - 🚧 Add item to customer list
  - 🚧 Delete item from customer list
  - 🚧 Add item to recipient list
  - 🚧 Delete item from recipient list
  - 🚧 Get customer list entries
- Users
  - 🚧 Create a recipient
  - 🚧 Add item to recipient list
  - 🚧 Get recipient list entries
  - 🚧 Delete item from recipient list
- Service
  - ✅ Retrieve the condition of the service
  - 🚧 Submit a false negative or false positive report
  - ✅ Get a list of your subscriptions to MailChannels Inbound
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
[npm-version-src]: https://img.shields.io/npm/v/@yizack/mailchannels.svg?style=flat&colorA=070a30&colorB=35a047
[npm-version-href]: https://npmjs.com/package/@yizack/mailchannels

[npm-downloads-src]: https://img.shields.io/npm/dm/@yizack/mailchannels.svg?style=flat&colorA=070a30&colorB=35a047
[npm-downloads-href]: https://npmjs.com/package/@yizack/mailchannels

[codecov-coverage-src]: https://img.shields.io/codecov/c/github/yizack/mailchannels?style=flat&colorA=070a30&token=HTSBRHSJ5M
[codecov-coverage-href]: https://codecov.io/gh/Yizack/mailchannels
