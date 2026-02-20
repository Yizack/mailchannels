# Check Domain<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge></llm-exclude>

*DKIM, SPF & Domain Lockdown Check*

Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This method checks whether the domain is properly configured for secure email delivery.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
})
```
:::

## Params

- `options` `EmailsCheckDomainOptions` <Badge type="danger">required</Badge>: Check domain options.
  - `dkim` `EmailsCheckDomainDkim[] | EmailsCheckDomainDkim` <Badge type="info">optional</Badge>: The DKIM settings for the domain.
    - `domain` `string` <Badge type="info">optional</Badge>: The DKIM domain to sign the email with.
    - `privateKey` `string` <Badge type="info">optional</Badge>: The DKIM private key to sign the email with. Encoded in Base64.
    - `selector` `string` <Badge type="info">optional</Badge>: The DKIM selector to use.
    > [!TIP]
    > The absence or presence of these fields affects how DKIM settings are validated:
    > 1. If `domain`, `selector`, and `privateKey` are all present, verify using the provided domain, selector, and key.
    > 2. If `domain` and `selector` are present, use the stored private key for the given domain and selector.
    > 3. If only `domain` is present, use all stored keys for the given domain.
    > 4. If none are present, use all stored keys for the `domain` provided in the domain field of the request.
    > 5. If `privateKey` is present, `selector` must be present.
    > 6. If `selector` is present and `domain` is not, the domain will be taken from the domain field of the request.
  - `domain` `string` <Badge type="danger">required</Badge>: Domain used for sending emails. If `dkim` settings are not provided, or `dkim` settings are provided with no `domain`, the stored dkim settings for this domain will be used.
  - `senderId` `string` <Badge type="info">optional</Badge>: Used exclusively for [Domain Lockdown](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown) verification. If you're not using senderid to associate your domain with your account, you can disregard this field.
    > [!INFO]
    > Your `senderId` is the `X-MailChannels-Sender-Id` header value in emails sent via MailChannels.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>: The results of the domain checks.
  - `dkim` `object[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>
    - `keyStatus` `"active" | "revoked" | "retired" | "provided" | "rotated"` <Badge>guaranteed</Badge>: The human readable status of the DKIM key used for verification.
    - `selector` `string` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of DKIM check.
    - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `domainLockdown` `object` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of Domain Lockdown check.
    - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `senderDomain` `object` <Badge>guaranteed</Badge>: These results are here to help avoid [SDNF](https://support.mailchannels.com/hc/en-us/articles/203155500-550-5-2-1-SDNF-Sender-Domain-Not-Found) (Sender Domain Not Found) blocks. For messages not to get blocked by SDNF, we require either an MX or A record to exist for the sender domain.
    - `a` `object` <Badge>guaranteed</Badge>
      - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of A record check.
      - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
    - `mx` `object` <Badge>guaranteed</Badge>
      - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of MX record check.
      - `verdict` `"passed" | "failed"` <Badge>guaranteed</Badge>
  - `spf` `object` <Badge>guaranteed</Badge>
    - `reason` `string` <Badge type="info">optional</Badge>: A human-readable explanation of SPF check.
    - `verdict` `"passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown"` <Badge>guaranteed</Badge>
  - `references` `string[]` <Badge type="info">optional</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/emails-method-check-domain.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**DKIM key type declarations**

<<< @/snippets/emails-dkim-key-status.ts
<<< @/snippets/emails-dkim-key.ts

**Check Domain type declarations**

<<< @/snippets/emails-check-domain-dkim.ts
<<< @/snippets/emails-check-domain-options.ts
<<< @/snippets/emails-check-domain-verdict.ts
<<< @/snippets/emails-check-domain-response.ts
