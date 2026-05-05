# Vercel Functions

Send emails using [Vercel Functions](https://vercel.com/docs/functions) and the MailChannels Node.js SDK.

In this guide we use [Next.js](https://nextjs.org/) route handlers to create Vercel Functions, but you can use any framework that supports Vercel Functions.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)
- [Install the Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli)

## 1. Install

Add the `mailchannels-sdk` package dependency to your Next.js project.

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

Add your MailChannels API key to your `.env` or `.env.local` file.

```sh [.env.local]
MAILCHANNELS_API_KEY=your-api-key
```

## 3. Create a Next.js function

Register an [App route handler](https://nextjs.org/docs/app/getting-started/route-handlers) under `app/api/send/route.ts`. Each route file you create under `app/api/` is automatically deployed as a Vercel Function.

Use the `html` property to send an email with HTML content.

```ts [app/api/send/route.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY)

export async function POST () {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  })

  if (error) {
    return Response.json(error, {
      status: error.statusCode || 400
    })
  }

  return Response.json(data)
}
```

## 4. Test locally

Start the Next.js development server.

```sh
npm run dev
```

Your function will be available at `http://localhost:3000/api/send` as a POST endpoint.

## 5. Deploy to Vercel

Add your `MAILCHANNELS_API_KEY` as an environment variable in your Vercel project.

Then deploy your project with the Vercel CLI.

```sh
vercel
```

Your function will be available at `https://your-project.vercel.app/api/send`.
