# Update API Key<llm-exclude> <Badge type="info">method</Badge> <Badge><a href="/modules/domains">🌐 Domains</a></Badge></llm-exclude>

Update the API key that is associated with a domain.

## Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Domains } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const domains = new Domains(mailchannels)

const { success, error } = await domains.updateApiKey('example.com', 'your-api-key')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.domains.updateApiKey('example.com', 'your-api-key')
```
:::

## Params

- `domain` `string` <Badge type="danger">required</Badge>: The domain name.
- `key` `string` <Badge type="danger">required</Badge>: The new API key to associate with this domain.

## Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/domains-method-update-api-key.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/success-response.ts
