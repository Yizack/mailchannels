export default [
  {
    text: "Getting Started",
    link: "/guide"
  },
  {
    text: "Email API",
    collapsed: false,
    items: [
      {
        text: "Emails",
        collapsed: false,
        items: [
          { text: "Send", link: "/modules/emails#send" },
          { text: "Check Domain", link: "/modules/emails#check-domain" }
        ]
      },
      {
        text: "Webhooks",
        collapsed: false,
        items: [
          { text: "Enroll for Webhook", link: "/modules/webhooks#enroll" },
          { text: "List Webhooks", link: "/modules/webhooks#list" },
          { text: "Delete Webhooks", link: "/modules/webhooks#delete" },
          { text: "Get Signing Key", link: "/modules/webhooks#signing-key" }
        ]
      },
      {
        text: "Sub-accounts",
        collapsed: false,
        items: [
          { text: "List Sub-accounts", link: "/modules/sub-accounts#list" }
        ]
      }
    ]
  }
];
