import css from "@eslint/css";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import ds from "./tooling/eslint-plugin-ds/src/index.js";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**", "**/.turbo/**", "registry/personal/**"]
  },
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended]
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    languageOptions: { globals: globals.browser },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["**/*.{js,mjs}", "tooling/**/*.ts", "**/*.config.ts", "vitest.workspace.ts"],
    languageOptions: { globals: globals.node }
  },
  {
    // Story previews receive arbitrary props from Storybook Controls.
    files: ["registry/stories/**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-explicit-any": "off" }
  },
  {
    // Hard-code rule (docs/03-design-token-rules.md#hard-code-rule): shared components must use tokens.
    files: ["registry/company/ui/**/*.{ts,tsx}", "packages/{icons,patterns,primitives,theme}/src/**/*.{ts,tsx}"],
    ignores: ["**/*.{test,stories}.{ts,tsx}"],
    plugins: { ds },
    rules: { "ds/no-hardcoded-token": "error" }
  },
  {
    // tokens.css is the one place raw values live; every other shared stylesheet must reference them.
    files: ["packages/theme/src/**/*.css"],
    language: "css/css",
    plugins: { css, ds },
    rules: { "ds/no-hardcoded-token-css": "error" }
  },
  prettier
);
