# List <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Fetch a list of all domains associated with this API key.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.list()
```
:::

## Params

- `options` `DomainsListOptions` <Badge type="info">optional</Badge>: List domains options.
  - `domains` `string[]` <Badge type="info">optional</Badge>: A list of domains to fetch. If this parameter is present, only domains whose name matches an item in this list are returned.
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of domains included in the response. Possible values are 1 to 5000.
  - `offset` `number` <Badge type="info">optional</Badge>: Offset into the list of domains to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `domains` `DomainsData[]` <Badge>guaranteed</Badge>: A list of domain data.
    - `domain` `string` <Badge>guaranteed</Badge>: The domain name.
    - `settings` `object` <Badge type="info">optional</Badge>: The abuse policy settings for the domain. These settings determine how spam messages are handled.
      - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info">optional</Badge>: The abuse policy.
      - `abusePolicyOverride` `boolean` <Badge type="info">optional</Badge>: If `true`, this abuse policy overrides the recipient abuse policy.
      - `spamHeaderName` `string` <Badge type="info">optional</Badge>: The header name to use if the abuse policy is set to `flag`.
      - `spamHeaderValue` `string` <Badge type="info">optional</Badge>: The header value to use if the abuse policy is set to `flag`.
    - `admins` `string[] | null` <Badge type="warning">nullable</Badge>: A list of email addresses that are the domain admins for the domain.
    - `downstreamAddresses` `object[] | null` <Badge type="warning">nullable</Badge>: The locations of mail servers to which messages will be delivered after filtering.
      - `priority` `number` <Badge>guaranteed</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
      - `weight` `number` <Badge>guaranteed</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
      - `port` `number` <Badge>guaranteed</Badge>: TCP port on which the downstream mail server is listening.
      - `target` `string` <Badge>guaranteed</Badge>: The canonical hostname of the host providing the service, ending in a dot.
    - `aliases` `string[] | null` <Badge type="warning">nullable</Badge>: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    - `subscriptionHandle` `string` <Badge>guaranteed</Badge>: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
  - `total` `number` <Badge>guaranteed</Badge>: The total number of domains that are accessible with the given API key that match the list of domains in the 'domains' parameter. If there is no 'domains' parameter, this field is the total number of domains that are accessible with with this API key. A domain is accessible with a given API key if it is associated with that API key, or if it is not associated with any API key.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-list.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**List type declarations**

<<< @/snippets/domains-list-options.ts
<<< @/snippets/domains-list-response.ts
