# Delete <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

De-provision a domain to cease protecting it with MailChannels Inbound.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success, error } = await domains.delete('example.com')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.domains.delete('example.com')
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to be removed.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-delete.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
