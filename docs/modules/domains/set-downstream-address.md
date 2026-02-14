# Set Downstream Address <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Sets the list of downstream addresses for the domain.

> [!WARNING]
> This action deletes any existing downstream address for the domain before creating new ones.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success, error } = await domains.setDownstreamAddress('example.com', [
  {
    port: 25,
    priority: 10,
    target: 'example.com.',
    weight: 10
  }
])
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.domains.setDownstreamAddress('example.com', [
  {
    port: 25,
    priority: 10,
    target: 'example.com.',
    weight: 10
  }
])
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to set downstream addresses for.
- `records` `DomainsDownstreamAddress[]` <Badge type="danger">required</Badge>: The list of downstream addresses to set for the domain.
  - `port` `number` <Badge type="danger">required</Badge>: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge type="danger">required</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge type="danger">required</Badge>: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge type="danger">required</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
> [!IMPORTANT]
> If the `records` parameter is an empty array, all downstream address records will be deleted.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-set-downstream-address.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**Downstream Addresses type declarations**

<<< @/snippets/domains-downstream-address.ts
