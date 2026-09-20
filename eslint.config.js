import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**", "**/.turbo/**", "registry/personal/**"]
  },
  js.configs.recommended,
  tseslint.configs.recommended,
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
  prettier
);
