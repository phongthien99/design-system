import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, "../../..");

const config: StorybookConfig = {
  stories: [
    "../../../packages/patterns/src/**/*.stories.@(ts|tsx)",
    "../../../registry/stories/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    const aliases = [
      { find: /^@company\/icons$/, replacement: resolve(rootDir, "packages/icons/src/index.tsx") },
      { find: /^@company\/patterns$/, replacement: resolve(rootDir, "packages/patterns/src/index.ts") },
      { find: /^@company\/primitives$/, replacement: resolve(rootDir, "packages/primitives/src/index.ts") },
      {
        find: /^@company\/primitives\/checkbox$/,
        replacement: resolve(rootDir, "packages/primitives/src/checkbox/index.ts")
      },
      {
        find: /^@company\/primitives\/dialog$/,
        replacement: resolve(rootDir, "packages/primitives/src/dialog/index.ts")
      },
      { find: /^@company\/theme$/, replacement: resolve(rootDir, "packages/theme/src/index.ts") },
      {
        find: /^@company\/theme\/styles\.css$/,
        replacement: resolve(rootDir, "packages/theme/src/styles.css")
      },
      { find: /^@company\/tokens$/, replacement: resolve(rootDir, "packages/tokens/src/index.ts") },
      {
        find: /^@company\/tokens\/tokens\.css$/,
        replacement: resolve(rootDir, "packages/tokens/src/tokens.css")
      },
      { find: /^@\/components\/ui\/(.*)$/, replacement: resolve(rootDir, "registry/company/ui/$1") },
      { find: /^@\/lib\/utils$/, replacement: resolve(rootDir, "registry/company/ui/utils/utils.ts") }
    ];

    config.resolve.alias = Array.isArray(config.resolve.alias)
      ? [...aliases, ...config.resolve.alias]
      : aliases;

    return config;
  }
};

export default config;
