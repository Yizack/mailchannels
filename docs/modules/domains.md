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
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data } = await domains.provision({
  domain: 'example.com',
  subscriptionHandle: 'your-subscription-handle'
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { data } = await mailchannels.domains.provision({
  domain: 'example.com',
  subscriptionHandle: 'your-subscription-handle'
})
```
:::

### Params

- `options`: Provision options.
  - `domain`: The domain name.
  - `subscriptionHandle`: The subscription `handle` that identifies the subscription that this domain should be provisioned against.
    > [!TIP]
    > Subscription handles can be retrieved from the [`subscriptions`](/modules/service#subscriptions) service method.
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
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { domains: domainsList } = await domains.list()
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
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
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.delete('example.com')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
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
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { entry } = await domains.addListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
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

## Create Login Link <Badge type="info" text="method" />

Generate a link that allows a user to log in as a domain administrator.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { link } = await domains.createLoginLink("example.com")
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { link } = await mailchannels.domains.createLoginLink("example.com")
```
:::

### Params

- `domain`: The domain name.

## Update API Key <Badge type="info" text="method" />

Update the API key that is associated with a domain.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from '@yizack/mailchannels'
import { Domains } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success } = await domains.updateApiKey('example.com', 'your-api-key')
```

```ts [full.ts]
import { MailChannels } from '@yizack/mailchannels'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.domains.updateApiKey('example.com', 'your-api-key')
```
:::

### Params

- `domain`: The domain name.
- `key`: The new API key to associate with this domain.

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

  **List type declarations**

  <<< @/snippets/domains-list-options.ts
  <<< @/snippets/domains-list-response.ts

  **List Entry type declarations**

  <<< @/snippets/list-names.ts
  <<< @/snippets/list-entry-options.ts
  <<< @/snippets/list-entry-response.ts

  **Create Login Link type declarations**

  <<< @/snippets/domains-create-login-link-response.ts
</details>

## Source

[Source](https://github.com/Yizack/mailchannels/tree/main/src/modules/domains.ts)
