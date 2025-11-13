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
              { text: "Send Email", link: "/modules/emails#send-method" },
              { text: "Check Domain", link: "/modules/emails#check-domain-method" },
              { text: "Create DKIM Key", link: "/modules/emails#create-dkim-key-method" },
              { text: "Get DKIM Keys", link: "/modules/emails#get-dkim-keys-method" },
              { text: "Update DKIM Key", link: "/modules/emails#update-dkim-key-method" }
            ]
          },
          {
            text: "📢 Webhooks",
            collapsed: true,
            link: "/modules/webhooks",
            items: [
              { text: "Enroll for Webhook", link: "/modules/webhooks#enroll-method" },
              { text: "List Webhooks", link: "/modules/webhooks#list-method" },
              { text: "Delete Webhooks", link: "/modules/webhooks#delete-method" },
              { text: "Get Signing Key", link: "/modules/webhooks#signing-key-method" },
              { text: "Validate Webhooks", link: "/modules/webhooks#validate-method" }
            ]
          },
          {
            text: "🪪 Sub-accounts",
            collapsed: true,
            link: "/modules/sub-accounts",
            items: [
              { text: "Create Sub-account", link: "/modules/sub-accounts#create-method" },
              { text: "List Sub-accounts", link: "/modules/sub-accounts#list-method" },
              { text: "Delete Sub-account", link: "/modules/sub-accounts#delete-method" },
              { text: "Create API Key", link: "/modules/sub-accounts#create-api-key-method" },
              { text: "Delete API Key", link: "/modules/sub-accounts#delete-api-key-method" },
              { text: "List API Keys", link: "/modules/sub-accounts#list-api-keys-method" },
              { text: "Create SMTP Password", link: "/modules/sub-accounts#create-smtp-password-method" },
              { text: "List SMTP Passwords", link: "/modules/sub-accounts#list-smtp-passwords-method" },
              { text: "Delete SMTP Password", link: "/modules/sub-accounts#delete-smtp-password-method" },
              { text: "Get Limit", link: "/modules/sub-accounts#get-limit-method" },
              { text: "Set Limit", link: "/modules/sub-accounts#set-limit-method" },
              { text: "Delete Limit", link: "/modules/sub-accounts#delete-limit-method" },
              { text: "Get Usage", link: "/modules/sub-accounts#get-usage-method" }
            ]
          },
          {
            text: "📊 Metrics",
            collapsed: true,
            link: "/modules/metrics",
            items: [
              { text: "Engagement", link: "/modules/metrics#engagement-method" },
              { text: "Performance", link: "/modules/metrics#performance-method" },
              { text: "Recipient Behaviour", link: "/modules/metrics#recipient-behaviour-method" },
              { text: "Volume", link: "/modules/metrics#volume-method" },
              { text: "Usage", link: "/modules/metrics#usage-method" }
            ]
          },
          {
            text: "🚫 Suppressions",
            collapsed: true,
            link: "/modules/suppressions",
            items: [
              { text: "Create Suppression", link: "/modules/suppressions#create-method" },
              { text: "Delete Suppression", link: "/modules/suppressions#delete-method" },
              { text: "List Suppressions", link: "/modules/suppressions#list-method" }
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
              { text: "Provision Domain", link: "/modules/domains#provision-method" },
              { text: "Bulk Provision Domains", link: "/modules/domains#bulk-provision-method" },
              { text: "List Domains", link: "/modules/domains#list-method" },
              { text: "Delete Domain", link: "/modules/domains#delete-method" },
              { text: "Add List Entry", link: "/modules/domains#add-list-entry-method" },
              { text: "List Entries", link: "/modules/domains#list-entries-method" },
              { text: "Delete List Entry", link: "/modules/domains#delete-list-entry-method" },
              { text: "Create Login Link", link: "/modules/domains#create-login-link-method" },
              { text: "Set Downstream Address", link: "/modules/domains#set-downstream-address-method" },
              { text: "List Downstream Addresses", link: "/modules/domains#list-downstream-addresses-method" },
              { text: "Update API Key", link: "/modules/domains#update-api-key-method" },
              { text: "Bulk Create Login Links", link: "/modules/domains#bulk-create-login-links-method" }
            ]
          },
          {
            text: "📋 Lists",
            collapsed: true,
            link: "/modules/lists",
            items: [
              { text: "Add List Entry", link: "/modules/lists#add-list-entry-method" },
              { text: "List Entries", link: "/modules/lists#list-entries-method" },
              { text: "Delete List Entry", link: "/modules/lists#delete-list-entry-method" }
            ]
          },
          {
            text: "📥 Users",
            collapsed: true,
            link: "/modules/users",
            items: [
              { text: "Create User", link: "/modules/users#create-method" },
              { text: "Add List Entry", link: "/modules/users#add-list-entry-method" },
              { text: "List Entries", link: "/modules/users#list-entries-method" },
              { text: "Delete List Entry", link: "/modules/users#delete-list-entry-method" }
            ]
          },
          {
            text: "⚙️ Service",
            collapsed: true,
            link: "/modules/service",
            items: [
              { text: "Status", link: "/modules/service#status-method" },
              { text: "Subscriptions", link: "/modules/service#subscriptions-method" },
              { text: "Report", link: "/modules/service#report-method" }
            ]
          }
        ]
      }
    ]
  }
] satisfies DefaultTheme.SidebarItem[];
