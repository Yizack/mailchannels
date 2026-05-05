# Bun

Send emails using [Bun](https://bun.sh/) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## 1. Install

Add the `mailchannels-sdk` package dependency to your Bun project.

::: code-group
```sh [bun]
bun add mailchannels-sdk
```
:::

## 2. Configure your API key

Add your MailChannels API key to your `.env` file.

```sh [.env]
MAILCHANNELS_API_KEY=your-api-key
```

## 3. Send email using HTML

Register a `/api/send` [Route handler](https://bun.sh/docs/runtime/http/server) for your Bun app.

Use the `html` property to send an email with HTML content.

```ts [src/index.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY as string)

const server = Bun.serve({
  port: 3000,
  routes: {
    '/api/send': {
      POST: async () => {
        const { data, error } = await mailchannels.emails.send({
          from: 'Name <from@example.com>',
          to: 'to@example.com',
          subject: 'Test email',
          html: '<p>Hello World</p>'
        })

        if (error) {
          return Response.json(error, { status: error.statusCode || 500 })
        }

        return Response.json(data)
      }
    },
    '/api/*': Response.json({ message: 'Not found' }, { status: 404 }),
    '/*': () => new Response('Not found', { status: 404 })
  }
})

console.info(`Listening on http://localhost:${server.port} ...`)
```
