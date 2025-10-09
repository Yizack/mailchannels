import type MarkdownIt from "markdown-it";

const URL = "https://github.com/Yizack/mailchannels/blob/main";

export const modulesSource = (md: MarkdownIt) => {
  const render = md.render.bind(md);
  md.render = function (src, env = {}) {
    if (env.relativePath && env.relativePath.startsWith("modules/")) {
      const slug = env.relativePath.split("/").pop()?.replace(/\.md$/, "");

      const links = ([
        ["Source", `${URL}/src/modules/${slug}.ts`],
        ["Playground", `${URL}/playground/${slug}`],
        ["Docs", `${URL}/docs/modules/${slug}.md`]
      ]).filter(i => i)
        .map(i => `[${i![0]}](${i![1]})`)
        .join(" • ");

      const sourceSection = `\n## Source\n\n${links}\n`;
      src += sourceSection;
    }
    return render(src, env);
  };
};
