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
        collapsed: true,
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
        collapsed: true,
        link: "/modules/sub-accounts",
        items: [
          { text: "Create Sub-account", link: "/modules/sub-accounts#create" },
          { text: "List Sub-accounts", link: "/modules/sub-accounts#list" },
          { text: "Delete Sub-account", link: "/modules/sub-accounts#delete" },
          { text: "Create API Key", link: "/modules/sub-accounts#create-api-key" },
          { text: "Delete API Key", link: "/modules/sub-accounts#delete-api-key" },
          { text: "List API Keys", link: "/modules/sub-accounts#list-api-keys" },
          { text: "Create SMTP Password", link: "/modules/sub-accounts#create-smtp-password" },
          { text: "List SMTP Passwords", link: "/modules/sub-accounts#list-smtp-passwords" },
          { text: "Delete SMTP Password", link: "/modules/sub-accounts#delete-smtp-password" }
        ]
      },
      {
        text: "⚙️ Service",
        collapsed: true,
        link: "/modules/service",
        items: [
          { text: "Status", link: "/modules/service#status" },
          { text: "Subscriptions", link: "/modules/service#subscriptions" }
        ]
      }
    ]
  }
];
