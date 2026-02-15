import { getChangelog } from "./git-history";

export const addChangelog = (src: string, module: string): string => {
  const filePath = `src/modules/${module}.ts`;
  const commits = getChangelog(filePath);

  const changelogSection = `\n## Changelog\n\n${commits}\n`;
  return src + changelogSection;
};
