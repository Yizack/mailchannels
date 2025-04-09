import { type DefaultTheme } from "vitepress";

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
        text: "Email API",
        collapsed: false,
        items: [
          {
            text: "📧 Emails",
            collapsed: true,
            link: "/modules/emails",
            items: [
              { text: "Send Email", link: "/modules/emails#send" },
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
          }
        ]
      },
      {
        text: "Inbound API",
        collapsed: false,
        items: [
          {
            text: "🌐 Domains",
            collapsed: true,
            link: "/modules/domains",
            items: [
              { text: "Provision Domain", link: "/modules/domains#provision" },
              { text: "List Domains", link: "/modules/domains#list" },
              { text: "Delete Domain", link: "/modules/domains#delete" },
              { text: "Add List Entry", link: "/modules/domains#add-list-entry" },
              { text: "Create Login Link", link: "/modules/domains#create-login-link" },
              { text: "Update API Key", link: "/modules/domains#update-api-key" }
            ]
          },
          {
            text: "📥 Users",
            collapsed: true,
            link: "/modules/users",
            items: [
              { text: "Create User", link: "/modules/users#create" },
              { text: "Add List Entry", link: "/modules/users#add-list-entry" },
              { text: "List Entries", link: "/modules/users#list-entries" },
              { text: "Delete List Entry", link: "/modules/users#delete-list-entry" }
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
    ]
  }
] satisfies DefaultTheme.SidebarItem[];
