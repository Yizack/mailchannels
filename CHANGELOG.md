# Changelog


## v0.7.5

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.7.4...v0.7.5)

### 🚀 Enhancements

- **webhooks:** Add strongly-typed webhook event definitions ([#87](https://github.com/Yizack/mailchannels/pull/87))
- **webhooks:** Add `verify` static and non-static method for message verification ([#88](https://github.com/Yizack/mailchannels/pull/88))

### 🩹 Fixes

- **types:** Mark smtp and host report fields optional ([6b9f966](https://github.com/Yizack/mailchannels/commit/6b9f966))

### 📖 Documentation

- Add reusable documentation partials ([a4467ed](https://github.com/Yizack/mailchannels/commit/a4467ed))
- Fix class signatures with private members ([1f0b7c2](https://github.com/Yizack/mailchannels/commit/1f0b7c2))
- Split module docs into per-method pages ([#77](https://github.com/Yizack/mailchannels/pull/77))
- Remove deep outline setting ([9be1eaa](https://github.com/Yizack/mailchannels/commit/9be1eaa))
- Refactor md plugins + add modules changelog ([2b053d1](https://github.com/Yizack/mailchannels/commit/2b053d1))
- Add missing sub-account links in sidebar ([d4280f6](https://github.com/Yizack/mailchannels/commit/d4280f6))
- **llms:** Exclude heading badges from `llms.txt` ([b10b3c4](https://github.com/Yizack/mailchannels/commit/b10b3c4))
- **domains:** Lint ([ccea999](https://github.com/Yizack/mailchannels/commit/ccea999))
- **snippets:** Clean output dir before generation ([53f9b38](https://github.com/Yizack/mailchannels/commit/53f9b38))
- **guide:** Lint missing blank lines ([bababde](https://github.com/Yizack/mailchannels/commit/bababde))
- **guide:** Add bun and deno install commands ([178c38f](https://github.com/Yizack/mailchannels/commit/178c38f))
- **changelog:** Use secondary color for date and separator ([942682c](https://github.com/Yizack/mailchannels/commit/942682c))
- Add module changelog release links and improve styling ([52fb3ae](https://github.com/Yizack/mailchannels/commit/52fb3ae))
- **domains:** Add missing data type snippets ([69d0c2f](https://github.com/Yizack/mailchannels/commit/69d0c2f))
- **modules:** Add front-matter titles to pages for SEO ([1543ee8](https://github.com/Yizack/mailchannels/commit/1543ee8))
- **sub-accounts:** Fix smtp descriptions ([88faca4](https://github.com/Yizack/mailchannels/commit/88faca4))
- **config:** Add modules path rewrites to avoid index trailing slash ([0b68d57](https://github.com/Yizack/mailchannels/commit/0b68d57))
- **snippets:** Fix ignore internal types ([3e0075d](https://github.com/Yizack/mailchannels/commit/3e0075d))
- **snippets:** Refine ignore checks ([d4d6c01](https://github.com/Yizack/mailchannels/commit/d4d6c01))
- **theme:** Refactor changelog-list styles ([d675242](https://github.com/Yizack/mailchannels/commit/d675242))
- **sub-accounts:** Add missing `@example` jsdoc tag ([8d6feab](https://github.com/Yizack/mailchannels/commit/8d6feab))
- **suppressions:** Reorder jsdoc `@param` tag ([a4bb996](https://github.com/Yizack/mailchannels/commit/a4bb996))

### 🏡 Chore

- **lint:** No need to resolve js plugins anymore ([656bb23](https://github.com/Yizack/mailchannels/commit/656bb23))
- **webhooks:** Return signing key id in `getSigningKey` ([79e3954](https://github.com/Yizack/mailchannels/commit/79e3954))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.7.4

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.7.3...v0.7.4)

### 💅 Refactors

- **domains:** Validate records in `setDownstreamAddress` ([a926001](https://github.com/Yizack/mailchannels/commit/a926001))
- **utils:** Simplify pagination error validation ([a008552](https://github.com/Yizack/mailchannels/commit/a008552))

### 📖 Documentation

- **webhooks:** Fix `getSigningKey` response docs ([a58a801](https://github.com/Yizack/mailchannels/commit/a58a801))
- **metrics:** Fix `usage` response and add data type ([7f68e24](https://github.com/Yizack/mailchannels/commit/7f68e24))
- **suppressions:** Fix `list` response data properties ([63ef090](https://github.com/Yizack/mailchannels/commit/63ef090))
- **snippets:** Iterate class members with for of ([873e33f](https://github.com/Yizack/mailchannels/commit/873e33f))

### 📦 Build

- Switch to obuild (rolldown) ([4e83ecd](https://github.com/Yizack/mailchannels/commit/4e83ecd))

### 🏡 Chore

- **lint:** Clean up eslint rules ([43f0e77](https://github.com/Yizack/mailchannels/commit/43f0e77))
- Switch linting from eslint to oxlint ([#73](https://github.com/Yizack/mailchannels/pull/73))

### ✅ Tests

- Cast module indexing key type ([58c0b2a](https://github.com/Yizack/mailchannels/commit/58c0b2a))

### 🤖 CI

- Limit check workflows to weekdays ([5c09f53](https://github.com/Yizack/mailchannels/commit/5c09f53))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.7.3

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.7.2...v0.7.3)

### 🩹 Fixes

- **types:** Correctly import `DataResponse` type in send-async ([c10fb92](https://github.com/Yizack/mailchannels/commit/c10fb92))
- **types:** Fix `queuedAt` type in `EmailsSendAsyncResponse` ([5d4d93f](https://github.com/Yizack/mailchannels/commit/5d4d93f))

### 💅 Refactors

- **types:** Rename files from .d.ts to .ts to ensure typechecking ([5d68f39](https://github.com/Yizack/mailchannels/commit/5d68f39))

### ✅ Tests

- Replace fake data type assertions with 'satisfies' ([5506109](https://github.com/Yizack/mailchannels/commit/5506109))

### 🤖 CI

- Fix version extraction in check-inbound-api-version workflow ([d777367](https://github.com/Yizack/mailchannels/commit/d777367))
- Udpate PR body text in API version workflows ([a85eaff](https://github.com/Yizack/mailchannels/commit/a85eaff))
- Prefix API version update branches with 'docs/' ([d4f7891](https://github.com/Yizack/mailchannels/commit/d4f7891))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.7.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.7.1...v0.7.2)

### 🚀 Enhancements

- **emails:** Add `envelopeFrom` option to email sending ([#63](https://github.com/Yizack/mailchannels/pull/63))

### 📖 Documentation

- **types:** Document send click tracking link conditions ([84fe123](https://github.com/Yizack/mailchannels/commit/84fe123))
- **email-api:** Update open api tracking file ([c920657](https://github.com/Yizack/mailchannels/commit/c920657))
- **snippets:** Skip private methods in class signature extraction ([ee2bb2e](https://github.com/Yizack/mailchannels/commit/ee2bb2e))
- Bump Email API version to 0.18.0 ([#68](https://github.com/Yizack/mailchannels/pull/68))
- Add section on GitHub Actions workflows to version tracking README ([8c36579](https://github.com/Yizack/mailchannels/commit/8c36579))

### 🤖 CI

- Add workflow to automatically check and update Email API version ([81bf8ef](https://github.com/Yizack/mailchannels/commit/81bf8ef))
- Add workflow to automatically check and update Inbound API version ([409ba9f](https://github.com/Yizack/mailchannels/commit/409ba9f))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.7.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.7.0...v0.7.1)

### 🚀 Enhancements

- **emails:** Add `sendAsync` method ([#60](https://github.com/Yizack/mailchannels/pull/60))

### 📖 Documentation

- **modules:** Document `ErrorResponse` structure for error fields ([a31da99](https://github.com/Yizack/mailchannels/commit/a31da99))
- Upgrade vitepress to recent alpha version ([147b422](https://github.com/Yizack/mailchannels/commit/147b422))
- Add npm social link to vitepress config ([a586f6c](https://github.com/Yizack/mailchannels/commit/a586f6c))
- Bump Email API version to 0.16.0 in docs ([#56](https://github.com/Yizack/mailchannels/pull/56))
- Add 'Send an Email Asynchronously' to roadmap ([3a30261](https://github.com/Yizack/mailchannels/commit/3a30261))
- Fix jsdoc indentation ([0a22f44](https://github.com/Yizack/mailchannels/commit/0a22f44))
- **types:** Fix `checkDomain` example return values ([05a2790](https://github.com/Yizack/mailchannels/commit/05a2790))
- **types:** Fix email send examples to include error property ([4f356aa](https://github.com/Yizack/mailchannels/commit/4f356aa))
- Bump email api version to 0.17.0 ([aa2662c](https://github.com/Yizack/mailchannels/commit/aa2662c))
- Fix dark mode search button text and background ([f52ac8a](https://github.com/Yizack/mailchannels/commit/f52ac8a))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.7.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.6.1...v0.7.0)

### 🚀 Enhancements

- ⚠️  Include `statusCode` in error responses ([#47](https://github.com/Yizack/mailchannels/pull/47))

### 🩹 Fixes

- **types:** Improve type safety discriminated union in `DataResponse` ([80a411e](https://github.com/Yizack/mailchannels/commit/80a411e))

### 💅 Refactors

- Error handling in modules for consistency ([#48](https://github.com/Yizack/mailchannels/pull/48))

### 📖 Documentation

- **modules:** Add error response type declaration ([e377d15](https://github.com/Yizack/mailchannels/commit/e377d15))

### 🏡 Chore

- Update eslint config ([1bb32c5](https://github.com/Yizack/mailchannels/commit/1bb32c5))
- **docs:** Lint ([e65fba8](https://github.com/Yizack/mailchannels/commit/e65fba8))

#### ⚠️ Breaking Changes

- ⚠️  Include `statusCode` in error responses ([#47](https://github.com/Yizack/mailchannels/pull/47))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.6.1

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.6.0...v0.6.1)

### 🩹 Fixes

- **metrics:** Add validation for limit and offset in `senders` method ([406dcc2](https://github.com/Yizack/mailchannels/commit/406dcc2))
- Status error parsing resilient beyond ofetch-specific internals (#34 follow-up) ([#44](https://github.com/Yizack/mailchannels/pull/44), [#34](https://github.com/Yizack/mailchannels/issues/34))
- **utils:** Improve recipient parsing and add edge case tests ([d7cf593](https://github.com/Yizack/mailchannels/commit/d7cf593))

### 💅 Refactors

- Add limit and offset validation helpers ([7c3f4f0](https://github.com/Yizack/mailchannels/commit/7c3f4f0))

### 📖 Documentation

- Update requirements section and usage examples ([150e817](https://github.com/Yizack/mailchannels/commit/150e817))
- Update contributors list ([92641f2](https://github.com/Yizack/mailchannels/commit/92641f2))
- **types:** Add data and error description to responses ([5647662](https://github.com/Yizack/mailchannels/commit/5647662))

### 🏡 Chore

- Silence git fetch in docs:build script ([6a5169d](https://github.com/Yizack/mailchannels/commit/6a5169d))
- Update vitest coverage and exclude types ([9be8fa6](https://github.com/Yizack/mailchannels/commit/9be8fa6))
- **emails:** Update some validation messages ([f48786e](https://github.com/Yizack/mailchannels/commit/f48786e))
- **metrics:** Move `mapBuckets` to helpers ([6e5ad75](https://github.com/Yizack/mailchannels/commit/6e5ad75))

### ✅ Tests

- **emails:** Add test for sending email with only text content ([452b99a](https://github.com/Yizack/mailchannels/commit/452b99a))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.6.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.5.0...v0.6.0)

### 🚀 Enhancements

- Update Email API version to `0.15.0` ([#38](https://github.com/Yizack/mailchannels/pull/38))

### 🩹 Fixes

- Improve error handling and defaults ([#34](https://github.com/Yizack/mailchannels/pull/34))
- Add `clean()` helper to recursively remove undefined in mapped responses ([#40](https://github.com/Yizack/mailchannels/pull/40))

### 💅 Refactors

- ⚠️  Standarize responses across entire SDK ([#39](https://github.com/Yizack/mailchannels/pull/39))

### 📖 Documentation

- Improve wording of usage explanations in guide ([4f7fe2d](https://github.com/Yizack/mailchannels/commit/4f7fe2d))
- Update development section to use pnpm commands ([39bea1d](https://github.com/Yizack/mailchannels/commit/39bea1d))
- Fix sidebar anchor links missing `method` suffix ([75ba491](https://github.com/Yizack/mailchannels/commit/75ba491))
- Update readme with new endpoints in progress ([c6f27aa](https://github.com/Yizack/mailchannels/commit/c6f27aa))
- Update README title and image alt text ([36f15b7](https://github.com/Yizack/mailchannels/commit/36f15b7))

### 🏡 Chore

- **utils:** Simplify error payload types ([4c8702d](https://github.com/Yizack/mailchannels/commit/4c8702d))

### ✅ Tests

- Add parse email without name test ([96a4357](https://github.com/Yizack/mailchannels/commit/96a4357))

#### ⚠️ Breaking Changes

- ⚠️  Standarize responses across entire SDK ([#39](https://github.com/Yizack/mailchannels/pull/39))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))
- Ken Simpson <ksimpson@ttul.org>

## v0.5.0

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.7...v0.5.0)

### 💅 Refactors

- ⚠️  Single import pattern module exports + update docs ([#19](https://github.com/Yizack/mailchannels/pull/19))

### 📖 Documentation

- Update disclaimer ([40dd4bc](https://github.com/Yizack/mailchannels/commit/40dd4bc))
- Fix code block highlighting in guide example ([8cae28a](https://github.com/Yizack/mailchannels/commit/8cae28a))
- Badge `tip` type not neccessary ([580e3e9](https://github.com/Yizack/mailchannels/commit/580e3e9))

### 🏡 Chore

- Simplify tsconfig ([6fc6f48](https://github.com/Yizack/mailchannels/commit/6fc6f48))

### ✅ Tests

- Add missing Promise rejection in mock implementations for api error handling scenarios ([4387945](https://github.com/Yizack/mailchannels/commit/4387945))

#### ⚠️ Breaking Changes

- ⚠️  Single import pattern module exports + update docs ([#19](https://github.com/Yizack/mailchannels/pull/19))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.7

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.6...v0.4.7)

### 🩹 Fixes

- **sub-accounts:** Add missing `listApiKeys` options ([d3c8454](https://github.com/Yizack/mailchannels/commit/d3c8454))

### 📖 Documentation

- Add modules list styling to search results ([13291ea](https://github.com/Yizack/mailchannels/commit/13291ea))
- Rename modules source plugin ([7f403c1](https://github.com/Yizack/mailchannels/commit/7f403c1))
- Add `vitepress-plugin-llms` ([ce959d7](https://github.com/Yizack/mailchannels/commit/ce959d7))
- Move `openapi` to `.openapi` to exclude from docs ([ad8ad35](https://github.com/Yizack/mailchannels/commit/ad8ad35))
- **llm:** Ignore contributors page ([66079bb](https://github.com/Yizack/mailchannels/commit/66079bb))
- **emails:** Update max email size error message to 30MB ([771a2db](https://github.com/Yizack/mailchannels/commit/771a2db))
- Prefer `Badge` component slot for better llms.txt ([3711ea0](https://github.com/Yizack/mailchannels/commit/3711ea0))

### 🏡 Chore

- Improve project's `tsconfig.json` ([67bdeed](https://github.com/Yizack/mailchannels/commit/67bdeed))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.6

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.5...v0.4.6)

### 🚀 Enhancements

- **emails:** Update `checkDomain` to support managed or stored DKIM ([dc5692f](https://github.com/Yizack/mailchannels/commit/dc5692f))

### 🩹 Fixes

- **emails:** Allow sending email headers ([dc2ea82](https://github.com/Yizack/mailchannels/commit/dc2ea82))

### 📖 Documentation

- Update Email API version to `0.13.0` ([c1846fc](https://github.com/Yizack/mailchannels/commit/c1846fc))

### 🏡 Chore

- Add MailChannels OpenAPI specs for control ([267d059](https://github.com/Yizack/mailchannels/commit/267d059))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.5

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.4...v0.4.5)

### 📖 Documentation

- Improve readme features list ([7136b82](https://github.com/Yizack/mailchannels/commit/7136b82))
- **lists:** Fix typo ([8e06389](https://github.com/Yizack/mailchannels/commit/8e06389))
- Improve formatting and clarity ([cd6dd19](https://github.com/Yizack/mailchannels/commit/cd6dd19))
- Improve param types and add responses ([#11](https://github.com/Yizack/mailchannels/pull/11))
- **types:** Add missing trailing periods ([695373b](https://github.com/Yizack/mailchannels/commit/695373b))
- Improve params and response style in modules ([1a37d5e](https://github.com/Yizack/mailchannels/commit/1a37d5e))
- **domains:** Improve domain data docs ([bf8c5c1](https://github.com/Yizack/mailchannels/commit/bf8c5c1))

### 🏡 Chore

- Prefer pnpm to run scripts ([3bfeeff](https://github.com/Yizack/mailchannels/commit/3bfeeff))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.4

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.3...v0.4.4)

### 🚀 Enhancements

- **emails:** Include message info in `send` data response ([f706938](https://github.com/Yizack/mailchannels/commit/f706938))

### 📖 Documentation

- Add important note about roadmap links ([df7a81d](https://github.com/Yizack/mailchannels/commit/df7a81d))

### 🏡 Chore

- Configure renovate ([1d72229](https://github.com/Yizack/mailchannels/commit/1d72229))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.3

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.2...v0.4.3)

### 🩹 Fixes

- **emails:** `privateKey` type in `send` method can be undefined ([343657d](https://github.com/Yizack/mailchannels/commit/343657d))

### 📖 Documentation

- **emails:** Mention active dkim keys ([dd23703](https://github.com/Yizack/mailchannels/commit/dd23703))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

## v0.4.2

[compare changes](https://github.com/Yizack/mailchannels/compare/v0.4.1...v0.4.2)

### 🚀 Enhancements

- Update email api `0.12.0` ([02e86f4](https://github.com/Yizack/mailchannels/commit/02e86f4))

### 🩹 Fixes

- **domains:** Fix `bulkCreateLoginLinks` response types ([b61bb65](https://github.com/Yizack/mailchannels/commit/b61bb65))
- **types:** Fix length values ([cfa81e2](https://github.com/Yizack/mailchannels/commit/cfa81e2))
- Remove non existent import ([ad3d43a](https://github.com/Yizack/mailchannels/commit/ad3d43a))

### 📖 Documentation

- Update inbound api version ([aab9149](https://github.com/Yizack/mailchannels/commit/aab9149))
- Add new email api endpoints ([aeb2773](https://github.com/Yizack/mailchannels/commit/aeb2773))
- Fix typos and inconsistencies ([44948a3](https://github.com/Yizack/mailchannels/commit/44948a3))
- **domains:** Fix list description ([6fa040f](https://github.com/Yizack/mailchannels/commit/6fa040f))

### 🏡 Chore

- Build before release tag to avoid fail on github ([57ad31c](https://github.com/Yizack/mailchannels/commit/57ad31c))

### ✅ Tests

- Add patch test ([2bd2446](https://github.com/Yizack/mailchannels/commit/2bd2446))

### ❤️ Contributors

- Yizack Rangel ([@Yizack](https://github.com/Yizack))

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
