# Changelog


## v0.4.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.0...v0.4.1)

### 🚀 Enhancements

- **domains:** Add `bulkCreateLoginLinks` method ([0edd816](https://github.com/Yizack/mailchannels/commit/0edd816))

### 📖 Documentation

- **suppressions:** Fix suppression response ([26953a5](https://github.com/Yizack/mailchannels/commit/26953a5))
- **domains:** Fix typo ([9d8d39f](https://github.com/Yizack/mailchannels/commit/9d8d39f))
- Add features to readme ([34f4f49](https://github.com/Yizack/mailchannels/commit/34f4f49))

### 🏡 Chore

- Export some missing types ([9f63d72](https://github.com/Yizack/mailchannels/commit/9f63d72))
- **ci:** Add new line ([1e9f7ec](https://github.com/Yizack/mailchannels/commit/1e9f7ec))
- **types:** Use explicit import path for consistency ([75cc53a](https://github.com/Yizack/mailchannels/commit/75cc53a))

### ✅ Tests

- Remove unused imports ([3bf659c](https://github.com/Yizack/mailchannels/commit/3bf659c))

### 🤖 CI

- Use npm trusted publishing ([fd1d591](https://github.com/Yizack/mailchannels/commit/fd1d591))
- Use latest node for trusted publish ([0125387](https://github.com/Yizack/mailchannels/commit/0125387))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.7...v0.4.0)

### 🚀 Enhancements

- ⚠️  Update to mailchannels email api `0.11.0` ([#1](https://github.com/Yizack/mailchannels/pull/1))

### 🩹 Fixes

- **domains:** Add missing returning type in `addListEntry` ([14a755a](https://github.com/Yizack/mailchannels/commit/14a755a))

### 📖 Documentation

- Update new endpoints list and add links ([7880e36](https://github.com/Yizack/mailchannels/commit/7880e36))

### 🏡 Chore

- **lint:** Add `function-call-spacing` stylistic rule ([ac9055e](https://github.com/Yizack/mailchannels/commit/ac9055e))

### ✅ Tests

- Error prop must be truthy on error ([ffed7a9](https://github.com/Yizack/mailchannels/commit/ffed7a9))

### 🤖 CI

- Update to `actions/checkout@v5` ([964752b](https://github.com/Yizack/mailchannels/commit/964752b))
- Update `autofix-ci` ([45c386a](https://github.com/Yizack/mailchannels/commit/45c386a))

#### ⚠️ Breaking Changes

- ⚠️  Update to mailchannels email api `0.11.0` ([#1](https://github.com/Yizack/mailchannels/pull/1))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.7

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.6...v0.3.7)

### 📦 Build

- Update readme for each mirror package ([5ee3e14](https://github.com/Yizack/mailchannels/commit/5ee3e14))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.6

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.5...v0.3.6)

### 💅 Refactors

- Rename main npm package to `mailchannels-sdk` ([cc00c23](https://github.com/Yizack/mailchannels/commit/cc00c23))

### 📦 Build

- Publish npm package aliases ([ebb07c3](https://github.com/Yizack/mailchannels/commit/ebb07c3))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.5

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.4...v0.3.5)

### 🚀 Enhancements

- **service:** Support `report` false negative or false positive ([1e180ba](https://github.com/Yizack/mailchannels/commit/1e180ba))

### 📖 Documentation

- Update features ([623350e](https://github.com/Yizack/mailchannels/commit/623350e))

### 🤖 CI

- No need to force install corepack anymore ([4436b94](https://github.com/Yizack/mailchannels/commit/4436b94))
- **auto-fix:** Update `auto-fix` action version hash ([40131a6](https://github.com/Yizack/mailchannels/commit/40131a6))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.4

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.3...v0.3.4)

### 🚀 Enhancements

- **emails:** Support DKIM PEM format by stripping headers ([7b26474](https://github.com/Yizack/mailchannels/commit/7b26474))
- **domains:** Add `listDownstreamAddresses` method ([aded64a](https://github.com/Yizack/mailchannels/commit/aded64a))
- **domains:** Add `setDownstreamAddress` method ([5bffc66](https://github.com/Yizack/mailchannels/commit/5bffc66))
- **domains:** Support `bulkProvision` method ([6200de8](https://github.com/Yizack/mailchannels/commit/6200de8))

### 🩹 Fixes

- Add some missing error checks ([fba1abe](https://github.com/Yizack/mailchannels/commit/fba1abe))

### 📖 Documentation

- **domains:** Add missing list entries type declarations ([ecc026f](https://github.com/Yizack/mailchannels/commit/ecc026f))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.3

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.2...v0.3.3)

### 🚀 Enhancements

- Add service module + status and subscriptions methods ([b9c76d6](https://github.com/Yizack/mailchannels/commit/b9c76d6))
- Add domains module + provision method ([86e9dac](https://github.com/Yizack/mailchannels/commit/86e9dac))
- **domains:** Add create login link method ([f8377f4](https://github.com/Yizack/mailchannels/commit/f8377f4))
- **domains:** Add list method ([777d333](https://github.com/Yizack/mailchannels/commit/777d333))
- **domains:** Add `addListEntry` method ([4c82eda](https://github.com/Yizack/mailchannels/commit/4c82eda))
- **domains:** Add `delete` domain method ([4107014](https://github.com/Yizack/mailchannels/commit/4107014))
- **domains:** Add `updateApiKey` method ([c0fa0b3](https://github.com/Yizack/mailchannels/commit/c0fa0b3))
- **users:** Add `users` module and `create` method ([27dff86](https://github.com/Yizack/mailchannels/commit/27dff86))
- **users:** Add `addListEntry` method ([1f5a591](https://github.com/Yizack/mailchannels/commit/1f5a591))
- **users:** Support recipient list entries ([3733fbc](https://github.com/Yizack/mailchannels/commit/3733fbc))
- **users:** Support delete a recipient list entry ([dcc98d2](https://github.com/Yizack/mailchannels/commit/dcc98d2))
- **modules:** Add `lists` module ([38dfb98](https://github.com/Yizack/mailchannels/commit/38dfb98))
- **domains:** Support list entries and delete entry ([d61bf7f](https://github.com/Yizack/mailchannels/commit/d61bf7f))

### 🩹 Fixes

- Return possible message errors on unknown api error ([7e1298b](https://github.com/Yizack/mailchannels/commit/7e1298b))
- **sub-accounts:** List options errors check ([eef12b5](https://github.com/Yizack/mailchannels/commit/eef12b5))
- **domains:** Add list entry missing domain error ([281a855](https://github.com/Yizack/mailchannels/commit/281a855))
- **domains:** Consistent return props in `addListEntry` ([f7cd906](https://github.com/Yizack/mailchannels/commit/f7cd906))

### 📖 Documentation

- Readme update readme ([ea8190a](https://github.com/Yizack/mailchannels/commit/ea8190a))
- Add domain and service modules to index page ([4047085](https://github.com/Yizack/mailchannels/commit/4047085))
- Adjust sidebar ([d530883](https://github.com/Yizack/mailchannels/commit/d530883))
- **sub-accounts:** Add jsdoc to list options param ([271d36d](https://github.com/Yizack/mailchannels/commit/271d36d))
- Consistent quotes formatting ([ce457b7](https://github.com/Yizack/mailchannels/commit/ce457b7))
- Add inbound api info ([00093a7](https://github.com/Yizack/mailchannels/commit/00093a7))
- Adjust roadmap ([de65353](https://github.com/Yizack/mailchannels/commit/de65353))
- Init lists module pages + versions ([1715907](https://github.com/Yizack/mailchannels/commit/1715907))

### 🏡 Chore

- Remove unused type ([40e87d4](https://github.com/Yizack/mailchannels/commit/40e87d4))
- Check for message error on unknown errors ([53697e0](https://github.com/Yizack/mailchannels/commit/53697e0))
- Add new line before class methods ([e5532b8](https://github.com/Yizack/mailchannels/commit/e5532b8))
- Sort success response type import ([9f1ee47](https://github.com/Yizack/mailchannels/commit/9f1ee47))
- **client:** Omit method prop on fetch methods ([c84bcce](https://github.com/Yizack/mailchannels/commit/c84bcce))
- **client:** Add put fetch method ([12d4800](https://github.com/Yizack/mailchannels/commit/12d4800))
- **eslint:** Add arrow-parens stylistic rule ([25f9a45](https://github.com/Yizack/mailchannels/commit/25f9a45))
- Simple exports properties ([b3514ce](https://github.com/Yizack/mailchannels/commit/b3514ce))

### ✅ Tests

- Test api response errors once ([0d3935e](https://github.com/Yizack/mailchannels/commit/0d3935e))
- **sub-accounts:** Fix tests ([dd28836](https://github.com/Yizack/mailchannels/commit/dd28836))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.1...v0.3.2)

### 💅 Refactors

- Return error prop in response instead of forcing to log errors ([f58560d](https://github.com/Yizack/mailchannels/commit/f58560d))

### 📖 Documentation

- Add note ([ae3cb74](https://github.com/Yizack/mailchannels/commit/ae3cb74))
- Add `robots.txt` ([49c7c04](https://github.com/Yizack/mailchannels/commit/49c7c04))
- Generate vitepress sitemap ([9cc0760](https://github.com/Yizack/mailchannels/commit/9cc0760))

### 🏡 Chore

- Update homepage ([ccf0ad3](https://github.com/Yizack/mailchannels/commit/ccf0ad3))
- **docs:** Remove unnecessary prop ([ea9c574](https://github.com/Yizack/mailchannels/commit/ea9c574))
- **eslint:** Simplify config ([bf4e95a](https://github.com/Yizack/mailchannels/commit/bf4e95a))
- Throw error on missing api key ([8d647c2](https://github.com/Yizack/mailchannels/commit/8d647c2))
- Add missing response types ([f9ee04c](https://github.com/Yizack/mailchannels/commit/f9ee04c))
- Add reference quotes in error messages ([eefc369](https://github.com/Yizack/mailchannels/commit/eefc369))
- **playground:** Update playground ([4348603](https://github.com/Yizack/mailchannels/commit/4348603))
- Fix test no api key provided error ([7349358](https://github.com/Yizack/mailchannels/commit/7349358))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.3.0...v0.3.1)

### 🚀 Enhancements

- **sub-accounts:** Support deleting sub-accounts ([279ecf3](https://github.com/Yizack/mailchannels/commit/279ecf3))
- Support delete api key and delete smtp password methods ([7ca7cf4](https://github.com/Yizack/mailchannels/commit/7ca7cf4))
- **sub-accounts:** Support suspend and activate ([0f89f3d](https://github.com/Yizack/mailchannels/commit/0f89f3d))

### 📖 Documentation

- Fix scroll bar height ([0673a77](https://github.com/Yizack/mailchannels/commit/0673a77))
- Update roadmap ([51fa6e8](https://github.com/Yizack/mailchannels/commit/51fa6e8))
- Add inbound api info ([e3571fd](https://github.com/Yizack/mailchannels/commit/e3571fd))
- Add missing emojis ([6d30a9e](https://github.com/Yizack/mailchannels/commit/6d30a9e))
- Follow guidelines of logo in presentation and cover images ([17c5bd1](https://github.com/Yizack/mailchannels/commit/17c5bd1))
- Add MailChannels API link ([e1e13f9](https://github.com/Yizack/mailchannels/commit/e1e13f9))

### 🏡 Chore

- **lint:** Sort imports ([93cf43b](https://github.com/Yizack/mailchannels/commit/93cf43b))
- Simple variable ([76cc147](https://github.com/Yizack/mailchannels/commit/76cc147))
- **webhooks:** Use simple success variable ([323aaf6](https://github.com/Yizack/mailchannels/commit/323aaf6))
- **eslint:** Add no-multiple-empty-lines rule ([f14f643](https://github.com/Yizack/mailchannels/commit/f14f643))
- **test:** Fix extra space ([1dfee72](https://github.com/Yizack/mailchannels/commit/1dfee72))

### ✅ Tests

- Suppress console.error in reporter ([fdd9c49](https://github.com/Yizack/mailchannels/commit/fdd9c49))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.3.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.2.2...v0.3.0)

### 🚀 Enhancements

- **sub-accoutns:** Support list api keys and smtp passwords ([24e6ce3](https://github.com/Yizack/mailchannels/commit/24e6ce3))

### 💅 Refactors

- ⚠️  Handle `$fetch` errors + add error loggers ([8703138](https://github.com/Yizack/mailchannels/commit/8703138))

### 📖 Documentation

- Add presentation image ([a251e4e](https://github.com/Yizack/mailchannels/commit/a251e4e))
- Update cover image ([8d6c78d](https://github.com/Yizack/mailchannels/commit/8d6c78d))
- **fonts:** Fonts swap display ([63686ac](https://github.com/Yizack/mailchannels/commit/63686ac))
- **theme:** Import theme without fonts ([b420f13](https://github.com/Yizack/mailchannels/commit/b420f13))
- Jsdoc format consistency ([68978e9](https://github.com/Yizack/mailchannels/commit/68978e9))
- **snippets:** Rewrite snippets generator ([343a57a](https://github.com/Yizack/mailchannels/commit/343a57a))
- Fix readme badges ([215d4e4](https://github.com/Yizack/mailchannels/commit/215d4e4))

### 🏡 Chore

- **playground:** Reorganize files ([c2a1b27](https://github.com/Yizack/mailchannels/commit/c2a1b27))

#### ⚠️ Breaking Changes

- ⚠️  Handle `$fetch` errors + add error loggers ([8703138](https://github.com/Yizack/mailchannels/commit/8703138))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.2.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.2.1...v0.2.2)

### 🩹 Fixes

- **send:** Success response regression ([1c0bffb](https://github.com/Yizack/mailchannels/commit/1c0bffb))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.2.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.2.0...v0.2.1)

### 🚀 Enhancements

- **sub-accounts:** Add create sub-account ([8d4c98d](https://github.com/Yizack/mailchannels/commit/8d4c98d))
- **sub-accounts:** Create api keys and smtp passwords ([b79ee31](https://github.com/Yizack/mailchannels/commit/b79ee31))

### 🩹 Fixes

- **emails:** Add missing check domain response props ([3beb39b](https://github.com/Yizack/mailchannels/commit/3beb39b))
- **types:** `to` and `from` must be required ([b91067e](https://github.com/Yizack/mailchannels/commit/b91067e))

### 💅 Refactors

- No payloads in responses + don't export internal types ([78d4c3a](https://github.com/Yizack/mailchannels/commit/78d4c3a))

### 📖 Documentation

- Add mailchannels colors to badges ([cb9ce8d](https://github.com/Yizack/mailchannels/commit/cb9ce8d))
- Improve docs ([84d9dc0](https://github.com/Yizack/mailchannels/commit/84d9dc0))
- Add custom favicon and contributors section ([b3538b9](https://github.com/Yizack/mailchannels/commit/b3538b9))
- Update description ([9360471](https://github.com/Yizack/mailchannels/commit/9360471))
- Use mailchannels brand ([85165db](https://github.com/Yizack/mailchannels/commit/85165db))
- Add promo cover ([e254ec6](https://github.com/Yizack/mailchannels/commit/e254ec6))
- **seo:** Fix heads ([cb8b922](https://github.com/Yizack/mailchannels/commit/cb8b922))
- Add sub-accounts in readme ([8daf9d8](https://github.com/Yizack/mailchannels/commit/8daf9d8))

### 🏡 Chore

- Fix sub-accounts file name ([5e1ff4e](https://github.com/Yizack/mailchannels/commit/5e1ff4e))
- **snippets:** Improve snippets types extractor ([4061b81](https://github.com/Yizack/mailchannels/commit/4061b81))
- **types:** Sub-accounts create types ([28fd89c](https://github.com/Yizack/mailchannels/commit/28fd89c))
- **types:** Improve type comments ([33d2eca](https://github.com/Yizack/mailchannels/commit/33d2eca))
- Add issue templates ([29c2bf4](https://github.com/Yizack/mailchannels/commit/29c2bf4))
- **eslint:** Add import rules ([f60f070](https://github.com/Yizack/mailchannels/commit/f60f070))
- Improve tsconfig and eslint ([f2c4bdd](https://github.com/Yizack/mailchannels/commit/f2c4bdd))
- Custom error name ([c65a2c8](https://github.com/Yizack/mailchannels/commit/c65a2c8))
- **playground:** Correct sub-accounts script ([a1a5bac](https://github.com/Yizack/mailchannels/commit/a1a5bac))

### ✅ Tests

- Add more emails test ([cfc3319](https://github.com/Yizack/mailchannels/commit/cfc3319))
- Add client tests ([7873118](https://github.com/Yizack/mailchannels/commit/7873118))
- Add mailchannels instance and modules test ([7b652f1](https://github.com/Yizack/mailchannels/commit/7b652f1))
- Add test for webhooks ([f4d6573](https://github.com/Yizack/mailchannels/commit/f4d6573))
- Add sub-accounts test ([c42cb9c](https://github.com/Yizack/mailchannels/commit/c42cb9c))
- Add missing create api key and smtp password test ([a2f92ba](https://github.com/Yizack/mailchannels/commit/a2f92ba))
- Add missing recipient util tests ([adc8491](https://github.com/Yizack/mailchannels/commit/adc8491))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.2.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.1.3...v0.2.0)

### 🚀 Enhancements

- **send:** Tracking settings support ([0b3f82f](https://github.com/Yizack/mailchannels/commit/0b3f82f))
- Add `sub-accounts` module and list sub accounts method ([9e410bb](https://github.com/Yizack/mailchannels/commit/9e410bb))

### 💅 Refactors

- Rename `getWebhooks` to `listWebhooks` ([7de2a25](https://github.com/Yizack/mailchannels/commit/7de2a25))
- ⚠️  Package rewrite separate features in modules ([b69856a](https://github.com/Yizack/mailchannels/commit/b69856a))

### 📖 Documentation

- Snippets generation script ([b1ca183](https://github.com/Yizack/mailchannels/commit/b1ca183))
- **send:** Add tracking and snippets ([4d6f6c2](https://github.com/Yizack/mailchannels/commit/4d6f6c2))
- **send:** Outline deep and send method usage etc ([e823c1f](https://github.com/Yizack/mailchannels/commit/e823c1f))
- **check-domain:** Add check-domain info ([1878079](https://github.com/Yizack/mailchannels/commit/1878079))
- **webhooks:** Add webhooks info ([a99f2c3](https://github.com/Yizack/mailchannels/commit/a99f2c3))
- Update readme and docs index ([3e879a3](https://github.com/Yizack/mailchannels/commit/3e879a3))
- Improve readme ([227c5b4](https://github.com/Yizack/mailchannels/commit/227c5b4))
- Add theme colors ([f0b8516](https://github.com/Yizack/mailchannels/commit/f0b8516))
- Update readme ([50e959a](https://github.com/Yizack/mailchannels/commit/50e959a))
- Update package descriptions ([b746846](https://github.com/Yizack/mailchannels/commit/b746846))
- Adjust badge tip bg color ([4d8633f](https://github.com/Yizack/mailchannels/commit/4d8633f))
- Update readme roadmap ([10dfff4](https://github.com/Yizack/mailchannels/commit/10dfff4))

### 🏡 Chore

- **docs:** Sidebar config ([f7c46ef](https://github.com/Yizack/mailchannels/commit/f7c46ef))
- Add info logger ([240c5d6](https://github.com/Yizack/mailchannels/commit/240c5d6))
- Add license ([851f2ad](https://github.com/Yizack/mailchannels/commit/851f2ad))

#### ⚠️ Breaking Changes

- ⚠️  Package rewrite separate features in modules ([b69856a](https://github.com/Yizack/mailchannels/commit/b69856a))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.1.3

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.1.2...v0.1.3)

### 🩹 Fixes

- Emails module exports ([f37b9d8](https://github.com/Yizack/mailchannels/commit/f37b9d8))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.1.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.1.1...v0.1.2)

### 💅 Refactors

- Separate functionalities in modules in favor of tree shaking ([5256148](https://github.com/Yizack/mailchannels/commit/5256148))

### 📖 Documentation

- Initial files ([38743ec](https://github.com/Yizack/mailchannels/commit/38743ec))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.1.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.1.0...v0.1.1)

### 💅 Refactors

- Extract all methods automatically ([bd0fc43](https://github.com/Yizack/mailchannels/commit/bd0fc43))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.1.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.0.3...v0.1.0)

### 🚀 Enhancements

- DKIM, SPF & Domain Lockdown Check ([5497fb4](https://github.com/Yizack/mailchannels/commit/5497fb4))
- Enroll for webhook notifications ([c25bc80](https://github.com/Yizack/mailchannels/commit/c25bc80))
- Get user webhooks ([b022afe](https://github.com/Yizack/mailchannels/commit/b022afe))
- Add delete webhooks method ([a56395a](https://github.com/Yizack/mailchannels/commit/a56395a))
- Add retrieve webhook signing key ([fd9ecdc](https://github.com/Yizack/mailchannels/commit/fd9ecdc))

### 🩹 Fixes

- **types:** Use extract instead of pick ([e2f558a](https://github.com/Yizack/mailchannels/commit/e2f558a))
- **webhooks:** Fix get response ([e9c796a](https://github.com/Yizack/mailchannels/commit/e9c796a))
- **types:** Fix type exports ([79c8261](https://github.com/Yizack/mailchannels/commit/79c8261))

### 💅 Refactors

- Use true private setup property with # syntax ([be91a27](https://github.com/Yizack/mailchannels/commit/be91a27))
- Refactor core and check domain implementation ([80a19de](https://github.com/Yizack/mailchannels/commit/80a19de))
- **types:** ⚠️  Improve types clarity ([ee1fb13](https://github.com/Yizack/mailchannels/commit/ee1fb13))

### 📖 Documentation

- Add readme info ([7bed622](https://github.com/Yizack/mailchannels/commit/7bed622))
- Add roadmap ([ee29cc8](https://github.com/Yizack/mailchannels/commit/ee29cc8))
- Add missing contents ([a853dbb](https://github.com/Yizack/mailchannels/commit/a853dbb))
- Remove examples from contents ([ad99094](https://github.com/Yizack/mailchannels/commit/ad99094))
- Update roadmap ([220fc63](https://github.com/Yizack/mailchannels/commit/220fc63))

### 🏡 Chore

- **check-domain:** Include payload in response ([80301e2](https://github.com/Yizack/mailchannels/commit/80301e2))
- **playground:** Add check domain ([ad58780](https://github.com/Yizack/mailchannels/commit/ad58780))
- **palyground:** Send changes ([af667de](https://github.com/Yizack/mailchannels/commit/af667de))

#### ⚠️ Breaking Changes

- **types:** ⚠️  Improve types clarity ([ee1fb13](https://github.com/Yizack/mailchannels/commit/ee1fb13))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.0.3

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.0.2...v0.0.3)

### 🩹 Fixes

- **types:** Missing types for `cc` and `bcc` ([f67dcc2](https://github.com/Yizack/mailchannels/commit/f67dcc2))
- **types:** Move dkim types correctly ([af9559b](https://github.com/Yizack/mailchannels/commit/af9559b))

### 📖 Documentation

- Initialize readme ([c129bcd](https://github.com/Yizack/mailchannels/commit/c129bcd))

### 🏡 Chore

- **types:** Add `no-explicit-any` eslint rule ([79652d6](https://github.com/Yizack/mailchannels/commit/79652d6))
- Set dkim values as undefined if nullable ([e2d6e9c](https://github.com/Yizack/mailchannels/commit/e2d6e9c))

### 🤖 CI

- Add ci workflows ([4c92b36](https://github.com/Yizack/mailchannels/commit/4c92b36))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.0.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.0.1...v0.0.2)

### 🩹 Fixes

- Recipients parsing ([cf6732b](https://github.com/Yizack/mailchannels/commit/cf6732b))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.0.1


### 🏡 Chore

- Package initial files ([3ad02b7](https://github.com/Yizack/mailchannels/commit/3ad02b7))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

