---
outline: deep
---

<script setup>
import { VPButton } from 'vitepress/theme-without-fonts'
</script>

# Modules

This is a list of modules available in the MailChannels SDK.

## Email API <Badge type="warning">version 0.18.0</Badge>

Leverage the power, scale, and reputation of MailChannels to get your mission-critical emails delivered to the inbox reliably, using the same battle-tested infrastructure that today delivers email for more domains than anyone else.

### 📧 Emails

<!-- @include: modules/emails/index.md#description -->

<VPButton href="/modules/emails" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📢 Webhooks

<!-- @include: modules/webhooks/index.md#description -->

<VPButton href="/modules/webhooks" text="Read documentation" theme="alt" style="text-decoration:none" />

### 🪪 Sub-accounts

<!-- @include: modules/sub-accounts/index.md#description -->

<VPButton href="/modules/sub-accounts" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📊 Metrics

<!-- @include: modules/metrics/index.md#description -->

<VPButton href="/modules/metrics" text="Read documentation" theme="alt" style="text-decoration:none" />

### 🚫 Suppressions

<!-- @include: modules/suppressions/index.md#description -->

<VPButton href="/modules/suppressions" text="Read documentation" theme="alt" style="text-decoration:none" />

## Inbound API <Badge type="warning">version 1.2.0</Badge>

A cloud-based spam filtering service that protects your users against spam, phishing, and malware.

This API is limited to 100 queries per second, per customer. Queries that exceed this rate may be rejected with the `503 Service Temporarily Unavailable` HTTP response.

### 🌐 Domains

<!-- @include: modules/domains/index.md#description -->

<VPButton href="/modules/domains" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📋 Lists

<!-- @include: modules/lists/index.md#description -->

<VPButton href="/modules/lists" text="Read documentation" theme="alt" style="text-decoration:none" />

### 📥 Users

<!-- @include: modules/users/index.md#description -->

<VPButton href="/modules/users" text="Read documentation" theme="alt" style="text-decoration:none" />

### ⚙️ Service

<!-- @include: modules/service/index.md#description -->

<VPButton href="/modules/service" text="Read documentation" theme="alt" style="text-decoration:none" />
