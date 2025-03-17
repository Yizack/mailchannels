import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

export default defineConfig({
  title: "@yizack/mailchannels",
  dir: ".",
  lang: "en-US",
  description: "MailChannels API library",
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    config (md) {
      md.use(groupIconMdPlugin);
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin()
    ]
  },
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide" },
      { text: "Modules", link: "/modules" },
      { text: "Examples", link: "/examples" }
    ],
    sidebar: [
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
              { text: "Enroll for Webhook", link: "/modules/emails/webhooks/enroll" },
              { text: "Get Webhooks", link: "/modules/emails/webhooks/get-all" },
              { text: "Delete Webhooks", link: "/modules/emails/webhooks/delete" },
              { text: "Get Signing Key", link: "/modules/emails/webhooks/signing-key" }
            ]
          }
        ]
      },
      {
        text: "Examples",
        collapsed: false,
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Yizack/mailchannels" }
    ],
    editLink: {
      pattern: "https://github.com/Yizack/mailchannels/edit/main/docs/:path",
      text: "Suggest changes to this page"
    },
    search: {
      provider: "local"
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Library created by Yizack"
    }
  }
});
