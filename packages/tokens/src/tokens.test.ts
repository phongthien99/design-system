import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as tokens from "./index";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "tokens.css"), "utf8");

const cssVars = new Map(
  [...css.matchAll(/^\s*(--ds-[\w-]+):\s*(.+);$/gm)].map(([, name, value]) => [name, normalize(value)])
);

// TS export → CSS variable prefix. `typography` keys are already named font-* / line-height-*, so no prefix.
// `breakpoints` intentionally has no CSS variable yet.
const prefixes: Record<string, string> = {
  colors: "color",
  spacing: "spacing",
  radius: "radius",
  typography: "",
  shadow: "shadow",
  zIndex: "z-index",
  sizing: "size",
  motion: "",
  grid: "grid"
};

function normalize(value: string) {
  return value.replaceAll("'", '"').replace(/\s+/g, " ").trim();
}

function kebab(value: string) {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function flatten(value: unknown, path: string[]): [string, string][] {
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, child]) => flatten(child, [...path, kebab(key)]));
  }

  return [[`--ds-${path.filter(Boolean).join("-")}`, normalize(String(value))]];
}

const fromTs = new Map(
  Object.entries(prefixes).flatMap(([exportName, prefix]) =>
    flatten((tokens as Record<string, unknown>)[exportName], [prefix])
  )
);

describe("tokens.css and index.ts stay in sync", () => {
  it("defines every TS token as a CSS variable with the same value", () => {
    for (const [name, value] of fromTs) {
      expect(cssVars.get(name), name).toBe(value);
    }
  });

  it("exports every CSS variable from TS", () => {
    for (const name of cssVars.keys()) {
      expect(fromTs.has(name), name).toBe(true);
    }
  });
});
