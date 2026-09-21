import css from "@eslint/css";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import tseslint from "typescript-eslint";
import plugin from "./index.js";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tsTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } }
  }
});

const cssTester = new RuleTester({ plugins: { css }, language: "css/css" });

const bad = (code, found) => ({ code, errors: [{ messageId: "hardcoded", data: { found } }] });

tsTester.run("ds/no-hardcoded-token", plugin.rules["no-hardcoded-token"], {
  valid: [
    `const a = <div className="ds-button ds-button--md" />;`,
    `const a = <div className="rounded-md bg-primary p-4 z-modal" />;`,
    `const a = <div className="p-[var(--ds-spacing-3)] bg-[--color-primary] bg-[url(/a.png)]" />;`,
    `const a = <div className="hover:bg-primary [&>svg]:p-2" />;`,
    `const a = <div style={{ borderRadius: "var(--radius-md)", padding: "var(--ds-spacing-2)" }} />;`,
    `const a = <div style={{ color: "inherit", background: "transparent", zIndex: 0, padding: 0, margin: "0 auto" }} />;`,
    `const a = <div style={{ width: 24, height: "1.5rem", opacity: 0.5 }} />;`,
    `const a = <a href="&#39;">#main</a>;`,
    "const a = `ds-input ds-input--${size}`;"
  ],
  invalid: [
    bad(`const a = "#1677ff";`, 'hex color "#1677ff"'),
    bad(`const a = "border-[#fff]";`, 'hex color "#fff"'),
    bad(`const a = "rgba(0, 0, 0, 0.4)";`, 'color function "rgba("'),
    bad(`const a = "hsl(210 40% 96%)";`, 'color function "hsl("'),
    bad(`const a = <div className="rounded-[6px]" />;`, 'Tailwind arbitrary value "rounded-[6px]"'),
    bad(`const a = <div className="hover:p-[13px]" />;`, 'Tailwind arbitrary value "p-[13px]"'),
    bad(`const a = <div className="z-[999]" />;`, 'Tailwind arbitrary value "z-[999]"'),
    bad(`const a = <div className="shadow-[0_1px_2px_#000]" />;`, 'Tailwind arbitrary value "shadow-[0_1px_2px_#000]"'),
    bad(`const a = <div className="[&>svg]:mt-[3px]" />;`, 'Tailwind arbitrary value "mt-[3px]"'),
    bad("const a = `bg-[#abc] ${x}`;", 'hex color "#abc"'),
    bad(`const a = <div style={{ borderRadius: 6 }} />;`, 'radius "6"'),
    bad(`const a = <div style={{ borderRadius: "50%" }} />;`, 'radius "50%"'),
    bad(`const a = <div style={{ zIndex: 999 }} />;`, 'z-index "999"'),
    bad(`const a = <div style={{ boxShadow: "0 1px 2px black" }} />;`, 'shadow "0 1px 2px black"'),
    bad(`const a = <div style={{ padding: 13 }} />;`, 'spacing "13"'),
    bad(`const a = <div style={{ marginTop: "12px" }} />;`, 'spacing "12px"'),
    bad(`const a = <div style={{ gap: "0.75rem" }} />;`, 'spacing "0.75rem"'),
    bad(`const a = <div style={{ background: "red" }} />;`, 'color "red"'),
    bad(`const a = <div style={{ borderColor: "tomato" }} />;`, 'color "tomato"'),
    // A hex inside a style value is reported once, not twice.
    bad(`const a = <div style={{ color: "#fff" }} />;`, 'hex color "#fff"')
  ]
});

cssTester.run("ds/no-hardcoded-token-css", plugin.rules["no-hardcoded-token-css"], {
  valid: [
    `.a { color: var(--color-foreground); border-radius: var(--radius-md); z-index: var(--z-index-modal); }`,
    `.a { --color-x: #fff; }`,
    `.a { border: 1px solid transparent; outline: 2px solid var(--color-ring); padding: 2px; }`,
    `.a { background: none; color: currentColor; z-index: 0; border-radius: 0; box-shadow: none; }`,
    `.a { background: color-mix(in srgb, var(--color-primary) 10%, transparent); }`,
    `.a { border-radius: var(--radius-sm) var(--radius-sm) 0 0; }`
  ],
  invalid: [
    bad(`.a { background: rgb(17 24 39 / 0.45); }`, 'color function "rgb("'),
    bad(`.a { border-color: #ccc; }`, 'hex color "#ccc"'),
    bad(`.a { border-radius: 6px; }`, 'radius "6px"'),
    bad(`.a { border-radius: 50%; }`, 'radius "50%"'),
    bad(`.a { box-shadow: 0 1px 2px black; }`, 'shadow "0 1px 2px black"'),
    bad(`.a { z-index: 999; }`, 'z-index "999"'),
    bad(`.a { background: red; }`, 'color "red"')
  ]
});
