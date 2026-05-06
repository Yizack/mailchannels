# Nuxt

Send emails using [Nuxt](https://nuxt.com/) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## 1. Install

Add the `mailchannels-sdk` package dependency to your Nuxt project.

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
NUXT_MAILCHANNELS_API_KEY=your-api-key
```

Then, add the `mailchannels` object and `apiKey` property to the `runtimeConfig` in your `nuxt.config.ts`. The value of `apiKey` should be an empty string, which will be automatically set at runtime using the value of `process.env.NUXT_MAILCHANNELS_API_KEY`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    mailchannels: {
      apiKey: '' // This should be an empty string here
    }
  }
})
```

## 3. Send email using HTML

Register a [Server handler](https://nuxt.com/docs/guide/directory-structure/server) under `server/api/send.post.ts`.

Use the `html` property to send an email with HTML content.

```ts [server/api/send.post.ts]
import { MailChannels } from 'mailchannels-sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const mailchannels = new MailChannels(config.mailchannels.apiKey)

  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  })

  if (error) {
    throw createError({
      status: error.statusCode || 400,
      message: error.message
    })
  }

  return data
})
```

## Examples

<VPExamples :examples="[
  {
    title: 'Send',
    description: 'Send a predefined email using the API route',
    path: '/examples/frameworks/nuxt/server/api/send.post.ts'
  }
]" />
