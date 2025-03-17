---
outline: deep
---

# Check Domain

*DKIM, SPF & Domain Lockdown Check*

Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This method checks whether the domain is properly configured for secure email delivery.

## Check domain method

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { CheckDomain } from '@yizack/mailchannels/emails'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new CheckDomain(mailchannels)

const { results } = await emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
});
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.emails.checkDomain({
  domain: 'example.com',
  dkim: {
    domain: 'example.com',
    selector: 'your-dkim-selector',
    privateKey: 'your-dkim-private-key'
  },
  senderId: 'your-sender-id'
});
```
:::

### Params

- `options`: Check domain options.
  - `dkim`: The DKIM settings for the domain.
    - `domain`: The DKIM domain to sign the email with.
    - `privateKey`: The DKIM private key to sign the email with. Encoded in Base64.
    - `selector`: The DKIM selector to use.
  - `domain`: Domain used for sending emails.
  - `senderId`: The sender ID to check the domain with.
    > [!INFO]
    > Your `senderId` is the `X-MailChannels-Sender-Id` header value in emails sent via MailChannels.

## Type declarations

<<< @/snippets/check-domain.ts

<details>
  <summary>All type declarations</summary>

  <<< @/snippets/check-domain-options.ts
  <<< @/snippets/check-domain-response.ts
  <<< @/snippets/check-domain-verdict.ts
  <<< @/snippets/check-domain-dkim.ts
  <<< @/snippets/check-domain-payload.ts

  > [!INFO]
  > `CheckDomainPayload` is the body sent to the MailChannels API. Reference: [DKIM, SPF & Domain Lockdown Check](https://docs.mailchannels.net/email-api/api-reference/dkim-spf-domain-lockdown-check)
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/emails/check-domain.ts)
