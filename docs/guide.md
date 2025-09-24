# Getting Started

Getting started with `mailchannels-sdk`

## Overview

<!-- @include: ../README.md#overview -->
<!-- @include: ../README.md#note-->

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
const { success, data } = await mailchannels.emails.send({
  // ...
})
```

This method is useful when building an application on top of MailChannels and you need to use multiple modules from the library.

### Importing only the modules you need

In this example, we import the `MailChannelsClient` and the `Emails` module to send an email.

```ts{1,2}
import { MailChannelsClient } from 'mailchannels-sdk'
import { Emails } from 'mailchannels-sdk/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)
const { success, data } = await emails.send({
  // ...
})
```

This method is useful when you only need to use a specific module from the library and want to reduce the bundle size.

### Error handling

All methods in this SDK return an object containing an `error` property besides the actual response data to avoid throwing exceptions. If the request was successful, the `error` property will be `null`. If there was an error, the `error` property will contain a `string` with the error message.

```ts{1}
const { success, data, error } = await emails.send({
  // ...
})
```
