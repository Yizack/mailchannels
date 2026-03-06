![MailChannels Node.js SDK](/docs/public/images/presentation.png)

# MailChannels Node.js SDK

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-coverage-src]][codecov-coverage-href]

Node.js SDK to integrate [MailChannels API](https://docs.mailchannels.net/) into your JavaScript or TypeScript server-side applications.

<!-- #region overview -->
This library provides a simple way to interact with the [MailChannels API](https://docs.mailchannels.net/). It is written in TypeScript and can be used in both JavaScript and TypeScript projects and in different runtimes.
<!-- #endregion overview -->

<!-- #region disclaimer -->
> [!IMPORTANT]
> **Disclaimer**: This library is not associated with [MailChannels Corporation](https://mailchannels.com/).
<!-- #endregion disclaimer -->

- [✨ Release Notes](CHANGELOG.md)
- [📖 Documentation](https://mailchannels.yizack.com)

## Contents

- 🚀 [Features](#features)
- 📏 [Requirements](#requirements)
- 📦 [Installation](#installation)
- 📚 [Usage](#usage)
- 📐 [Naming Conventions](#naming-conventions)
- ⚖️ [License](#license)
- 💻 [Development](#development)

## <a name="features">🚀 Features</a>

<!-- #region features -->
This SDK fully supports all features and operations available in the [MailChannels API](https://docs.mailchannels.net/). It is actively maintained to ensure compatibility and to quickly add support for new API features as they are released.

Some of the things you can do with the SDK:

- Send transactional emails
- Check DKIM, SPF & Domain Lockdown
- Configure DKIM keys
- Webhook notifications
- Manage sub-accounts
- Retrieve metrics
- Handle suppressions
- Configure inbound domains
- Manage account and recipient lists

> [!TIP]
> For a detailed reference mapping each SDK method to its corresponding MailChannels API endpoint reference, see the [SDK-API Mapping](https://mailchannels.yizack.com/sdk-api-mapping)
<!-- #endregion features -->

## <a name="requirements">📏 Requirements</a>

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## <a name="installation">📦 Installation</a>

1. Add `mailchannels-sdk` dependency to your project

```sh
# npm
npm i mailchannels-sdk

# yarn
yarn add mailchannels-sdk

# pnpm
pnpm add mailchannels-sdk
```

## <a name="usage">📚 Usage</a>

To authenticate, you'll need an API key. You can create and manage API keys in **Dashboard** > **Account Settings** > **API Keys**.

Pass your API key while initializing a new MailChannels client.

```ts
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')
```

Send an email:

```ts
const { data, error } = await mailchannels.emails.send({
  from: 'Name <from@example.com>',
  to: 'to@example.com',
  subject: 'Test email',
  html: '<p>Hello World</p>'
})
```

## <a name="naming-conventions">📐 Naming Conventions</a>

<!-- #region naming-conventions -->
Most properties in the MailChannels API use `snake_case`. To follow JavaScript conventions, the SDK adopts `camelCase` for all properties. This means:

- Most options and responses match the API docs, but field names are `camelCase` rather than `snake_case`.
- Some fields are grouped into nested objects or renamed for simplicity and better developer experience.
- While most fields match the API docs (just with `camelCase`), a few may be simplified or reorganized to feel more natural for JavaScript developers.
<!-- #endregion naming-conventions -->

## <a name="license">⚖️ License</a>

[MIT License](LICENSE)

## <a name="development">💻 Development</a>

<details>
  <summary>Local development</summary>

```sh
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run Oxlint
pnpm lint

# Run Vitest
pnpm test
pnpm test:watch

# Run typecheck
pnpm test:types

# Release new version
pnpm release
```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/mailchannels-sdk.svg?style=flat&colorA=070a30&colorB=35a047
[npm-version-href]: https://npmjs.com/package/mailchannels-sdk

[npm-downloads-src]: https://img.shields.io/npm/dm/mailchannels-sdk.svg?style=flat&colorA=070a30&colorB=35a047
[npm-downloads-href]: https://npmjs.com/package/mailchannels-sdk

[codecov-coverage-src]: https://img.shields.io/codecov/c/github/yizack/mailchannels?style=flat&colorA=070a30&token=HTSBRHSJ5M
[codecov-coverage-href]: https://codecov.io/gh/Yizack/mailchannels
