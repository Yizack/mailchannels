---
outline: deep
---

# ⚙️ Service <Badge type="tip" text="module" /> <Badge type="tip" text="Inbound API" />

<!-- #region description -->
Get information about the service.
<!-- #endregion description -->

## Status <Badge type="info" text="method" />

Retrieve the condition of the service.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Service } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { success } = await service.status()
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.service.status()
```
:::

## Subscriptions <Badge type="info" text="method" />

Get a list of your subscriptions to MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Service } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const service = new Service(mailchannels)

const { subscriptions } = await service.subscriptions()
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { subscriptions } = await mailchannels.service.subscriptions()
```
:::

## Type declarations

<<< @/snippets/service.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **Subscriptions type declarations**

  <<< @/snippets/service-subscriptions-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/service.ts)
