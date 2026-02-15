# Bulk Provision <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Provision up to 1000 domains to use MailChannels Inbound.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.bulkProvision({
  subscriptionHandle: 'your-subscription-handle'
}, [
  { domain: 'example.com' },
  { domain: 'example2.com' }
])
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.bulkProvision({
  subscriptionHandle: 'your-subscription-handle'
}, [
  { domain: 'example.com' },
  { domain: 'example2.com' }
])
```
:::

## Params

- `options` `DomainsBulkProvisionOptions` <Badge type="danger">required</Badge>: The options to provision the domains.
  - `subscriptionHandle` `string` <Badge type="danger">required</Badge>: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service/subscriptions) service method.
  - `associateKey` `boolean` <Badge type="info">optional</Badge>: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite` `boolean` <Badge type="info">optional</Badge>: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.
- `domains` `DomainsData[]` <Badge type="danger">required</Badge>: A list of domain data to provision.
  - `domain` `string` <Badge type="danger">required</Badge>: The domain name.
  - `settings` `object` <Badge type="info">optional</Badge>: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info">optional</Badge>: The abuse policy.
    - `abusePolicyOverride` `boolean` <Badge type="info">optional</Badge>: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName` `string` <Badge type="info">optional</Badge>: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue` `string` <Badge type="info">optional</Badge>: The header value to use if the abuse policy is set to `flag`.
  - `admins` `string[] | null` <Badge type="info">optional</Badge>: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses` `object[] | null` <Badge type="info">optional</Badge>: The locations of mail servers to which messages will be delivered after filtering.
    - `priority` `number` <Badge type="danger">required</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
    - `weight` `number` <Badge type="danger">required</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
    - `port` `number` <Badge type="danger">required</Badge>: TCP port on which the downstream mail server is listening.
    - `target` `string` <Badge type="danger">required</Badge>: The canonical hostname of the host providing the service, ending in a dot.
  - `aliases` `string[] | null` <Badge type="info">optional</Badge>: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    > [!NOTE]
    > Aliases are limited to 255 characters.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>: If the request was processed successfully, this does not necessarily mean all the domains in the request were successfully provisioned.
  - `successes` `object[]` <Badge>guaranteed</Badge>: Domains that were successfully provisioned or updated.
    - `code` `number` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
    - `domain` `DomainsData` <Badge>guaranteed</Badge>: The provisioned domain data.
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
  - `errors` `object[]` <Badge>guaranteed</Badge>: Domains that were not successfully provisioned.
    - `code` `number` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
    - `domain` `DomainsData` <Badge>guaranteed</Badge>: The failed to provision domain data.
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
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-bulk-provision.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Bulk Provision type declarations**

<<< @/snippets/domains-bulk-provision-options.ts
<<< @/snippets/domains-bulk-provision-response.ts
