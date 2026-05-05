# SvelteKit

Send emails using [SvelteKit](https://svelte.dev/docs/kit) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## 1. Install

Add the `mailchannels-sdk` package dependency to your SvelteKit project.

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

## 2. Configure your API key

Add your MailChannels API key to your `.env` file.

```sh [.env]
MAILCHANNELS_API_KEY=your-api-key
```

## 3. Send email using HTML

Create a [server API route](https://svelte.dev/docs/kit/routing#server) under `src/routes/api/send/+server.ts`.

Use the `html` property to send an email with HTML content.

```ts [src/routes/api/send/+server.ts]
import { json } from '@sveltejs/kit'
import { MAILCHANNELS_API_KEY } from '$env/static/private'
import { MailChannels } from 'mailchannels-sdk'
import type { RequestHandler } from './$types'

const mailchannels = new MailChannels(MAILCHANNELS_API_KEY)

export const POST: RequestHandler = async () => {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  })

  if (error) {
    return json({ error }, { status: error.statusCode || 400 })
  }

  return json(data)
}
```

## 4. Call the API route

Create a form in your SvelteKit app to call the `send` API route.

```svelte [src/routes/App.svelte]
<script lang="ts">
let loading = $state(false)
let result = $state<{ data?: unknown, error?: unknown } | null>(null)

async function handleSubmit (event: SubmitEvent) {
  event.preventDefault()
  loading = true
  result = null

  const response = await fetch('/api/send', { method: 'POST' })
  result = await response.json()
  loading = false
}
</script>

<h1>MailChannels SvelteKit Example</h1>

<form onsubmit={handleSubmit}>
  <button type="submit" disabled={loading}>
    {loading ? 'Sending...' : 'Send Email'}
  </button>
</form>

{#if result}
  <pre>{JSON.stringify(result, null, 2)}</pre>
{/if}
```
