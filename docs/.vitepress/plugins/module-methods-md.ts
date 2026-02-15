import type { DefaultTheme } from "vitepress";
import type MarkdownIt from "markdown-it";
import sidebar from "../sidebar";

function findModuleSection (items: DefaultTheme.SidebarItem[], moduleLink: string): DefaultTheme.SidebarItem | null {
  for (const item of items) {
    if (item.link === moduleLink) return item;
    if (item.items) {
      const found = findModuleSection(item.items, moduleLink);
      if (found) return found;
    }
  }
  return null;
}

export default (md: MarkdownIt) => {
  const render = md.render.bind(md);
  md.render = (src, env = {}) => {
    const [folder, module, slug] = env.relativePath.replace(/\.md$/, "").split("/");
    if (folder === "modules" && slug === "index") {
      const moduleLink = `/modules/${module}`;
      const moduleSection = findModuleSection(sidebar, moduleLink);
      if (moduleSection && moduleSection.items) {
        const methodsList = moduleSection.items.map(method => `- [${method.text}](${method.link})`).join("\n");
        if (methodsList) {
          src = src.replace(/::methods-list::/g, methodsList);
        }
      }
    }
    return render(src, env);
  };
};
