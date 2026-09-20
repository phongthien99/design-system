import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@/components/ui": path.resolve(dirname, "company/ui"),
      "@/lib/utils": path.resolve(dirname, "company/ui/utils/utils.ts")
    }
  },
  test: {
    environment: "jsdom",
    include: ["registry/company/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./registry/test-setup.ts"]
  }
});
