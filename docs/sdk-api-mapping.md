# SDK-API Mapping

This page provides a mapping between the MailChannels SDK module methods and the corresponding API documentation reference.

## Email API

### 📧 Emails

  | SDK Method | API Reference |
  | --- | --- |
  | [`send()`](/modules/emails/send) | [Send an Email](https://docs.mailchannels.net/email-api/api-reference/send-an-email) |
  | [`sendAsync()`](/modules/emails/send-async) | [Send an Email Asynchronously](https://docs.mailchannels.net/email-api/api-reference/send-an-email-asynchronously) |
  | [`checkDomain()`](/modules/emails/check-domain) | [DKIM, SPF & Domain Lockdown Check](https://docs.mailchannels.net/email-api/api-reference/dkim-spf-domain-lockdown-check) |
  | [`createDkimKey()`](/modules/emails/create-dkim-key) | [Create DKIM Key Pair](https://docs.mailchannels.net/email-api/api-reference/create-dkim-key-pair) |
  | [`getDkimKeys()`](/modules/emails/get-dkim-keys) | [Retrieve DKIM Keys](https://docs.mailchannels.net/email-api/api-reference/retrieve-dkim-keys) |
  | [`updateDkimKey()`](/modules/emails/update-dkim-key) | [Update DKIM Key Status](https://docs.mailchannels.net/email-api/api-reference/update-dkim-key-status) |
  | [`rotateDkimKey()`](/modules/emails/rotate-dkim-key) | [Rotate DKIM Key Pair](https://docs.mailchannels.net/email-api/api-reference/rotate-dkim-key-pair) |

### 📢 Webhooks

  | SDK Method | API Reference |
  | --- | --- |
  | [`enroll()`](/modules/webhooks/enroll) | [Enroll for Webhook Notifications](https://docs.mailchannels.net/email-api/api-reference/enroll-for-webhook-notifications) |
  | [`list()`](/modules/webhooks/list) | [Retrieve Customer Webhooks](https://docs.mailchannels.net/email-api/api-reference/retrieve-customer-webhooks) |
  | [`delete()`](/modules/webhooks/delete) | [Delete Customer Webhooks](https://docs.mailchannels.net/email-api/api-reference/delete-customer-webhooks) |
  | [`getSigningKey()`](/modules/webhooks/get-signing-key) | [Retrieve Webhook Signing Key](https://docs.mailchannels.net/email-api/api-reference/retrieve-webhook-signing-key) |
  | [`validate()`](/modules/webhooks/validate) | [Validate Enrolled Webhook](https://docs.mailchannels.net/email-api/api-reference/validate-enrolled-webhook) |
  | [`verify()`](/modules/webhooks/verify) | SDK only |

### 🪪 Sub-accounts

  | SDK Method | API Reference |
  | --- | --- |
  | [`create()`](/modules/sub-accounts/create) | [Create Sub-account](https://docs.mailchannels.net/email-api/api-reference/create-sub-account) |
  | [`list()`](/modules/sub-accounts/list) | [Retrieve Sub-accounts](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-accounts) |
  | [`delete()`](/modules/sub-accounts/delete) | [Delete Sub-account](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account) |
  | [`suspend()`](/modules/sub-accounts/suspend) | [Suspend Sub-account](https://docs.mailchannels.net/email-api/api-reference/suspend-sub-account) |
  | [`activate()`](/modules/sub-accounts/activate) | [Activate Sub-account](https://docs.mailchannels.net/email-api/api-reference/activate-sub-account) |
  | [`createApiKey()`](/modules/sub-accounts/create-api-key) | [Create Sub-account API Key](https://docs.mailchannels.net/email-api/api-reference/create-sub-account-api-key) |
  | [`deleteApiKey()`](/modules/sub-accounts/delete-api-key) | [Delete Sub-account API Key](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-api-key) |
  | [`listApiKeys()`](/modules/sub-accounts/list-api-keys) | [Retrieve Sub-account API Keys](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-api-keys) |
  | [`createSmtpPassword()`](/modules/sub-accounts/create-smtp-password) | [Create Sub-account SMTP Password](https://docs.mailchannels.net/email-api/api-reference/create-sub-account-smtp-password) |
  | [`deleteSmtpPassword()`](/modules/sub-accounts/delete-smtp-password) | [Delete Sub-account SMTP Password](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-smtp-password) |
  | [`listSmtpPasswords()`](/modules/sub-accounts/list-smtp-passwords) | [Retrieve Sub-account SMTP Passwords](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-smtp-passwords) |
  | [`getLimit()`](/modules/sub-accounts/get-limit) | [Retrieve Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-limit) |
  | [`setLimit()`](/modules/sub-accounts/set-limit) | [Set Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/set-sub-account-limit) |
  | [`deleteLimit()`](/modules/sub-accounts/delete-limit) | [Delete Sub-account Limit](https://docs.mailchannels.net/email-api/api-reference/delete-sub-account-limit) |
  | [`getUsage()`](/modules/sub-accounts/get-usage) | [Retrieve Sub-account Usage Stats](https://docs.mailchannels.net/email-api/api-reference/retrieve-sub-account-usage-stats) |

### 📊 Metrics

  | SDK Method | API Reference |
  | --- | --- |
  | [`engagement()`](/modules/metrics/engagement) | [Retrieve Engagement Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-engagement-metrics) |
  | [`performance()`](/modules/metrics/performance) | [Retrieve Performance Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-performance-metrics) |
  | [`recipientBehaviour()`](/modules/metrics/recipient-behaviour) | [Retrieve Recipient Behaviour Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-recipient-behaviour-metrics) |
  | [`usage()`](/modules/metrics/usage) | [Retrieve Usage Stats](https://docs.mailchannels.net/email-api/api-reference/retrieve-usage-stats) |
  | [`volume()`](/modules/metrics/volume) | [Retrieve Volume Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-volume-metrics) |
  | [`senders()`](/modules/metrics/senders) | [Retrieve Sender Metrics](https://docs.mailchannels.net/email-api/api-reference/retrieve-sender-metrics) |

### 🚫 Suppressions

  | SDK Method | API Reference |
  | --- | --- |
  | [`create()`](/modules/suppressions/create) | [Create Suppression Entries](https://docs.mailchannels.net/email-api/api-reference/create-suppression-entries) |
  | [`delete()`](/modules/suppressions/delete) | [Delete Suppression Entry](https://docs.mailchannels.net/email-api/api-reference/delete-suppression-entry) |
  | [`list()`](/modules/suppressions/list) | [Retrieve Suppression List](https://docs.mailchannels.net/email-api/api-reference/retrieve-suppression-list) |

## Inbound API

### 🌐 Domains

  | SDK Method | API Reference |
  | --- | --- |
  | [`provision()`](/modules/domains/provision) | [Provision domain](https://docs.mailchannels.net/inbound-api/API-reference/provision-domain) |
  | [`bulkProvision()`](/modules/domains/bulk-provision) | [Bulk provision domains](https://docs.mailchannels.net/inbound-api/API-reference/bulk-provision-domains) |
  | [`delete()`](/modules/domains/delete) | [Remove domain](https://docs.mailchannels.net/inbound-api/API-reference/remove-domain) |
  | [`list()`](/modules/domains/list) | [List domains](https://docs.mailchannels.net/inbound-api/API-reference/list-domains) |
  | [`addListEntry()`](/modules/domains/add-list-entry) | [Add domain list entry](https://docs.mailchannels.net/inbound-api/API-reference/add-domain-list-entry) |
  | [`listEntries()`](/modules/domains/list-entries) | [Get domain list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-domain-list-entries) |
  | [`deleteListEntry()`](/modules/domains/delete-list-entry) | [Delete domain list entry](https://docs.mailchannels.net/inbound-api/API-reference/delete-domain-list-entry) |
  | [`createLoginLink()`](/modules/domains/create-login-link) | [Create login link](https://docs.mailchannels.net/inbound-api/API-reference/create-login-link) |
  | [`bulkCreateLoginLinks()`](/modules/domains/bulk-create-login-links) | [Bulk create login links](https://docs.mailchannels.net/inbound-api/API-reference/bulk-create-login-links) |
  | [`setDownstreamAddress()`](/modules/domains/set-downstream-address) | [Set downstream address](https://docs.mailchannels.net/inbound-api/API-reference/set-downstream-address) |
  | [`listDownstreamAddresses()`](/modules/domains/list-downstream-addresses) | [Fetch downstream addresses](https://docs.mailchannels.net/inbound-api/API-reference/fetch-downstream-addresses) |
  | [`updateApiKey()`](/modules/domains/update-api-key) | [Update API key](https://docs.mailchannels.net/inbound-api/API-reference/update-api-key) |

### 📋 Lists

  | SDK Method | API Reference |
  | --- | --- |
  | [`addListEntry()`](/modules/lists/add-list-entry) | [Add item to customer list](https://docs.mailchannels.net/inbound-api/API-reference/add-item-to-customer-list) |
  | [`deleteListEntry()`](/modules/lists/delete-list-entry) | [Delete item from customer list](https://docs.mailchannels.net/inbound-api/API-reference/delete-item-from-customer-list) |
  | [`listEntries()`](/modules/lists/list-entries) | [Get customer list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-customer-list-entries) |

### 📥 Users

  | SDK Method | API Reference |
  | --- | --- |
  | [`create()`](/modules/users/create) | [Create a recipient](https://docs.mailchannels.net/inbound-api/API-reference/create-a-recipient) |
  | [`addListEntry()`](/modules/users/add-list-entry) | [Add item to recipient list](https://docs.mailchannels.net/inbound-api/API-reference/add-item-to-recipient-list) |
  | [`listEntries()`](/modules/users/list-entries) | [Get recipient list entries](https://docs.mailchannels.net/inbound-api/API-reference/get-recipient-list-entries) |
  | [`deleteListEntry()`](/modules/users/delete-list-entry) | [Delete item from recipient list](https://docs.mailchannels.net/inbound-api/API-reference/delete-item-from-recipient-list) |

### ⚙️ Service

  | SDK Method | API Reference |
  | --- | --- |
  | [`status()`](/modules/service/status) | [Retrieve the condition of the service](https://docs.mailchannels.net/inbound-api/API-reference/retrieve-the-condition-of-the-service) |
  | [`report()`](/modules/service/report) | [Submit a false negative or false positive report](https://docs.mailchannels.net/inbound-api/API-reference/submit-a-false-negative-or-false-positive-report) |
  | [`subscriptions()`](/modules/service/subscriptions) | [Get a list of your subscriptions to MailChannels Inbound](https://docs.mailchannels.net/inbound-api/API-reference/get-a-list-of-your-subscriptions-to-mail-channels-inbound) |
