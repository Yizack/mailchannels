import { version } from "../../package.json";
import { SITE } from "./site";

export default [
  { text: "Get Started", link: "/getting-started" },
  { text: "Modules", link: "/modules", activeMatch: "/modules*" },
  { text: "Guides", link: "/guides", activeMatch: "/guides*" },
  {
    text: version,
    items: [
      { text: "Changelog", link: `${SITE.repo}/blob/main/CHANGELOG.md` }
    ]
  }
];
