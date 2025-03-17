import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: [
    "./src/mailchannels",
    "./src/modules/emails/index"
  ]
});
