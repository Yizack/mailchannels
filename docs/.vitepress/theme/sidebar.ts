export default [
  {
    text: "Getting Started",
    link: "/guide"
  },
  {
    text: "Email API",
    collapsed: false,
    items: [
      { text: "Send", link: "/modules/emails/send" },
      { text: "Check Domain", link: "/modules/emails/check-domain" },
      {
        text: "Webhooks",
        collapsed: true,
        items: [
          { text: "Enroll for Webhook", link: "/modules/emails/webhooks#enroll-method" },
          { text: "List Webhooks", link: "/modules/emails/webhooks#list-method" },
          { text: "Delete Webhooks", link: "/modules/emails/webhooks#delete-method" },
          { text: "Get Signing Key", link: "/modules/emails/webhooks#signing-key-method" }
        ]
      },
      {
        text: "Sub Accounts",
        collapsed: true,
        items: [
          { text: "List Sub Accounts", link: "/modules/emails/sub-accounts#list-method" }
        ]
      }
    ]
  }
];
