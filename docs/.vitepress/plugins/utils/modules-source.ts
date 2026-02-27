import { camelCase } from "scule";
import { getMethodLineNumber } from "./methods-line-number";

const URL = "https://github.com/Yizack/mailchannels/blob/main";

export const addSourceLinks = (src: string, module: string, slug: string): string => {
  let sourceUrl = `${URL}/src/modules/${module}.ts`;
  let playgroundUrl = `${URL}/playground/${module}`;
  let docsUrl = `${URL}/docs/modules/${module}/${slug}.md`;
  let testsUrl = `${URL}/test/modules/${module}`;

  if (slug !== "index") {
    playgroundUrl += `/${slug}.ts`;
    testsUrl += `/${slug}.test.ts`;
    const lineNumber = getMethodLineNumber(module, camelCase(slug));
    if (lineNumber) {
      sourceUrl += `#L${lineNumber}`;
    }
  }

  const links = ([
    ["Source", sourceUrl],
    ["Playground", playgroundUrl],
    ["Docs", docsUrl],
    ["Tests", testsUrl]
  ]).filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`)
    .join(" • ");

  const sourceSection = `\n## Source\n\n${links}\n`;
  return src + sourceSection;
};
