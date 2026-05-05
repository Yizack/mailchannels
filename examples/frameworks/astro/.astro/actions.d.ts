import type * as ActionsModule from "E:/GitHub/mailchannels/examples/astro/src/actions/index.ts";

declare module "astro:actions" {
  export const actions: typeof ActionsModule["server"];
}
