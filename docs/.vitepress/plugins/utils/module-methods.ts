import type { DefaultTheme } from "vitepress";
import sidebar from "../../sidebar";

const findModuleSection = (items: DefaultTheme.SidebarItem[], moduleLink: string): DefaultTheme.SidebarItem | null => {
  for (const item of items) {
    if (item.link === moduleLink) return item;
    if (item.items) {
      const found = findModuleSection(item.items, moduleLink);
      if (found) return found;
    }
  }
  return null;
};

export const addMethodsList = (src: string, module: string): string => {
  const moduleLink = `/modules/${module}`;
  const moduleSection = findModuleSection(sidebar, moduleLink);
  if (moduleSection && moduleSection.items) {
    const methodsList = moduleSection.items.map(method => `- [${method.text}](${method.link})`).join("\n");
    if (methodsList) {
      src = src.replace(/::methods-list::/g, methodsList);
    }
  }
  return src;
};
