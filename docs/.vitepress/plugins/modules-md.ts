import type MarkdownIt from "markdown-it";
import { addSourceLinks } from "./utils/modules-source";
import { addChangelog } from "./utils/modules-changelog";
import { addMethodsList } from "./utils/module-methods";

export default (md: MarkdownIt) => {
  const render = md.render.bind(md);
  md.render = (src, env = {}) => {
    const [folder, module, slug] = env.relativePath.replace(/\.md$/, "").split("/");
    if (folder === "modules" && module && slug) {
      // Add source links for all module pages
      src = addSourceLinks(src, module, slug);

      // Add methods list and changelog only for index pages
      if (slug === "index") {
        src = addMethodsList(src, module);
        src = addChangelog(src, module);
      }
    }
    return render(src, env);
  };
};
