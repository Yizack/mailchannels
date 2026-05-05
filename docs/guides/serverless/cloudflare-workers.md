# Cloudflare Workers

Send emails using [Cloudflare Workers](https://developers.cloudflare.com/workers/) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)
- [Create a Cloudflare Worker](https://developers.cloudflare.com/workers/get-started/guide/)

## 1. Install

Add the `mailchannels-sdk` package dependency to your Cloudflare Workers project.

::: code-group
```sh [npm]
npm install mailchannels-sdk
```

```sh [yarn]
yarn add mailchannels-sdk
```

```sh [pnpm]
pnpm add mailchannels-sdk
```
:::

## 2. Configure your API key

Add your MailChannels API key to your `.env` file.

```sh [.env]
MAILCHANNELS_API_KEY=your-api-key
```

## 3. Send email using HTML

Create a [Fetch Handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/) under `src/index.ts`.

Use the `html` property to send an email with HTML content.

We recommend using the [modular approach](/getting-started#importing-only-the-modules-you-need) to import only the `Emails` module from the SDK to reduce your Worker bundle size.

```ts [src/index.ts]
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const mailchannels = new MailChannelsClient(env.MAILCHANNELS_API_KEY)
    const emails = new Emails(mailchannels)

    const { data, error } = await emails.send({
      from: 'Name <from@example.com>',
      to: 'to@example.com',
      subject: 'Test email',
      html: '<p>Hello World</p>'
    })

    if (error) {
      return Response.json(error, { status: error.statusCode || 500 })
    }

    return Response.json(data, { status: 200 })
  }
} satisfies ExportedHandler<Env>
```

## 4. Deploy your Worker

Add your production secrets to your `.env.production` file.

> [!WARNING]
> Do not commit your `.env.production` file to version control. Add it to your `.gitignore` file.

Run the following command to [deploy your Worker to Cloudflare with your secrets](https://developers.cloudflare.com/workers/configuration/secrets/#upload-secrets-alongside-code).

```sh
npx wrangler deploy --secrets-file .env.production
```

Access your Worker URL (e.g. `https://your-worker.your_name.workers.dev`) to trigger the email sending.
