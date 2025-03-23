import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude],
    root: fileURLToPath(new URL("./", import.meta.url)),
    coverage: {
      include: ["src/**/*"]
    },
    setupFiles: ["./test/__setup__.ts"]
  }
});
