# Delete List Entry <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Delete item from domain list.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success, error } = await domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.domains.deleteListEntry('example.com', {
  listName: 'safelist',
  item: 'name@domain.com'
})
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name whose list will be modified.
- `options` `ListEntryOptions` <Badge type="danger">required</Badge>: Add list entry options.
  - `listName` `ListNames` <Badge type="danger">required</Badge>: The name of the list to remove an entry from.
  - `item` `string` <Badge type="danger">required</Badge>: The list entry which should be removed. This can be a domain, email address, or IP address.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-delete-list-entry.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts

**List Entry type declarations**

<<< @/snippets/list-names.ts
<<< @/snippets/list-entry-options.ts
