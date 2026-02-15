# Status <Badge type="info">method</Badge> <Badge><a href="/modules/service">⚙️ Service</a></Badge>

Retrieve the condition of the service.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { success, error } = await service.status()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.service.status()
```
:::

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/service-method-status.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
