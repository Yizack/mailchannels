---
title: Update DKIM Key
titleTemplate: 📧 Emails
---

# Update DKIM Key<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/emails">📧 Emails</a></Badge></llm-exclude>

Update fields of an existing DKIM key pair for the specified domain and selector, for the current customer. Currently, only the `status` field can be updated.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { success, error } = await emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.emails.updateDkimKey('example.com', {
  selector: 'mailchannels',
  status: 'retired'
})
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain of the DKIM key to update.
- `options` `EmailsUpdateDkimKeyOptions` <Badge type="danger">required</Badge>: Update DKIM key options.
  - `selector` `string` <Badge type="danger">required</Badge>: Selector of the DKIM key to update. Must be a maximum of 63 characters.
  - `status` `"revoked" | "retired" | "rotated"` <Badge type="danger">required</Badge>: New status of the DKIM key pair.
    > [!TIP]
    > Possible values: `revoked`, `retired`, `rotated`.
    > - `revoked`: Indicates that the key is compromised and should not be used.
    > - `retired`: Indicates that the key has been rotated and is no longer in use.
    > - `rotated`: Indicates that the key is going through the rotation process. Only active key pairs can be updated to this status, and no new key pair is created. The rotated key can be used to sign emails for 3 days after the status update, and will automatically change to `retired` 2 weeks after update. For a smooth key transition, it is recommended to create and publish a new key pair before signing is disabled for the rotated key.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/emails-method-update-dkim-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Emails DKIM key type declarations**

<<< @/snippets/emails-dkim-key-status.ts

**Emails Update DKIM key type declarations**

<<< @/snippets/emails-update-dkim-key-options.ts
