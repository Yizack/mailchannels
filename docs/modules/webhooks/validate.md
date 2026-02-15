# Validate <Badge type="info">method</Badge> <Badge><a href="/modules/webhooks">📢 Webhooks</a></Badge>

Validates whether your enrolled webhook(s) respond with an HTTP `2xx` status code. Sends a test request to each webhook containing your customer handle, a hardcoded event type (`test`), a hardcoded sender email (`test@mailchannels.com`), a timestamp, a request ID (provided or generated), and an SMTP ID. The response includes the HTTP status code and body returned by each webhook.

## Usage

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

## Params

- `requestId` `string` <Badge type="info">optional</Badge>: Optional identifier in the webhook payload. If not provided, a value will be automatically generated.
  > [!NOTE]
  > The request id must not exceed 28 characters.

## Response

- `data` `object | null` <Badge type="warning">nullable</Badge>
  - `allPassed` `boolean` <Badge>guaranteed</Badge>: Indicates whether all webhook validations passed
  - `results` `object[]` <Badge>guaranteed</Badge>: Detailed results for each tested webhook, including whether it returned a 2xx status code, along with its response status code and body.
    - `result` `"passed" | "failed"` <Badge>guaranteed</Badge>: Indicates whether the webhook responded with a 2xx HTTP status code.
    - `webhook` `string` <Badge>guaranteed</Badge>: The webhook that was validated.
    - `response` `object | null` <Badge type="warning">nullable</Badge>: The HTTP response returned by the webhook, including status code and response body. A null value indicates no response was received. Possible reasons include timeouts, connection failures, or other network-related issues.
      - `body` `string` <Badge type="info">optional</Badge>: Response body from webhook. Returns an error if unprocessable or too large.
      - `status` `number` <Badge>guaranteed</Badge>: HTTP status code returned by the webhook.
<!-- @include: ../_parts/error-response.md -->

## Type declarations

**Signature**

<<< @/snippets/webhooks-method-validate.ts

**Response type declarations**

<<< @/snippets/error-response.ts
<<< @/snippets/data-response.ts

**Validate type declarations**

<<< @/snippets/webhooks-validate-response.ts
