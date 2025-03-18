import { fileURLToPath } from "node:url";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude],
    root: fileURLToPath(new URL("./", import.meta.url)),
    coverage: {
      include: ["src/**/*"]
    }
  }
});
