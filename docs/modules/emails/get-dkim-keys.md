---
title: Get DKIM Keys
titleTemplate: 📧 Emails
---

# Get DKIM Keys<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge></llm-exclude>

Search for DKIM keys by domain, with optional filters. If selector is provided, at most one key will be returned.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.getDkimKeys('example.com', {
  includeDnsRecord: true
})
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain to get the DKIM keys for.
- `options` `EmailsGetDkimKeysOptions` <Badge type="info">optional</Badge>: Optional filter options.
  - `selector` `string` <Badge type="info">optional</Badge>: Selector to filter keys by. Must be a maximum of 63 characters.
  - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge type="info">optional</Badge>: Status to filter keys by.
    > [!TIP]
    > Possible values: `active`, `revoked`, `retired`, `rotated`.
  - `offset` `number` <Badge type="info">optional</Badge>: Number of results to skip from the start. Must be a positive integer. Defaults to `0`.
  - `limit` `number` <Badge type="info">optional</Badge>: Maximum number of keys to return. Maximum is `100` and minimum is `1`. Defaults to `10`.
  - `includeDnsRecord` `boolean` <Badge type="info">optional</Badge>: If `true`, includes the suggested DKIM DNS record for each returned key. Defaults to `false`.

## Response

- `data` `Optional<EmailsDkimKey, "dnsRecords">[] | null` <Badge type="warning">nullable</Badge>: List of keys matching the filter. Empty if no keys match the filter.
  - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
  - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
  - `dnsRecords` `object[]` <Badge type="info">optional</Badge>: Suggested DNS records for the DKIM key. Only included if `includeDnsRecord` is `true`.
    - `name` `string` <Badge>guaranteed</Badge>
    - `type` `string` <Badge>guaranteed</Badge>
    - `value` `string` <Badge>guaranteed</Badge>
  - `domain` `string` <Badge>guaranteed</Badge>: Domain associated with the key pair.
  - `gracePeriodExpiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp after which you can no longer use the rotated key for signing.
  - `length` `1024 | 2048 | 3072 | 4096` <Badge>guaranteed</Badge>: Key length in bits.
  - `publicKey` `string` <Badge>guaranteed</Badge>
  - `retiresAt` `string` <Badge type="info">optional</Badge>: UTC timestamp when a rotated key pair is retired.
  - `selector` `string` <Badge>guaranteed</Badge>: Selector assigned to the key pair.
  - `status` `"active" | "revoked" | "retired" | "rotated"` <Badge>guaranteed</Badge>: Status of the key.
  - `statusModifiedAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key was last modified.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/emails-method-get-dkim-keys.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**DKIM key type declarations**

<<< @/snippets/emails-dkim-key-status.ts
<<< @/snippets/emails-dkim-key.ts

**Get DKIM Keys type declarations**

<<< @/snippets/emails-get-dkim-keys-options.ts
<<< @/snippets/optional.ts
<<< @/snippets/emails-get-dkim-keys-response.ts
