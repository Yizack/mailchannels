# Next.js

Send emails using [Next.js](https://nextjs.org/) and the MailChannels Node.js SDK.

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

Register an [App route handler](https://nextjs.org/docs/app/getting-started/route-handlers) under `app/api/send/route.ts` or a [Pages API route](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) under `pages/api/send.ts`.

Use the `html` property to send an email with HTML content.

::: code-group
```ts [app/api/send/route.ts]
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY);

export async function POST () {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  });

  if (error) {
    return Response.json({ error }, {
      status: error.statusCode || 400
    })
  }

  return Response.json(data)
}
```
```ts [pages/api/send.ts]
import type { NextApiRequest, NextApiResponse } from "next";
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  });

  if (error) {
    return res.status(400).json({ error });
  }

  return res.status(200).json(data);
}
```
:::
