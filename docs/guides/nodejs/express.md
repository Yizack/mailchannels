# Express

Send emails using [Express](https://expressjs.com/) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

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

Add your MailChannels API key to your `.env` file.

```sh [.env]
MAILCHANNELS_API_KEY=your-api-key
```

## 3. Send email using HTML

Register a [Route handler](https://expressjs.com/en/guide/routing.html) for your Express app.

Use the `html` property to send an email with HTML content.

```ts [app/api/send/route.ts]
import express, { Request, Response } from 'express'
import { MailChannels } from 'mailchannels-sdk'

process.loadEnvFile()

const app = express()
const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY)

app.get('/send', async (req: Request, res: Response) => {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  })

  if (error) {
    return res.status(400).json({ error })
  }

  res.status(200).json({ data })
})

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
```
