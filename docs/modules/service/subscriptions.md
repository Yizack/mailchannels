# Subscriptions<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/service">⚙️ Service</a></Badge></llm-exclude>

Get a list of your subscriptions to MailChannels Inbound.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Service } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { data, error } = await service.subscriptions()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.service.subscriptions()
```
:::

## Response

- `data` `object[] | null` <Badge type="warning">nullable</Badge>
  - `active` `boolean` <Badge>guaranteed</Badge>
  - `activeAccountsCount` `number` <Badge>guaranteed</Badge>
  - `handle` `string` <Badge>guaranteed</Badge>
  - `limits` `object[]` <Badge>guaranteed</Badge>
    - `featureHandle` `string` <Badge>guaranteed</Badge>
    - `value` `string` <Badge>guaranteed</Badge>
  - `plan` `object` <Badge>guaranteed</Badge>
    - `handle` `string` <Badge>guaranteed</Badge>
    - `name` `string` <Badge>guaranteed</Badge>
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/service-method-subscriptions.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Subscriptions type declarations**

<<< @/snippets/service-subscriptions-response.ts
