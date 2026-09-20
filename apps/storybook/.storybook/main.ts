import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, "../../..");

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../../../packages/patterns/src/**/*.stories.@(ts|tsx)",
    "../../../registry/stories/**/*.stories.@(ts|tsx)",
    "../../../registry/personal/stories/**/*.stories.@(ts|tsx)"
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest", "@chromatic-com/storybook"],
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
      }
    ];

    config.resolve.alias = Array.isArray(config.resolve.alias) ? [...aliases, ...config.resolve.alias] : aliases;

    // Registry `@/` imports resolve against the registry copy that owns the importing file:
    // registry/personal/** uses its own ui/, everything else uses registry/company/ui.
    const personalDir = resolve(rootDir, "registry/personal");
    config.plugins = [
      ...(config.plugins ?? []),
      {
        name: "registry-at-aliases",
        enforce: "pre",
        async resolveId(source, importer, options) {
          const uiDir = importer?.startsWith(`${personalDir}/`)
            ? resolve(personalDir, "ui")
            : resolve(rootDir, "registry/company/ui");
          const target =
            source === "@/lib/utils"
              ? resolve(uiDir, "utils/utils.ts")
              : source.startsWith("@/components/ui/")
                ? resolve(uiDir, source.slice("@/components/ui/".length))
                : null;

          return target ? this.resolve(target, importer, { ...options, skipSelf: true }) : null;
        }
      }
    ];

    return config;
  }
};

export default config;
