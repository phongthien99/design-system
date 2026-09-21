import { findHardcodedStyle, findHardcodedValue } from "../patterns.js";

const MESSAGE =
  "Hard-coded {{ found }}. Use a design token or semantic variable (e.g. var(--color-primary), var(--radius-md)). " +
  "If the token is missing, add it to packages/tokens. Exceptions need a disable comment that explains why.";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hard-coded color, radius, spacing, shadow and z-index values in shared components."
    },
    schema: [],
    messages: { hardcoded: MESSAGE }
  },
  create(context) {
    const report = (node, found) => context.report({ node, messageId: "hardcoded", data: { found } });

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        const found = findHardcodedValue(node.value);
        if (found) report(node, found);
      },
      TemplateElement(node) {
        const found = findHardcodedValue(node.value.cooked ?? node.value.raw);
        if (found) report(node, found);
      },
      // Inline styles: `style={{ borderRadius: 6, zIndex: 999 }}`. Colors in strings are caught by Literal above.
      JSXAttribute(node) {
        if (node.name.name !== "style" || node.value?.type !== "JSXExpressionContainer") return;
        const style = node.value.expression;
        if (style.type !== "ObjectExpression") return;

        for (const property of style.properties) {
          if (property.type !== "Property" || property.value.type !== "Literal") continue;
          const key = property.key.type === "Identifier" ? property.key.name : property.key.value;
          if (typeof key !== "string") continue;
          const found = findHardcodedStyle(key, property.value.value);
          // A string that already tripped the Literal visitor is reported there; avoid a double report.
          if (found && !(typeof property.value.value === "string" && findHardcodedValue(property.value.value))) {
            report(property.value, found);
          }
        }
      }
    };
  }
};
