# List Downstream Addresses <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Retrieve stored downstream addresses for the domain.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.listDownstreamAddresses('example.com')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.listDownstreamAddresses('example.com')
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to get downstream addresses records for.
- `options` `DomainsListDownstreamAddressesOptions` <Badge type="info">optional</Badge>: List domains options.
  - `limit` `number` <Badge type="info">optional</Badge>: The number of records to return.
  - `offset` `number` <Badge type="info">optional</Badge>: The offset into the records to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

## Response

- `data` `DomainsDownstreamAddress[] | null` <Badge type="warning">nullable</Badge>
  - `port` `number` <Badge>guaranteed</Badge>: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge>guaranteed</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge>guaranteed</Badge>: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge>guaranteed</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-list-downstream-addresses.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Downstream Addresses type declarations**

<<< @/snippets/domains-downstream-address.ts
<<< @/snippets/domains-list-downstream-addresses-options.ts
<<< @/snippets/domains-list-downstream-addresses-response.ts
