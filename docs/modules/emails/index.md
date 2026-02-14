# 📧 Emails <Badge>module</Badge> <Badge>Email API</Badge>

<!-- #region description -->
This module allows you to send emails and check domain settings for secure email delivery.
<!-- #endregion description -->

## Methods

::methods-list::

## Type declarations

<<< @/snippets/emails.ts

<details>
  <summary>All type declarations</summary>

  **Response type declarations**

  <<< @/snippets/error-response.ts
  <<< @/snippets/data-response.ts
  <<< @/snippets/success-response.ts

  **Send type declarations**

  <<< @/snippets/emails-send-options.ts
  <<< @/snippets/emails-send-options-base.ts
  <<< @/snippets/emails-send-attachment.ts
  <<< @/snippets/emails-send-recipient.ts
  <<< @/snippets/emails-send-tracking.ts
  <<< @/snippets/emails-send-response.ts

  **Send Async type declarations**

  <<< @/snippets/emails-send-async-response.ts

  **Check Domain type declarations**

  <<< @/snippets/emails-check-domain-options.ts
  <<< @/snippets/emails-check-domain-response.ts
  <<< @/snippets/emails-check-domain-verdict.ts
  <<< @/snippets/emails-check-domain-dkim.ts

  **Create DKIM Key type declarations**

  <<< @/snippets/emails-create-dkim-key-options.ts
  <<< @/snippets/emails-dkim-key-status.ts
  <<< @/snippets/emails-dkim-key.ts
  <<< @/snippets/emails-create-dkim-key-response.ts

  **Get DKIM Keys type declarations**

  <<< @/snippets/emails-get-dkim-keys-options.ts
  <<< @/snippets/optional.ts
  <<< @/snippets/emails-get-dkim-keys-response.ts

  **Update DKIM Key type declarations**

  <<< @/snippets/emails-update-dkim-key-options.ts

  **Rotate DKIM Key type declarations**

  <<< @/snippets/emails-rotate-dkim-key-options.ts
  <<< @/snippets/emails-rotate-dkim-key-response.ts
</details>
