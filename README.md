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
> [!IMPORTANT]
> **Disclaimer**: This library is not associated with [MailChannels Corporation](https://mailchannels.com/).
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
- Support explicit MailChannels personalizations and envelope sender overrides
- Queue emails asynchronously
- Check DKIM, SPF & Domain Lockdown
- Configure DKIM keys
- Webhook notifications
- Manage sub-accounts
- Retrieve metrics
- Inspect webhook delivery batches
- Handle suppressions
- Configure inbound domains
- Manage account and recipient lists

## <a name="requirements">📏 Requirements</a>

- MailChannels account
- Email API key

## <a name="quick-setup">🏃 Quick setup</a>

1. Add `mailchannels-sdk` dependency to your project

```sh
# npm
npm i mailchannels-sdk

# yarn
yarn add mailchannels-sdk

# pnpm
pnpm add mailchannels-sdk
```

## <a name="license">⚖️ License</a>

[MIT License](LICENSE)

<!-- #region roadmap -->
## <a name="roadmap">🚧 Roadmap</a>

Already implemented features are marked with a checkmark. Please open an issue if you find any bugs or missing features.

> [!NOTE]
> Links below point to the official MailChannels API documentation, options and responses may differ slightly when using this SDK. Please refer to the [documentation](https://mailchannels.yizack.com) for the correct usage of each feature.

### [Email API](https://docs.mailchannels.net/email-api/api-reference/email-api)

- 📧 Emails
  - ✅ [Send an Email Asynchronously](https://docs.mailchannels.net/email-api/api-reference/send-an-email-asynchronously)
  - ✅ [Send an Email](https://docs.mailchannels.net/email-api/api-reference/send-an-email)
  - ✅ [DKIM, SPF & Domain Lockdown Check](https://docs.mailchannels.net/email-api/api-reference/dkim-spf-domain-lockdown-check)
  - ✅ [Create DKIM Key Pair](https://docs.mailchannels.net/email-api/api-reference/create-dkim-key-pair)
  - ✅ [Retrieve DKIM Keys](https://docs.mailchannels.net/email-api/api-reference/retrieve-dkim-keys)
  - ✅ [Rotate DKIM Key Pair](https://docs.mailchannels.net/email-api/api-reference/rotate-dkim-key-pair)
  - ✅ [Update DKIM Key Status](https://docs.mailchannels.net/email-api/api-reference/update-dkim-key-status)
- 📢 Webhooks
  - ✅ [Enroll for Webhook Notifications](https://docs.mailchannels.net/email-api/api-reference/enroll-for-webhook-notifications)
  - ✅ [Retrieve Customer Webhooks](https://docs.mailchannels.net/email-api/api-reference/retrieve-customer-webhooks)
  - ✅ [Delete Customer Webhooks](https://docs.mailchannels.net/email-api/api-reference/delete-customer-webhooks)
  - ✅ [Retrieve Webhook Batches](https://docs.mailchannels.net/email-api/api-reference/retrieve-webhook-batches)
  - ✅ [Retrieve Webhook Signing Key](https://docs.mailchannels.net/email-api/api-reference/retrieve-webhook-signing-key)
  - ✅ [Validate Enrolled Webhook](https://docs.mailchannels.net/email-api/api-reference/validate-enrolled-webhook)
- 🪪 Sub-accounts
  - ✅ [Create Sub-account](https://docs.mailchannels.net/email-api/api-reference/create-sub-account)
  - ✅ [Retrieve Sub-accounts](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-accounts)
  - ✅ [Delete Sub-account](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account)
  - ✅ [Suspend Sub-account](https://docs.mailchannels.net/email-api/api-reference/suspend-sub-account)
  - ✅ [Activate Sub-account](https://docs.mailchannels.net/email-api/api-reference/activate-sub-account)
  - ✅ [Create Sub-account API Key](https://docs.mailchannels.net/email-api/api-reference/create-sub-account-api-key)
  - ✅ [Delete Sub-account API Key](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-api-key)
  - ✅ [Retrieve Sub-account API Keys](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-api-keys)
  - ✅ [Create Sub-account SMTP Password](https://docs.mailchannels.net/email-api/api-reference/create-sub-account-smtp-password)
  - ✅ [Delete Sub-account SMTP Password](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-smtp-password)
  - ✅ [Retrieve Sub-account SMTP Passwords](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-smtp-passwords)
  - ✅ [Retrieve Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-limit)
  - ✅ [Set Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/set-sub-account-limit)
  - ✅ [Delete Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-limit)
  - ✅ [Retrieve Sub-account Usage Stats](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-usage-stats)
- 📊 Metrics
  - ✅ [Retrieve Engagement Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-engagement-metrics)
  - ✅ [Retrieve Performance Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-performance-metrics)
  - ✅ [Retrieve Recipient Behaviour Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-recipient-behaviour-metrics)
  - ✅ [Retrieve Sender Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-sender-metrics)
  - ✅ [Retrieve Usage Stats](https://docs.mailchannels.net/email-api/api-reference/retrieve-usage-stats)
  - ✅ [Retrieve Volume Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-volume-metrics)
- 🚫 Suppressions
  - ✅ [Create Suppression Entries](https://docs.mailchannels.net/email-api/api-reference/create-suppression-entries)
  - ✅ [Delete Suppression Entry](https://docs.mailchannels.net/email-api/api-reference/delete-suppression-entry)
  - ✅ [Retrieve Suppression List](https://docs.mailchannels.net/email-api/api-reference/retrieve-suppression-list)

### [Inbound API](https://docs.mailchannels.net/inbound-api/API-reference/inbound-api)

- 🌐 Domains
  - ✅ [Provision domain](https://docs.mailchannels.net/inbound-api/API-reference/provision-domain)
  - ✅ [Remove domain](https://docs.mailchannels.net/inbound-api/API-reference/remove-domain)
  - ✅ [List domains](https://docs.mailchannels.net/inbound-api/API-reference/list-domains)
  - ✅ [Bulk provision domains](https://docs.mailchannels.net/inbound-api/API-reference/bulk-provision-domains)
  - ✅ [Add domain list entry](https://docs.mailchannels.net/inbound-api/API-reference/add-domain-list-entry)
  - ✅ [Get domain list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-domain-list-entries)
  - ✅ [Delete domain list entry](https://docs.mailchannels.net/inbound-api/API-reference/delete-domain-list-entry)
  - ✅ [Create login link](https://docs.mailchannels.net/inbound-api/API-reference/create-login-link)
  - ✅ [Bulk create login links](https://docs.mailchannels.net/inbound-api/API-reference/bulk-create-login-links)
  - ✅ [Set downstream address](https://docs.mailchannels.net/inbound-api/API-reference/set-downstream-address)
  - ✅ [Fetch downstream addresses](https://docs.mailchannels.net/inbound-api/API-reference/fetch-downstream-addresses)
  - ✅ [Update API key](https://docs.mailchannels.net/inbound-api/API-reference/update-api-key)
- 📋 Lists
  - ✅ [Add item to customer list](https://docs.mailchannels.net/inbound-api/API-reference/add-item-to-customer-list)
  - ✅ [Delete item from customer list](https://docs.mailchannels.net/inbound-api/API-reference/delete-item-from-customer-list)
  - ✅ [Get customer list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-customer-list-entries)
- 📥 Users
  - ✅ [Create a recipient](https://docs.mailchannels.net/inbound-api/API-reference/create-a-recipient)
  - ✅ [Add item to recipient list](https://docs.mailchannels.net/inbound-api/API-reference/add-item-to-recipient-list)
  - ✅ [Get recipient list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-recipient-list-entries)
  - ✅ [Delete item from recipient list](https://docs.mailchannels.net/inbound-api/API-reference/delete-item-from-recipient-list)
- ⚙️ Service
  - ✅ [Retrieve the condition of the service](https://docs.mailchannels.net/inbound-api/API-reference/retrieve-the-condition-of-the-service)
  - ✅ [Submit a false negative or false positive report](https://docs.mailchannels.net/inbound-api/API-reference/submit-a-false-negative-or-false-positive-report)
  - ✅ [Get a list of your subscriptions to MailChannels Inbound](https://docs.mailchannels.net/inbound-api/API-reference/get-a-list-of-your-subscriptions-to-mail-channels-inbound)
<!-- #endregion roadmap -->

## <a name="development">💻 Development</a>

<details>
  <summary>Local development</summary>

```sh
# Install dependencies
pnpm install

# Refresh parity fixtures from the checked-in OpenAPI specs
pnpm parity:fixtures

# Refresh the checked-in OpenAPI specs from docs.mailchannels.net, then regenerate fixtures
pnpm parity:fixtures -- --refresh-specs

# Build the package
pnpm build

# Run ESLint
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
