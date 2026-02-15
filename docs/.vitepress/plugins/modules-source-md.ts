import type MarkdownIt from "markdown-it";

const URL = "https://github.com/Yizack/mailchannels/blob/main";

export default (md: MarkdownIt) => {
  const render = md.render.bind(md);
  md.render = (src, env = {}) => {
    const [folder, module, slug] = env.relativePath.replace(/\.md$/, "").split("/");
    if (folder === "modules") {
      const links = ([
        ["Source", `${URL}/src/modules/${module}.ts`],
        ["Playground", `${URL}/playground/${module}` + (slug !== "index" ? `/${slug}.ts` : "")],
        ["Docs", `${URL}/docs/modules/${module}/${slug}.md`]
      ]).filter(i => i)
        .map(i => `[${i![0]}](${i![1]})`)
        .join(" • ");

      const sourceSection = `\n## Source\n\n${links}\n`;
      src += sourceSection;
    }
    return render(src, env);
  };
};
