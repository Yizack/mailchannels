import { getChangelog } from "./changelog-list-md";

export const addChangelog = (src: string, module: string): string => {
  const moduleChangelog = getChangelog(`src/modules/${module}.ts`);

  const changelogSection = `\n## Changelog\n\n${moduleChangelog}\n`;
  return src + changelogSection;
};
