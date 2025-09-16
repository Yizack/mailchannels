---
outline: deep
---

<script setup>
import { VPButton } from 'vitepress/theme-without-fonts'
</script>

# Modules

This is a list of modules available in the MailChannels SDK.

## Email API <Badge type="warning" text="version 0.11.0" />

Leverage the power, scale, and reputation of MailChannels to get your mission-critical emails delivered to the inbox reliably, using the same battle-tested infrastructure that today delivers email for more domains than anyone else.

### 📧 Emails

<!-- @include: modules/emails.md#description -->

<VPButton href="/modules/emails" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📢 Webhooks

<!-- @include: modules/webhooks.md#description -->

<VPButton href="/modules/webhooks" text="Read documentation" theme="alt" style="text-decoration:none" />

### 🪪 Sub-accounts

<!-- @include: modules/sub-accounts.md#description -->

<VPButton href="/modules/sub-accounts" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📊 Metrics

<!-- @include: modules/metrics.md#description -->

<VPButton href="/modules/metrics" text="Read documentation" theme="alt" style="text-decoration:none" />

### 🚫 Suppressions

<!-- @include: modules/suppressions.md#description -->

<VPButton href="/modules/suppressions" text="Read documentation" theme="alt" style="text-decoration:none" />

## Inbound API <Badge type="warning" text="version 1.1.0" />

A cloud-based spam filtering service that protects your users against spam, phishing, and malware.

This API is limited to 100 queries per second, per customer. Queries that exceed this rate may be rejected with the `503 Service Temporarily Unavailable` HTTP response.

### 🌐 Domains

<!-- @include: modules/domains.md#description -->

<VPButton href="/modules/domains" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📋 Lists

<!-- @include: modules/lists.md#description -->

<VPButton href="/modules/lists" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📥 Users

<!-- @include: modules/users.md#description -->

<VPButton href="/modules/users" text="Read documentation" theme="alt" style="text-decoration:none" />

### ⚙️ Service

<!-- @include: modules/service.md#description -->

<VPButton href="/modules/service" text="Read documentation" theme="alt" style="text-decoration:none" />
