# Rotate DKIM Key<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge></llm-exclude>

Rotate an active DKIM key pair. Mark the original key as `rotated`, and create a new key pair with the required new key selector, reusing the same algorithm and key length. The rotated key remains valid for signing for a 3-day grace period, and is automatically changed to `retired` 2 weeks after rotation. Publish the new key to its DNS TXT record before rotated key expires for signing as emails sent with an unpublished key will fail DKIM validation by receiving providers. After the grace period, only the new key is valid for signing if published.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.rotateDkimKey('example.com', 'mailchannels', {
  newKey: {
    selector: 'new-selector'
  }
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.rotateDkimKey('example.com', 'mailchannels', {
  newKey: {
    selector: 'new-selector'
  }
})
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain the DKIM key belongs to.
- `selector` `string` <Badge type="danger">required</Badge>: The selector of the DKIM key to rotate. Must be a maximum of 63 characters.
- `options` `object` <Badge type="danger">required</Badge>: The options to rotate the DKIM key.
  - `newKey` `object` <Badge type="danger">required</Badge>: New DKIM key options.
    - `selector` `string` <Badge type="danger">required</Badge>: The selector for the new key pair. Must be a maximum of 63 characters.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>: The rotated and new DKIM key information.
  - `new` `EmailsDkimKey` <Badge>guaranteed</Badge>
    - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
    - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
    - `dnsRecords` `object[]` <Badge>guaranteed</Badge>: Suggested DNS records for the DKIM key.
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
  - `rotated` `EmailsDkimKey` <Badge>guaranteed</Badge>
    - `algorithm` `string` <Badge>guaranteed</Badge>: Algorithm used for the key pair.
    - `createdAt` `string` <Badge type="info">optional</Badge>: Timestamp when the key pair was created.
    - `dnsRecords` `object[]` <Badge>guaranteed</Badge>: Suggested DNS records for the DKIM key.
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

<<< @/snippets/emails-method-rotate-dkim-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**DKIM key type declarations**

<<< @/snippets/emails-dkim-key.ts

**Rotate DKIM Key type declarations**

<<< @/snippets/emails-rotate-dkim-key-options.ts
<<< @/snippets/emails-rotate-dkim-key-response.ts
