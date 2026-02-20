# Create DKIM Key<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge></llm-exclude>

Create a DKIM key pair for a specified domain and selector using the specified algorithm and key length, for the current customer.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.createDkimKey('example.com', {
  selector: 'mailchannels'
})
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain to create the DKIM key for.
- `options` `EmailsCreateDkimKeyOptions` <Badge type="danger">required</Badge>: Create DKIM key options.
  - `algorithm` `"rsa"` <Badge type="info">optional</Badge>: Algorithm used for the new key pair Currently, only RSA is supported. Defaults to `rsa`.
  - `length` `1024 | 2048 | 3072 | 4096` <Badge type="info">optional</Badge>: Key length in bits. For RSA, must be a multiple of `1024`.
    > [!TIP]
    > Defaults to `2048`.
    > Common values: `1024` or `2048`.
  - `selector` `string` <Badge type="danger">required</Badge>: Selector for the new key pair. Must be a maximum of 63 characters.

## Response

- `data` `EmailsDkimKey | null` <Badge type="warning">nullable</Badge>: The created DKIM key information.
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

<<< @/snippets/emails-method-create-dkim-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Create DKIM Key type declarations**

<<< @/snippets/emails-create-dkim-key-options.ts
<<< @/snippets/emails-dkim-key-status.ts
<<< @/snippets/emails-dkim-key.ts
<<< @/snippets/emails-create-dkim-key-response.ts
