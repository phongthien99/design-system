// Detection helpers shared by the JS/TS and CSS rules. Doc: docs/03-design-token-rules.md#hard-code-rule

/** #rgb, #rgba, #rrggbb, #rrggbbaa (not part of a longer word, so "#main" or "&#39;" do not match). */
const HEX_COLOR = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![\w-])/i;

const COLOR_FUNCTION = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i;

/**
 * Tailwind arbitrary values on utilities that map to color, radius, spacing, shadow or z-index,
 * e.g. `rounded-[6px]`, `bg-[#fff]`, `p-[13px]`, `z-[999]`. Values that go through a CSS variable
 * (`p-[var(--ds-spacing-3)]`, `bg-[--color-x]`) or `url(...)` are fine.
 */
const TAILWIND_ARBITRARY =
  /(?<=^|[\s!:\]])-?(?:bg|text|border(?:-[xytrblse])?|ring|outline|fill|stroke|shadow|from|via|to|decoration|accent|caret|divide|rounded(?:-[a-z]{1,2})?|p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|z)-\[([^\]]+)\]/g;

/** @returns {string | null} a short description of the first hard-coded value found in `text`, or null. */
export function findHardcodedValue(text) {
  const hex = HEX_COLOR.exec(text);
  if (hex) return `hex color "${hex[0]}"`;

  const fn = COLOR_FUNCTION.exec(text);
  if (fn) return `color function "${fn[0]}"`;

  for (const match of text.matchAll(TAILWIND_ARBITRARY)) {
    const value = match[1];
    if (/var\(|^--|url\(/.test(value)) continue;
    return `Tailwind arbitrary value "${match[0].trim()}"`;
  }

  return null;
}

const KEYWORDS = new Set(["inherit", "initial", "unset", "revert", "none", "auto", "currentcolor", "transparent"]);

const COLOR_PROPERTY = /^(?:color|background|fill|stroke)$|Color$/;
const SPACING_PROPERTY =
  /^(?:padding|margin|gap|rowGap|columnGap)(?:Top|Right|Bottom|Left|Block|Inline)?(?:Start|End)?$/;

/**
 * Checks one inline `style` entry (`{ borderRadius: 6 }`). `value` is the literal value.
 * @returns {string | null} a description of the problem, or null when the value is acceptable.
 */
export function findHardcodedStyle(property, value) {
  const isNumber = typeof value === "number";
  const text = String(value).trim();
  if (!isNumber && (text.includes("var(") || KEYWORDS.has(text.toLowerCase()))) return null;

  if (property === "zIndex") {
    return text === "0" || text === "auto" ? null : `z-index "${text}"`;
  }
  if (property === "borderRadius" || /^border(?:Top|Bottom|Start|End)(?:Left|Right|Start|End)Radius$/.test(property)) {
    return text === "0" ? null : `radius "${text}"`;
  }
  if (property === "boxShadow" || property === "textShadow") {
    return `shadow "${text}"`;
  }
  if (SPACING_PROPERTY.test(property)) {
    if (isNumber) return value === 0 ? null : `spacing "${text}"`;
    return /\d(?:px|rem|em)\b/.test(text) && !/^0(?:px|rem|em)?$/.test(text) ? `spacing "${text}"` : null;
  }
  if (COLOR_PROPERTY.test(property) && !isNumber && !text.includes("url(")) {
    return `color "${text}"`;
  }
  return null;
}
