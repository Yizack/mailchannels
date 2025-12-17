# Getting Started

Getting started with `mailchannels-sdk`

## Overview

<!-- @include: ../README.md#overview -->
<!-- @include: ../README.md#note -->

## Requirements

- [Create a MailChannels account](https://www.mailchannels.com/pricing/#for_devs)
- [Create an API key](https://console.mailchannels.net/settings/accountSettings#APIKeys)

## Installation

Add `mailchannels-sdk` dependency to your project

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
:::

## Quick Start

This library can be used in two ways:
- Importing the whole library
- Importing the client and only the modules you need

### Importing the whole library

In this example, we import the whole library and use the `MailChannels` class to send an email.

```ts{1}
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.send({
  from: 'Name <from@example.com>',
  to: 'to@example.com',
  subject: 'Test email',
  html: '<p>Hello World</p>'
})
```

This approach is useful when building an application on top of MailChannels and you need to use all or multiple modules from the library.

### Importing only the modules you need

In this example, we import the `MailChannelsClient` and the `Emails` module to send an email.

```ts{1}
import { MailChannelsClient, Emails } from 'mailchannels-sdk'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)

const { data, error } = await emails.send({
  from: 'Name <from@example.com>',
  to: 'to@example.com',
  subject: 'Test email',
  html: '<p>Hello World</p>'
})
```

This approach is tree-shakable and is useful when you only need to use specific modules from the library and want to reduce the bundle size of your application.

### Error handling

All methods in this SDK return an object with both `data` and `error` properties to avoid throwing exceptions, making error handling more predictable and easier to manage.

**Success case:**
- `data`: Contains the response data
- `error`: Will be `null`

**Error case:**
- `data`: Will be `null`
- `error`: Contains an `ErrorResponse` object with the following properties:
  - `message`: A human-readable description of the error
  - `statusCode`: The HTTP status code from the API (e.g., `400`, `404`), or `null` if the error occurred before making an HTTP request


```ts{5,13-15,18}
import { MailChannels } from 'mailchannels-sdk'

const mailchannels = new MailChannels('your-api-key')

const { data, error } = await mailchannels.emails.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Test email',
  html: '<p>Hello World</p>'
})

// handle the error as needed
if (error) {
  throw new Error(`Error ${error.statusCode}: ${error.message}`)
}

// data is guaranteed to be non-null here
console.log({ data })
```
