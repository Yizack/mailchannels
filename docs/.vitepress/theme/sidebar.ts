export default [
  {
    text: "Getting Started",
    link: "/guide"
  },
  {
    text: "Contributors",
    link: "/contributors"
  },
  {
    text: "Modules",
    collapsed: false,
    link: "/modules",
    items: [
      {
        text: "📧 Emails",
        collapsed: false,
        link: "/modules/emails",
        items: [
          { text: "Send", link: "/modules/emails#send" },
          { text: "Check Domain", link: "/modules/emails#check-domain" }
        ]
      },
      {
        text: "📢 Webhooks",
        collapsed: false,
        link: "/modules/webhooks",
        items: [
          { text: "Enroll for Webhook", link: "/modules/webhooks#enroll" },
          { text: "List Webhooks", link: "/modules/webhooks#list" },
          { text: "Delete Webhooks", link: "/modules/webhooks#delete" },
          { text: "Get Signing Key", link: "/modules/webhooks#signing-key" }
        ]
      },
      {
        text: "🪪 Sub-accounts",
        collapsed: false,
        link: "/modules/sub-accounts",
        items: [
          { text: "Create Sub-account", link: "/modules/sub-accounts#create" },
          { text: "List Sub-accounts", link: "/modules/sub-accounts#list" }
        ]
      }
    ]
  }
];
