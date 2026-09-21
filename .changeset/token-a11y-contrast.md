---
"@company/tokens": minor
"@company/theme": minor
---

Add `--ds-color-neutral-600` and `--ds-color-overlay-backdrop` tokens, plus the `--color-overlay` semantic variable for dialog backdrops.

`--color-muted-foreground` now resolves to `neutral-600` (was `neutral-500`) so muted text on `--color-muted` meets WCAG AA (6.9:1, was 4.4:1). This is a small visual change: secondary text is slightly darker.
