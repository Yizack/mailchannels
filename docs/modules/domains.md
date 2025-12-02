---
outline: deep
---

# 🌐 Domains <Badge>module</Badge> <Badge>Inbound API</Badge>

<!-- #region description -->
Manage your MailChannels Inbound domains.
<!-- #endregion description -->

## Provision <Badge type="info">method</Badge>

Provision a single domain to use MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data } = await domains.provision({
  domain: 'example.com',
  subscriptionHandle: 'your-subscription-handle'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data } = await mailchannels.domains.provision({
  domain: 'example.com',
  subscriptionHandle: 'your-subscription-handle'
})
```
:::

### Params

- `options` `DomainsProvisionOptions & DomainsData` <Badge type="danger">required</Badge>: The provision options and domain data.
  - `subscriptionHandle` `string` <Badge type="danger">required</Badge>: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
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
  - `associateKey` `boolean` <Badge type="info">optional</Badge>: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite` `boolean` <Badge type="info">optional</Badge>: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.

### Response

- `data` `DomainsData | null` <Badge type="warning">nullable</Badge>: The provisioned domain data.
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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Bulk Provision <Badge type="info">method</Badge>

Provision up to 1000 domains to use MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { results } = await domains.bulkProvision({
  subscriptionHandle: 'your-subscription-handle'
}, [
  { domain: 'example.com' },
  { domain: 'example2.com' }
])
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { results } = await mailchannels.domains.bulkProvision({
  subscriptionHandle: 'your-subscription-handle'
}, [
  { domain: 'example.com' },
  { domain: 'example2.com' }
])
```
:::

### Params

- `options` `DomainsBulkProvisionOptions` <Badge type="danger">required</Badge>: The options to provision the domains.
  - `subscriptionHandle` `string` <Badge type="danger">required</Badge>: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
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

### Response

- `results` `object | null` <Badge type="warning">nullable</Badge>: If the request was processed successfully, this does not necessarily mean all the domains in the request were successfully provisioned.
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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## List <Badge type="info">method</Badge>

Fetch a list of all domains associated with this API key.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { domains: domainsList } = await domains.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { domains } = await mailchannels.domains.list()
```
:::

### Params

- `options` `DomainsListOptions` <Badge type="info">optional</Badge>: List domains options.
  - `domains` `string[]` <Badge type="info">optional</Badge>: A list of domains to fetch. If this parameter is present, only domains whose name matches an item in this list are returned.
  - `limit` `number` <Badge type="info">optional</Badge>: The maximum number of domains included in the response. Possible values are 1 to 5000.
  - `offset` `number` <Badge type="info">optional</Badge>: Offset into the list of domains to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

### Response

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
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Delete <Badge type="info">method</Badge>

De-provision a domain to cease protecting it with MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.delete('example.com')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.domains.delete('example.com')
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to be removed.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Add List Entry <Badge type="info">method</Badge>

Add an entry to a domain blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { entry } = await domains.addListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.domains.addListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name.
- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The list to add the item to.
  - `item` `string` <Badge type="danger">required</Badge>: The item to add to the list. This can be a domain, email address, or IP address.

### Response

- `entry` `ListEntry | null` <Badge type="warning">nullable</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
- `error` `string | null` <Badge type="warning">nullable</Badge>

## List Entries <Badge type="info">method</Badge>

Get domain list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { entries } = await domains.listEntries('example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { entries } = await mailchannels.domains.listEntries('example.com', 'safelist')
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name whose list will be fetched.
- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to fetch.

### Response

- `entries` `ListEntry[]` <Badge>guaranteed</Badge>
  - `action` `"blocklist" | "safelist"` <Badge>guaranteed</Badge>
  - `item` `string` <Badge>guaranteed</Badge>
  - `type` `"domain" | "email_address" | "ip_address"` <Badge>guaranteed</Badge>
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Delete List Entry <Badge type="info">method</Badge>

Delete item from domain list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger">required</Badge>: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger">required</Badge>: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Create Login Link <Badge type="info">method</Badge>

Generate a link that allows a user to log in as a domain administrator.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { link } = await domains.createLoginLink("example.com")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { link } = await mailchannels.domains.createLoginLink("example.com")
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name.

### Response

- `link` `string | null` <Badge type="warning">nullable</Badge>: If a user browses to this URL, they will be automatically logged in as a domain admin.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Set Downstream Address <Badge type="info">method</Badge>

Sets the list of downstream addresses for the domain.

> [!WARNING]
> This action deletes any existing downstream address for the domain before creating new ones.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.setDownstreamAddress('example.com', [
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

const { success } = await mailchannels.domains.setDownstreamAddress('example.com', [
  {
    port: 25,
    priority: 10,
    target: 'example.com.',
    weight: 10
  }
])
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to set downstream addresses for.
- `records` `DomainsDownstreamAddress[]` <Badge type="danger">required</Badge>: The list of downstream addresses to set for the domain.
  - `port` `number` <Badge type="danger">required</Badge>: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge type="danger">required</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge type="danger">required</Badge>: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge type="danger">required</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
> [!IMPORTANT]
> If the `records` parameter is an empty array, all downstream address records will be deleted.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## List Downstream Addresses <Badge type="info">method</Badge>

Retrieve stored downstream addresses for the domain.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { records } = await domains.listDownstreamAddresses('example.com')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { records } = await mailchannels.domains.listDownstreamAddresses('example.com')
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name to get downstream addresses records for.
- `options` `DomainsListDownstreamAddressesOptions` <Badge type="info">optional</Badge>: List domains options.
  - `limit` `number` <Badge type="info">optional</Badge>: The number of records to return.
  - `offset` `number` <Badge type="info">optional</Badge>: The offset into the records to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

### Response

- `records` `DomainsDownstreamAddress[]` <Badge>guaranteed</Badge>
  - `port` `number` <Badge>guaranteed</Badge>: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge>guaranteed</Badge>: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge>guaranteed</Badge>: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge>guaranteed</Badge>: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Update API Key <Badge type="info">method</Badge>

Update the API key that is associated with a domain.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.updateApiKey('example.com', 'your-api-key')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.domains.updateApiKey('example.com', 'your-api-key')
```
:::

### Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name.
- `key` `string` <Badge type="danger">required</Badge>: The new API key to associate with this domain.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Bulk Create Login Links <Badge type="info">method</Badge>

Generate a batch of links that allow a user to log in as a domain administrator to their different domains.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { results } = await domains.bulkCreateLoginLinks([
  'example.com',
  'example2.com'
])
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { results } = await mailchannels.domains.bulkCreateLoginLinks([
  'example.com',
  'example2.com'
])
```
:::

### Params

- `domains` `string[]` <Badge type="danger">required</Badge>: A list of domain names to generate login links for. Maximum of `1000` domains per request.

### Response

- `results` `DomainsBulkCreateLoginLinks | null` <Badge type="warning">nullable</Badge>
  - `successes` `DomainsBulkCreateLoginLinkResult[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: The domain the request was for.
    - `code` `200` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
    - `loginLink` `string` <Badge>guaranteed</Badge>: If a user browses to this URL, they will be automatically logged in as a domain admin.
  - `errors` `DomainsBulkCreateLoginLinkResult[]` <Badge>guaranteed</Badge>
    - `domain` `string` <Badge>guaranteed</Badge>: The domain the request was for.
    - `code` `400 | 401 | 403 | 404 | 500` <Badge>guaranteed</Badge>
    - `comment` `string` <Badge type="info">optional</Badge>
- `error` `string | null` <Badge type="warning">nullable</Badge>

## Type declarations

<<< @/snippets/domains.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **Provision type declarations**

  <<< @/snippets/domains-data.ts
  <<< @/snippets/domains-provision-options.ts
  <<< @/snippets/domains-provision-response.ts

  **Bulk Provision type declarations**

  <<< @/snippets/domains-bulk-provision-options.ts
  <<< @/snippets/domains-bulk-provision-response.ts

  **List type declarations**

  <<< @/snippets/domains-list-options.ts
  <<< @/snippets/domains-list-response.ts

  **List Entry type declarations**

  <<< @/snippets/list-names.ts
  <<< @/snippets/list-entry-options.ts
  <<< @/snippets/list-entry.ts
  <<< @/snippets/list-entry-response.ts
  <<< @/snippets/list-entries-response.ts

  **Downstream Addresses type declarations**

  <<< @/snippets/domains-downstream-address.ts
  <<< @/snippets/domains-list-downstream-addresses-options.ts
  <<< @/snippets/domains-list-downstream-addresses-response.ts

  **Create Login Link type declarations**

  <<< @/snippets/domains-create-login-link-response.ts

  **Bulk Create Login Links type declarations**

  <<< @/snippets/domains-bulk-create-login-link-result.ts
  <<< @/snippets/domains-bulk-create-login-links.ts
  <<< @/snippets/domains-bulk-create-login-links-response.ts
</details>
