# Deno Deploy

Send emails using [Deno Deploy](https://deno.com/deploy) and the MailChannels Node.js SDK.

## Prerequisites

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## 1. Create a Deno Deploy project

Go to [deno.com/deploy](https://deno.com/deploy) and create a new Deno Deploy project.

## 2. Edit the code

```ts [main.ts]
import { MailChannels } from 'npm:mailchannels-sdk';

const mailchannels = new MailChannels('your-api-key');

Deno.serve(async () => {
  const { data, error } = await mailchannels.emails.send({
    from: 'Name <from@example.com>',
    to: 'to@example.com',
    subject: 'Test email',
    html: '<p>Hello World</p>'
  })

  if (error) {
    return Response.json(error, { status: error.statusCode || 500 })
  }

  return Response.json(data, { status: 200 })
})
```

## 3. Deploy

Click on the "Deploy" button to deploy your project and test sending an email.
