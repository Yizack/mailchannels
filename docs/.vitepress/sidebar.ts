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
              { text: "Get Signing Key", link: "/modules/webhooks#signing-key" },
              { text: "Validate Webhooks", link: "/modules/webhooks#validate" }
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
              { text: "Delete SMTP Password", link: "/modules/sub-accounts#delete-smtp-password" },
              { text: "Get Limit", link: "/modules/sub-accounts#get-limit" },
              { text: "Set Limit", link: "/modules/sub-accounts#set-limit" },
              { text: "Delete Limit", link: "/modules/sub-accounts#delete-limit" },
              { text: "Get Usage", link: "/modules/sub-accounts#get-usage" }
            ]
          },
          {
            text: "📊 Metrics",
            collapsed: true,
            link: "/modules/metrics",
            items: [
              { text: "Engagement", link: "/modules/metrics#engagement" },
              { text: "Performance", link: "/modules/metrics#performance" },
              { text: "Recipient Behaviour", link: "/modules/metrics#recipient-behaviour" },
              { text: "Volume", link: "/modules/metrics#volume" },
              { text: "Usage", link: "/modules/metrics#usage" }
            ]
          },
          {
            text: "🚫 Suppressions",
            collapsed: true,
            link: "/modules/suppressions",
            items: [
              { text: "Create Suppression", link: "/modules/suppressions#create" },
              { text: "Delete Suppression", link: "/modules/suppressions#delete" },
              { text: "List Suppressions", link: "/modules/suppressions#list" }
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
              { text: "Bulk Provision Domains", link: "/modules/domains#bulk-provision" },
              { text: "List Domains", link: "/modules/domains#list" },
              { text: "Delete Domain", link: "/modules/domains#delete" },
              { text: "Add List Entry", link: "/modules/domains#add-list-entry" },
              { text: "List Entries", link: "/modules/domains#list-entries" },
              { text: "Delete List Entry", link: "/modules/domains#delete-list-entry" },
              { text: "Create Login Link", link: "/modules/domains#create-login-link" },
              { text: "Set Downstream Address", link: "/modules/domains#set-downstream-address" },
              { text: "List Downstream Addresses", link: "/modules/domains#list-downstream-addresses" },
              { text: "Update API Key", link: "/modules/domains#update-api-key" },
              { text: "Bulk Create Login Links", link: "/modules/domains#bulk-create-login-links" }
            ]
          },
          {
            text: "📋 Lists",
            collapsed: true,
            link: "/modules/lists",
            items: [
              { text: "Add List Entry", link: "/modules/lists#add-list-entry" },
              { text: "List Entries", link: "/modules/lists#list-entries" },
              { text: "Delete List Entry", link: "/modules/lists#delete-list-entry" }
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
              { text: "Subscriptions", link: "/modules/service#subscriptions" },
              { text: "Report", link: "/modules/service#report" }
            ]
          }
        ]
      }
    ]
  }
] satisfies DefaultTheme.SidebarItem[];
