# Astro

Send emails using [Astro](https://astro.build/) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## 1. Install

Add the `mailchannels-sdk` package dependency to your Astro project.

::: code-group
```sh [npm]
npm i mailchannels-sdk
```

```sh [yarn]
yarn add mailchannels-sdk
```

```sh [pnpm]
pnpm add mailchannels-sdk
```

```sh [bun]
bun add mailchannels-sdk
```

```sh [deno]
deno add npm:mailchannels-sdk
```
:::

## 2. Install SSR adapter

Enable server-side rendering (SSR) in your Astro project by [installing an SSR adapter](https://docs.astro.build/en/guides/on-demand-rendering/).

## 3. Configure your API key

Add your MailChannels API key to your `.env` file.

```sh [.env]
MAILCHANNELS_API_KEY=your-api-key
```

## 4. Send email using HTML

Define a `send` [Action](https://docs.astro.build/en/guides/actions/) in `src/actions/index.ts`.

Use the `html` property to send an email with HTML content.

```ts [src/actions/index.ts]
import { defineAction, ActionError } from 'astro:actions'
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels(import.meta.env.MAILCHANNELS_API_KEY)

export const server = {
  send: defineAction({
    accept: 'form', // or 'json' if you want the handler to accept JSON input
    handler: async () => {
      const { data, error } = await mailchannels.emails.send({
        from: 'Name <from@example.com>',
        to: 'to@example.com',
        subject: 'Test email',
        html: '<p>Hello World</p>'
      })

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message
        })
      }

      return data
    }
  })
}
```

## 5. Call the action

Call the `send` action from an Astro page. Use a native HTML form with `Astro.getActionResult()` for server-side handling, or intercept the form submission in a `<script>` tag for client-side updates without a page reload.

::: code-group
```astro [src/pages/index.astro]
---
import { actions } from 'astro:actions'

const result = Astro.getActionResult(actions.send)
---

<form method='POST' action={actions.send}>
  <button type='submit'>Send Email</button>
</form>

{result?.error && <p>Error: {result.error.message}</p>}
{result && !result.error && <p>Email sent successfully!</p>}
```
```astro [src/pages/script-tag.astro]
---
---

<form id="send-form">
  <button type="submit">Send Email</button>
</form>

<p id="message"></p>

<script>
  import { actions } from 'astro:actions'

  const form = document.getElementById('send-form') as HTMLFormElement
  const message = document.getElementById('message') as HTMLParagraphElement

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const { error } = await actions.send()

    message.textContent = error ? `Error: ${error.message}` : 'Email sent successfully!'
  })
</script>
```
:::
