---
outline: deep
---

# 📢 Webhooks <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
Receive notifications of your email events via webhooks.
<!-- #endregion description -->

## Enroll <Badge type="info">method</Badge>

Enrolls the user to receive event notifications via webhooks.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success, error } = await webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.webhooks.enroll("https://example.com/api/webhooks/mailchannels")
```
:::

### Params

- `endpoint` `string` <Badge type="danger">required</Badge>: The URL to receive event notifications. Must be no longer than `8000` characters.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## List <Badge type="info">method</Badge>

Lists all the webhook endpoints that are enrolled to receive event notifications.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.list()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.list()
```
:::

### Response

- `data` `string[] | null` <Badge type="warning">nullable</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Delete <Badge type="info">method</Badge>

Deletes all registered webhook endpoints for the user.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { success, error } = await webhooks.delete()
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { success, error } = await mailchannels.webhooks.delete()
```
:::

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Signing Key <Badge type="info">method</Badge>

Retrieves the public key used to verify signatures on incoming webhook payloads.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.getSigningKey('key-id')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.getSigningKey('key-id')
```
:::

### Params

- `keyId` `string` <Badge type="danger">required</Badge>: The ID name of the signing key.
  > [!TIP]
  > The `keyId` can be found in the `signature-input` request header of the webhook notification.

### Response

- `success` `boolean` <Badge>guaranteed</Badge>: Whether the operation was successful.
- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `key` `string` <Badge>guaranteed</Badge>
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Validate <Badge type="info">method</Badge>

Validates whether your enrolled webhook(s) respond with an HTTP `2xx` status code. Sends a test request to each webhook containing your customer handle, a hardcoded event type (`test`), a hardcoded sender email (`test@mailchannels.com`), a timestamp, a request ID (provided or generated), and an SMTP ID. The response includes the HTTP status code and body returned by each webhook.

### Usage

::: code-group
```ts [modular.ts]
import { MailChannelsClient, Webhooks } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const webhooks = new Webhooks(mailchannels)

const { data, error } = await webhooks.validate('optional-request-id')
```

```ts [full.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.webhooks.validate('optional-request-id')
```
:::

### Params

- `requestId` `string` <Badge type="info">optional</Badge>: Optional identifier in the webhook payload. If not provided, a value will be automatically generated.
  > [!NOTE]
  > The request id must not exceed 28 characters.

### Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `allPassed` `boolean` <Badge>guaranteed</Badge>: Indicates whether all webhook validations passed
  - `results` `object[]` <Badge>guaranteed</Badge>: Detailed results for each tested webhook, including whether it returned a 2xx status code, along with its response status code and body.
    - `result` `"passed" | "failed"` <Badge>guaranteed</Badge>: Indicates whether the webhook responded with a 2xx HTTP status code.
    - `webhook` `string` <Badge>guaranteed</Badge>: The webhook that was validated.
    - `response` `object` <Badge>guaranteed</Badge>: The HTTP response returned by the webhook, including status code and response body. A null value indicates no response was received. Possible reasons include timeouts, connection failures, or other network-related issues.
      - `body` `string` <Badge type="info">optional</Badge>: Response body from webhook. Returns an error if unprocessable or too large.
      - `status` `number` <Badge>guaranteed</Badge>: HTTP status code returned by the webhook.
- `error` `ErrorResponse | null` <Badge type="warning">nullable</Badge>: Error information if the operation failed.
  - `message` `string` <Badge>guaranteed</Badge>: A human-readable description of the error.
  - `statusCode` `number | null` <Badge type="warning">nullable</Badge>: The HTTP status code from the API, or `null` if the error is not related to an HTTP request.

## Type declarations

<<< @/snippets/webhooks.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
  <<< @/snippets/success-response.ts

  **List type declarations**

  <<< @/snippets/webhooks-list-response.ts

  **Signing Key type declarations**

  <<< @/snippets/webhooks-signing-key-response.ts

  **Validate type declarations**

  <<< @/snippets/webhooks-validate-response.ts
</details>
