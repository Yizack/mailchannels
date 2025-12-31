import { type HeadConfig, defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import llmstxt from "vitepress-plugin-llms";
import sidebarConfig from "./sidebar";
import navbarConfig from "./navbar";
import modulesSourceMd from "./plugins/modules-source-md";
import { SITE } from "./site";

export default defineConfig({
  title: SITE.name,
  lang: "en-US",
  description: SITE.description,
  cleanUrls: true,
  lastUpdated: true,
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = [];
    const relativePath = pageData.relativePath.replace(/\.md$/, "").replace(/index$/, "");
    const path = relativePath === "index" ? "" : `/${relativePath}`;
    const title = pageData.title ? `${pageData.title} | ${SITE.name}` : SITE.name;
    const url = `${SITE.host}` + path;
    const cover = `${SITE.host}/${SITE.cover}`;
    const tags: HeadConfig[] = [
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: SITE.description }],
      ["meta", { property: "og:image", content: cover }],
      ["meta", { property: "og:image:width", content: "750" }],
      ["meta", { property: "og:image:height", content: "375" }],
      ["meta", { property: "og:image:alt", content: SITE.name }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:image", content: cover }],
      ["link", { rel: "canonical", href: url }]
    ];
    head.push(...tags);
    return head;
  },
  head: [
    ["meta", { name: "robots", content: "index, follow" }],
    ["meta", { name: "theme-color", content: "#319B42" }],
    ["link", { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["meta", { name: "apple-mobile-web-app-title", content: SITE.name }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }]
  ],
  markdown: {
    config (md) {
      md.use(groupIconMdPlugin);
      md.use(modulesSourceMd);
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin(),
      llmstxt({
        ignoreFiles: ["contributors.md"]
      })
    ]
  },
  sitemap: {
    hostname: SITE.host
  },
  themeConfig: {
    nav: navbarConfig,
    sidebar: sidebarConfig,
    socialLinks: [
      { icon: "github", link: "https://github.com/Yizack/mailchannels" },
      { icon: "npm", link: "https://www.npmjs.com/package/mailchannels-sdk" }
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
