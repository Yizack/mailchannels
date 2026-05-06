import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "virtual:group-icons.css";
import "./assets/css/theme.css";
import "./assets/css/fonts.css";
import VPExamples from "./components/VPExamples.vue";

export default <Theme>{
  extends: DefaultTheme,
  enhanceApp ({ app }) {
    app.component("VPExamples", VPExamples);
  }
};
