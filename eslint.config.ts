import { resolve } from "node:path";
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import parserTs from "@typescript-eslint/parser";
import stylisticPlugin from "@stylistic/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import-x";

export default defineConfig([
  includeIgnoreFile(resolve(".gitignore")),
  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts"],
    plugins: {
      "@stylistic": stylisticPlugin,
      // @ts-expect-error typescript plugin
      "@typescript-eslint": tsPlugin,
      // @ts-expect-error import plugin
      "import": importPlugin
    },
    languageOptions: {
      parser: parserTs
    },
    rules: {
      "camelcase": "off",
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/no-mutable-exports": "error",
      "import/no-named-default": "error",
      "import/no-self-import": "error",
      "import/order": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/no-extra-semi": "error",
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/space-before-function-paren": ["error", "always"],
      "@stylistic/multiline-ternary": ["error", "never"],
      "@stylistic/member-delimiter-style": ["error", { multiline: { delimiter: "semi" }, singleline: { delimiter: "comma" } }],
      "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
      "@stylistic/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/block-spacing": ["error", "always"],
      "@stylistic/comma-spacing": ["error", { after: true, before: false }],
      "@stylistic/comma-style": ["error", "last"],
      "@stylistic/key-spacing": ["error", { afterColon: true, beforeColon: false }],
      "@stylistic/keyword-spacing": ["error", { after: true, before: true }],
      "@stylistic/object-curly-newline": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "@stylistic/one-component-per-file": "off",
      "@stylistic/require-default-prop": "off",
      "@stylistic/space-in-parens": ["error", "never"],
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@stylistic/arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
      "@stylistic/function-call-spacing": ["error", "never"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error"
    }
  }
]);
