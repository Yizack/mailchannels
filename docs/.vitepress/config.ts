import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import sidebarConfig from "./theme/sidebar";
import navbarConfig from "./theme/navbar";

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
    nav: navbarConfig,
    sidebar: sidebarConfig,
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
