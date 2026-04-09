import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    isolate: false,
    root: fileURLToPath(new URL("./", import.meta.url)),
    server: {
      deps: {
        inline: ["ofetch"]
      }
    },
    coverage: {
      include: ["src"],
      exclude: ["src/types"]
    },
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
