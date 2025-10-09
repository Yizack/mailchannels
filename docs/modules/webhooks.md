---
outline: deep
---

# 📢 Webhooks <Badge type="tip" text="module" /> <Badge type="tip" text="Email API" />

<!-- #region description -->
Receive notifications of your email events via webhooks.
<!-- #endregion description -->

## Enroll <Badge type="info" text="method" />

Enrolls the user to receive event notifications via webhooks.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success } = await webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```
:::

### Params

- `endpoint` `string` <Badge type="danger" text="required" />: The URL to receive event notifications. Must be no longer than `8000` characters.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## List <Badge type="info" text="method" />

Lists all the webhook endpoints that are enrolled to receive event notifications.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { webhooks: webhooksList } = await webhooks.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { webhooks } = await mailchannels.webhooks.list()
```
:::

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `webhooks` `string[]` <Badge text="guaranteed" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Delete <Badge type="info" text="method" />

Deletes all registered webhook endpoints for the user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success } = await webhooks.delete()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { success } = await mailchannels.webhooks.delete()
```
:::

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Signing Key <Badge type="info" text="method" />

Retrieves the public key used to verify signatures on incoming webhook payloads.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { key } = await webhooks.getSigningKey('key-id')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { key } = await mailchannels.webhooks.getSigningKey('key-id')
```
:::

### Params

- `keyId` `string` <Badge type="danger" text="required" />: The ID name of the signing key.
  > [!TIP]
  > The `keyId` can be found in the `signature-input` request header of the webhook notification.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `key` `string | null` <Badge type="warning" text="nullable" />
- `error` `string | null` <Badge type="warning" text="nullable" />

## Validate <Badge type="info" text="method" />

Validates whether your enrolled webhook(s) respond with an HTTP `2xx` status code. Sends a test request to each webhook containing your customer handle, a hardcoded event type (`test`), a hardcoded sender email (`test@mailchannels.com`), a timestamp, a request ID (provided or generated), and an SMTP ID. The response includes the HTTP status code and body returned by each webhook.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient } from 'mailchannels-sdk'
import { Webhooks } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { allPassed, results } = await webhooks.validate('optional-request-id')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'
const mailchannels = new MailChannels('your-api-key')

const { allPassed, results } = await mailchannels.webhooks.validate('optional-request-id')
```
:::

### Params

- `requestId` `string` <Badge type="info" text="optional" />: Optional identifier in the webhook payload. If not provided, a value will be automatically generated.
  > [!NOTE]
  > The request id must not exceed 28 characters.

### Response

- `success` `boolean` <Badge text="guaranteed" />: Whether the operation was successful.
- `allPassed` `boolean` <Badge text="guaranteed" />: Indicates whether all webhook validations passed
- `results` `object[]` <Badge text="guaranteed" />: Detailed results for each tested webhook, including whether it returned a 2xx status code, along with its response status code and body.
  - `result` `"passed" | "failed"` <Badge text="guaranteed" />: Indicates whether the webhook responded with a 2xx HTTP status code.
  - `webhook` `string` <Badge text="guaranteed" />: The webhook that was validated.
  - `response` `object` <Badge text="guaranteed" />: The HTTP response returned by the webhook, including status code and response body. A null value indicates no response was received. Possible reasons include timeouts, connection failures, or other network-related issues.
    - `body` `string` <Badge type="info" text="optional" />: Response body from webhook. Returns an error if unprocessable or too large.
    - `status` `number` <Badge text="guaranteed" />: HTTP status code returned by the webhook.
- `error` `string | null` <Badge type="warning" text="nullable" />

## Type declarations

<<< @/snippets/webhooks.ts

<details>
  <summary>All type declarations</summary>

  **Success Response**

  <<< @/snippets/success-response.ts

  **List type declarations**

  <<< @/snippets/webhooks-list-response.ts

  **Signing Key type declarations**

  <<< @/snippets/webhooks-signing-key-response.ts

  **Validate type declarations**

  <<< @/snippets/webhooks-validate-response.ts
</details>
