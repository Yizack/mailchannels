# Create Login Link <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge>

Generate a link that allows a user to log in as a domain administrator.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { data, error } = await domains.createLoginLink("example.com")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.domains.createLoginLink("example.com")
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `link` `string` <Badge>guaranteed</Badge>: If a user browses to this URL, they will be automatically logged in as a domain admin.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-create-login-link.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Create Login Link type declarations**

<<< @/snippets/domains-create-login-link.ts
<<< @/snippets/domains-create-login-link-response.ts
