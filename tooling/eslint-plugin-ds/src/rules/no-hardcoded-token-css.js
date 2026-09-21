import { findHardcodedStyle, findHardcodedValue } from "../patterns.js";

const MESSAGE =
  "Hard-coded {{ found }}. Use a design token or semantic variable (e.g. var(--color-primary), var(--radius-md)). " +
  "If the token is missing, add it to packages/tokens. Exceptions need a disable comment that explains why.";

const UNCHECKED_PROPERTY = /^(?:padding|margin|gap|rowGap|columnGap)/;

const kebabToCamel = (name) => name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: { description: "Disallow hard-coded color, radius, shadow and z-index values in shared CSS." },
    schema: [],
    messages: { hardcoded: MESSAGE }
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Declaration(node) {
        // Custom property definitions are where values are allowed to live (tokens.css, semantic layer).
        if (node.property.startsWith("--")) return;

        const value = sourceCode.getText(node.value).trim();
        const property = kebabToCamel(node.property);
        // Spacing is intentionally not checked in CSS: hairlines (1px borders, 2px focus ring) are legitimate.
        const found =
          findHardcodedValue(value) ?? (UNCHECKED_PROPERTY.test(property) ? null : findHardcodedStyle(property, value));
        if (found) context.report({ node, messageId: "hardcoded", data: { found } });
      }
    };
  }
};
