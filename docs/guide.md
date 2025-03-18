# Getting Started

Getting started with `@yizack/mailchannels`

## Overview

<!-- @include: ../README.md#overview -->

## Installation

Add `@yizack/mailchannels` dependency to your project

::: code-group
```sh [npm]
npm i @yizack/mailchannels
```

```sh [yarn]
yarn add @yizack/mailchannels
```

```sh [pnpm]
pnpm add @yizack/mailchannels
```
:::

## Quick Start

This library can be used in two ways:
- Importing the whole library
- Importing the client and only the modules you need

### Importing the whole library

In this example, we import the whole library and use the `MailChannels` class to send an email.

```ts{1}
import { MailChannels } from '@yizack/mailchannels'

const mailchannels = new MailChannels('your-api-key')
const { success } = await mailchannels.emails.send({
  // ...
})
```

This method is useful when building an application on top of MailChannels and you need to use multiple modules from the library.

### Importing only the modules you need

In this example, we import the `MailChannelsClient` and the `Send` module to send an email.

```ts{1,2}
import { MailChannelsClient } from '@yizack/mailchannels'
import { Emails } from '@yizack/mailchannels/modules'

const mailchannels = new MailChannelsClient('your-api-key')
const emails = new Emails(mailchannels)
const { success } = await emails.send({
  // ...
})
```

This method is useful when you only need to use a specific module from the library and want to reduce the bundle size.
