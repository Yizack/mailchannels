---
outline: deep
---

# 🌐 Domains <Badge type="tip" text="module" /> <Badge type="tip" text="Inbound API" />

<!-- #region description -->
Manage your MailChannels Inbound domains.
<!-- #endregion description -->

## Provision <Badge type="info" text="method" />

Provision a single domain to use MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `options` `DomainsProvisionOptions & DomainsData` <Badge type="danger" text="required" />: The provision options and domain data.
  - `subscriptionHandle` `string` <Badge type="danger" text="required" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
  - `domain` `string` <Badge type="danger" text="required" />: The domain name.
  - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
    - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
  - `admins` `string[] | null` <Badge type="info" text="optional" />: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses` `object[] | null` <Badge type="info" text="optional" />: The locations of mail servers to which messages will be delivered after filtering.
    - `priority` `number` <Badge type="danger" text="required" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
    - `weight` `number` <Badge type="danger" text="required" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
    - `port` `number` <Badge type="danger" text="required" />: TCP port on which the downstream mail server is listening.
    - `target` `string` <Badge type="danger" text="required" />: The canonical hostname of the host providing the service, ending in a dot.
  - `aliases` `string[] | null` <Badge type="info" text="optional" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    > [!NOTE]
    > Aliases are limited to 255 characters.
  - `associateKey` `boolean` <Badge type="info" text="optional" />: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite` `boolean` <Badge type="info" text="optional" />: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.

### Response

- `data` `DomainsData | null` <Badge type="warning" text="nullable" />: The provisioned domain data.
  - `domain` `string` <Badge text="guaranteed" />: The domain name.
  - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
    - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
  - `admins` `string[] | null` <Badge type="warning" text="nullable" />: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses` `object[] | null` <Badge type="warning" text="nullable" />: The locations of mail servers to which messages will be delivered after filtering.
    - `priority` `number` <Badge text="guaranteed" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
    - `weight` `number` <Badge text="guaranteed" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
    - `port` `number` <Badge text="guaranteed" />: TCP port on which the downstream mail server is listening.
    - `target` `string` <Badge text="guaranteed" />: The canonical hostname of the host providing the service, ending in a dot.
  - `aliases` `string[] | null` <Badge type="warning" text="nullable" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
  - `subscriptionHandle` `string` <Badge text="guaranteed" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Bulk Provision <Badge type="info" text="method" />

Provision up to 1000 domains to use MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `options` `DomainsBulkProvisionOptions` <Badge type="danger" text="required" />: The options to provision the domains.
  - `subscriptionHandle` `string` <Badge type="danger" text="required" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
  - `associateKey` `boolean` <Badge type="info" text="optional" />: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite` `boolean` <Badge type="info" text="optional" />: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.
- `domains` `DomainsData[]` <Badge type="danger" text="required" />: A list of domain data to provision.
  - `domain` `string` <Badge type="danger" text="required" />: The domain name.
  - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
    - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
  - `admins` `string[] | null` <Badge type="info" text="optional" />: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses` `object[] | null` <Badge type="info" text="optional" />: The locations of mail servers to which messages will be delivered after filtering.
    - `priority` `number` <Badge type="danger" text="required" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
    - `weight` `number` <Badge type="danger" text="required" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
    - `port` `number` <Badge type="danger" text="required" />: TCP port on which the downstream mail server is listening.
    - `target` `string` <Badge type="danger" text="required" />: The canonical hostname of the host providing the service, ending in a dot.
  - `aliases` `string[] | null` <Badge type="info" text="optional" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    > [!NOTE]
    > Aliases are limited to 255 characters.

### Response

- `results` `object | null` <Badge type="warning" text="nullable" />: If the request was processed successfully, this does not necessarily mean all the domains in the request were successfully provisioned.
  - `successes` `object[]` <Badge text="guaranteed" />: Domains that were successfully provisioned or updated.
    - `code` `number` <Badge text="guaranteed" />
    - `comment` `string` <Badge type="info" text="optional" />
    - `domain` `DomainsData` <Badge text="guaranteed" />: The provisioned domain data.
      - `domain` `string` <Badge text="guaranteed" />: The domain name.
      - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
        - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
        - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
        - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
        - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
      - `admins` `string[] | null` <Badge type="warning" text="nullable" />: A list of email addresses that are the domain admins for the domain.
      - `downstreamAddresses` `object[] | null` <Badge type="warning" text="nullable" />: The locations of mail servers to which messages will be delivered after filtering.
        - `priority` `number` <Badge text="guaranteed" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
        - `weight` `number` <Badge text="guaranteed" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
        - `port` `number` <Badge text="guaranteed" />: TCP port on which the downstream mail server is listening.
        - `target` `string` <Badge text="guaranteed" />: The canonical hostname of the host providing the service, ending in a dot.
      - `aliases` `string[] | null` <Badge type="warning" text="nullable" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
      - `subscriptionHandle` `string` <Badge text="guaranteed" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
  - `errors` `object[]` <Badge text="guaranteed" />: Domains that were not successfully provisioned.
    - `code` `number` <Badge text="guaranteed" />
    - `comment` `string` <Badge type="info" text="optional" />
    - `domain` `DomainsData` <Badge text="guaranteed" />: The failed to provision domain data.
      - `domain` `string` <Badge text="guaranteed" />: The domain name.
      - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
        - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
        - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
        - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
        - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
      - `admins` `string[] | null` <Badge type="warning" text="nullable" />: A list of email addresses that are the domain admins for the domain.
      - `downstreamAddresses` `object[] | null` <Badge type="warning" text="nullable" />: The locations of mail servers to which messages will be delivered after filtering.
        - `priority` `number` <Badge text="guaranteed" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
        - `weight` `number` <Badge text="guaranteed" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
        - `port` `number` <Badge text="guaranteed" />: TCP port on which the downstream mail server is listening.
        - `target` `string` <Badge text="guaranteed" />: The canonical hostname of the host providing the service, ending in a dot.
      - `aliases` `string[] | null` <Badge type="warning" text="nullable" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
      - `subscriptionHandle` `string` <Badge text="guaranteed" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
- `error` `string | null` <Badge type="warning" text="nullable" />

## List <Badge type="info" text="method" />

Fetch a list of all domains associated with this API key.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `options` `DomainsListOptions` <Badge type="info" text="optional" />: List domains options.
  - `domains` `string[]` <Badge type="info" text="optional" />: A list of domains to fetch. If this parameter is present, only domains whose name matches an item in this list are returned.
  - `limit` `number` <Badge type="info" text="optional" />: The maximum number of domains included in the response. Possible values are 1 to 5000.
  - `offset` `number` <Badge type="info" text="optional" />: Offset into the list of domains to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

### Response

- `domains` `DomainsData[]` <Badge text="guaranteed" />: A list of domain data.
  - `domain` `string` <Badge text="guaranteed" />: The domain name.
  - `settings` `object` <Badge type="info" text="optional" />: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy` `"block" | "flag" | "quarantine"` <Badge type="info" text="optional" />: The abuse policy.
    - `abusePolicyOverride` `boolean` <Badge type="info" text="optional" />: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName` `string` <Badge type="info" text="optional" />: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue` `string` <Badge type="info" text="optional" />: The header value to use if the abuse policy is set to `flag`.
  - `admins` `string[] | null` <Badge type="warning" text="nullable" />: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses` `object[] | null` <Badge type="warning" text="nullable" />: The locations of mail servers to which messages will be delivered after filtering.
    - `priority` `number` <Badge text="guaranteed" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
    - `weight` `number` <Badge text="guaranteed" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
    - `port` `number` <Badge text="guaranteed" />: TCP port on which the downstream mail server is listening.
    - `target` `string` <Badge text="guaranteed" />: The canonical hostname of the host providing the service, ending in a dot.
  - `aliases` `string[] | null` <Badge type="warning" text="nullable" />: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
  - `subscriptionHandle` `string` <Badge text="guaranteed" />: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
- `total` `number` <Badge text="guaranteed" />: The total number of domains that are accessible with the given API key that match the list of domains in the 'domains' parameter. If there is no 'domains' parameter, this field is the total number of domains that are accessible with with this API key. A domain is accessible with a given API key if it is associated with that API key, or if it is not associated with any API key.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Delete <Badge type="info" text="method" />

De-provision a domain to cease protecting it with MailChannels Inbound.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name to be removed.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Add List Entry <Badge type="info" text="method" />

Add an entry to a domain blocklist or safelist.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name.
- `options` `ListEntryOptions` <Badge type="danger" text="required" />: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The list to add the item to.
  - `item` `string` <Badge type="danger" text="required" />: The item to add to the list. This can be a domain, email address, or IP address.

### Response

- `entry` `ListEntry | null` <Badge type="warning" text="nullable" />
  - `action` `"blocklist" | "safelist"` <Badge text="guaranteed" />
  - `item` `string` <Badge text="guaranteed" />
  - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## List Entries <Badge type="info" text="method" />

Get domain list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name whose list will be fetched.
- `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to fetch.

### Response

- `entries` `ListEntry[]` <Badge text="guaranteed" />
  - `action` `"blocklist" | "safelist"` <Badge text="guaranteed" />
  - `item` `string` <Badge text="guaranteed" />
  - `type` `"domain" | "email_address" | "ip_address"` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Delete List Entry <Badge type="info" text="method" />

Delete item from domain list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger" text="required" />: Add list entry options.
  - `listName` `"blocklist" | "safelist" | "blacklist" | "whitelist"` <Badge type="danger" text="required" />: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger" text="required" />: The list entry which should be removed. This can be a domain, email address, or IP address.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Create Login Link <Badge type="info" text="method" />

Generate a link that allows a user to log in as a domain administrator.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name.

### Response

- `link` `string | null` <Badge type="warning" text="nullable" />: If a user browses to this URL, they will be automatically logged in as a domain admin.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Set Downstream Address <Badge type="info" text="method" />

Sets the list of downstream addresses for the domain.

> [!WARNING]
> This action deletes any existing downstream address for the domain before creating new ones.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name to set downstream addresses for.
- `records` `DomainsDownstreamAddress[]` <Badge type="danger" text="required" />: The list of downstream addresses to set for the domain.
  - `port` `number` <Badge type="danger" text="required" />: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge type="danger" text="required" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge type="danger" text="required" />: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge type="danger" text="required" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
> [!IMPORTANT]
> If the `records` parameter is an empty array, all downstream address records will be deleted.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## List Downstream Addresses <Badge type="info" text="method" />

Retrieve stored downstream addresses for the domain.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name to get downstream addresses records for.
- `options` `DomainsListDownstreamAddressesOptions` <Badge type="info" text="optional" />: List domains options.
  - `limit` `number` <Badge type="info" text="optional" />: The number of records to return.
  - `offset` `number` <Badge type="info" text="optional" />: The offset into the records to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

### Response

- `records` `DomainsDownstreamAddress[]` <Badge text="guaranteed" />
  - `port` `number` <Badge text="guaranteed" />: TCP port on which the downstream mail server is listening.
  - `priority` `number` <Badge text="guaranteed" />: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target` `string` <Badge text="guaranteed" />: The canonical hostname of the host providing the service, ending in a dot.
  - `weight` `number` <Badge text="guaranteed" />: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Update API Key <Badge type="info" text="method" />

Update the API key that is associated with a domain.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domain` `string` <Badge type="danger" text="required" />: The domain name.
- `key` `string` <Badge type="danger" text="required" />: The new API key to associate with this domain.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Bulk Create Login Links <Badge type="info" text="method" />

Generate a batch of links that allow a user to log in as a domain administrator to their different domains.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

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

- `domains` `string[]` <Badge type="danger" text="required" />: A list of domain names to generate login links for. Maximum of `1000` domains per request.

### Response

- `results` `DomainsBulkCreateLoginLinks | null` <Badge type="warning" text="nullable" />
  - `successes` `DomainsBulkCreateLoginLinkResult[]` <Badge text="guaranteed" />
    - `domain` `string` <Badge text="guaranteed" />: The domain the request was for.
    - `code` `200` <Badge text="guaranteed" />
    - `comment` `string` <Badge type="info" text="optional" />
    - `loginLink` `string` <Badge text="guaranteed" />: If a user browses to this URL, they will be automatically logged in as a domain admin.
  - `errors` `DomainsBulkCreateLoginLinkResult[]` <Badge text="guaranteed" />
    - `domain` `string` <Badge text="guaranteed" />: The domain the request was for.
    - `code` `400 | 401 | 403 | 404 | 500` <Badge text="guaranteed" />
    - `comment` `string` <Badge type="info" text="optional" />
- `error` `string | null` <Badge type="warning" text="nullable" />

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
