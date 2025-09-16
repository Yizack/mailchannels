import { version } from "../../package.json";

export default [
  { text: "Guide", link: "/guide" },
  { text: "Modules", link: "/modules", activeMatch: "/modules*" },
  {
    text: version,
    items: [
      { text: "Changelog", link: "https://github.com/Yizack/mailchannels/blob/main/CHANGELOG.md" }
    ]
  }
];
