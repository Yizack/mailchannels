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

- `options`: Provision options.
  - `subscriptionHandle`: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
  - `domain`: The domain name.
  - `settings`: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy`: The abuse policy.
    - `abusePolicyOverride`: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName`: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue`: The header value to use if the abuse policy is set to `flag`.
  - `admins`: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses`: The locations of mail servers to which messages will be delivered after filtering.
  - `aliases`: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    > [!NOTE]
    > Aliases are limited to 255 characters.
  - `associateKey`: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite`: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.

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

- `options`: Provision options.
  - `subscriptionHandle`: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
  - `associateKey`: If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
  - `overwrite`: If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.
- `domains`: A list of domains to provision. Each domain is an object with the following properties:
  - `domain`: The domain name.
  - `settings`: The abuse policy settings for the domain. These settings determine how spam messages are handled.
    - `abusePolicy`: The abuse policy.
    - `abusePolicyOverride`: If `true`, this abuse policy overrides the recipient abuse policy.
    - `spamHeaderName`: The header name to use if the abuse policy is set to `flag`.
    - `spamHeaderValue`: The header value to use if the abuse policy is set to `flag`.
  - `admins`: A list of email addresses that are the domain admins for the domain.
  - `downstreamAddresses`: The locations of mail servers to which messages will be delivered after filtering.
  - `aliases`: A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain.
    > [!NOTE]
    > Aliases are limited to 255 characters.

## List <Badge type="info" text="method" />

Retrieves all sub-accounts associated with the parent account.

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

- `options`: List domains options.
  - `domains`: A list of domains to fetch. If this parameter is present, only domains whose name matches an item in this list are returned.
  - `limit`: The maximum number of domains included in the response. Possible values are 1 to 5000.
  - `offset`: Offset into the list of domains to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

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

- `domain`: The domain name to be removed.

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

- `domain`: The domain name.
- `options`: Add list entry options.
  - `listName`: The list to add the item to. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
  - `item`: The item to add to the list. This can be a domain, email address, or IP address.

## List Entries <Badge type="info" text="method" />

Get domain list entries.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { entry } = await domains.listEntries('example.com', 'safelist')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.domains.listEntries('name@example.com', 'safelist')
```
:::

### Params

- `email`:  The domain name whose list will be fetched.
- `listName`: The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.

## Delete List Entry <Badge type="info" text="method" />

Delete item from domain list.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Domains } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { entry } = await domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { entry } = await mailchannels.domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

### Params

- `email`: The domain name whose list will be modified.
- `options`: Add list entry options.
  - `listName`: The name of the list to remove an entry from. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
  - `item`: The list entry which should be removed. This can be a domain, email address, or IP address.

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

- `domain`: The domain name.

## Set Downstream Address <Badge type="info" text="method" />

Sets the list of downstream addreses for the domain.

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

const { records } = await mailchannels.domains.setDownstreamAddress('example.com', [
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

- `domain`: The domain name to set downstream addresses for.
- `records`: The list of downstream addresses to set for the domain. Each downstream address is an object with the following properties:
  - `port`: TCP port on which the downstream mail server is listening.
  - `priority`: The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
  - `target`: The canonical hostname of the host providing the service, ending in a dot.
  - `weight`: Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
> [!IMPORTANT]
> If the `records` parameter is an empty array, all downstream address records will be deleted.

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

- `domain`: The domain name to get downstream addresses records for.
- `options`: List domains options.
  - `limit`: The number of records to return.
  - `offset`: The offset into the records to return.
  > [!TIP]
  > If no options are provided, the default limit is `10` and the offset is `0`.

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

- `domain`: The domain name.
- `key`: The new API key to associate with this domain.

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

- `domains`: A list of domain names to generate login links for. Maximum of `1000` domains per request.

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

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/domains.ts)
