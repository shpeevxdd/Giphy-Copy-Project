import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",

      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],

      "no-console": "warn"
    },
  },
];
