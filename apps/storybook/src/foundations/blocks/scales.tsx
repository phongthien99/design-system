import { breakpoints, radius, shadow, spacing, typography, zIndex } from "@company/tokens";
import { TokenTable, toPx } from "./token-table";

const box = {
  background: "var(--color-primary)",
  borderRadius: "var(--radius-sm)",
  height: "1rem"
} as const;

export function TypeScale() {
  const sizes = Object.entries(typography.fontSize);

  return (
    <div style={{ display: "grid", gap: "var(--ds-spacing-4)" }}>
      {sizes.map(([name, size]) => (
        <div
          key={name}
          style={{
            alignItems: "baseline",
            display: "grid",
            gap: "var(--ds-spacing-4)",
            gridTemplateColumns: "8rem 1fr"
          }}
        >
          <code style={{ color: "var(--color-muted-foreground)", fontSize: "var(--ds-font-size-xs)" }}>
            font-size-{name} · {size}
          </code>
          <span style={{ fontSize: `var(--ds-font-size-${name})`, lineHeight: "var(--ds-line-height-normal)" }}>
            The quick brown fox jumps over the lazy dog
          </span>
        </div>
      ))}
    </div>
  );
}

export function FontWeights() {
  return (
    <div style={{ display: "grid", gap: "var(--ds-spacing-2)" }}>
      {Object.entries(typography.fontWeight).map(([name, weight]) => (
        <span key={name} style={{ fontSize: "var(--ds-font-size-md)", fontWeight: `var(--ds-font-weight-${name})` }}>
          {name} ({weight}) — Design system typography
        </span>
      ))}
    </div>
  );
}

export function SpacingScale() {
  const rows = Object.entries(spacing).map(([name, value]) => ({
    name: `--ds-spacing-${name}`,
    value: `${value} (${toPx(value)}px)`
  }));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => <span style={{ ...box, display: "block", width: `var(${row.name})` }} />}
    />
  );
}

export function RadiusSamples() {
  const rows = Object.entries(radius).map(([name, value]) => ({ name: `--ds-radius-${name}`, value }));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => (
        <span
          style={{
            background: "var(--color-muted)",
            border: "1px solid var(--color-input)",
            borderRadius: `var(${row.name})`,
            display: "block",
            height: "2.5rem",
            width: "2.5rem"
          }}
        />
      )}
    />
  );
}

export function ShadowSamples() {
  const rows = Object.entries(shadow).map(([name, value]) => ({ name: `--ds-shadow-${name}`, value }));

  return (
    <div
      style={{
        display: "grid",
        gap: "var(--ds-spacing-6)",
        gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))"
      }}
    >
      {rows.map((row) => (
        <div
          key={row.name}
          style={{
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: `var(${row.name})`,
            display: "grid",
            gap: "var(--ds-spacing-1)",
            padding: "var(--ds-spacing-4)"
          }}
        >
          <strong style={{ fontSize: "var(--ds-font-size-sm)" }}>{row.name.replace("--ds-shadow-", "")}</strong>
          <code style={{ color: "var(--color-muted-foreground)", fontSize: "var(--ds-font-size-xs)" }}>{row.name}</code>
        </div>
      ))}
    </div>
  );
}

export function ZIndexTable() {
  const rows = Object.entries(zIndex)
    .map(([name, value]) => ({ name: `--ds-z-index-${name}`, value }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  return <TokenTable rows={rows} />;
}

export function BreakpointBars() {
  const rows = Object.entries(breakpoints).map(([name, value]) => ({ name, value }));
  const max = Math.max(...rows.map((row) => toPx(row.value)));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => (
        <span style={{ ...box, display: "block", width: `${(toPx(row.value) / max) * 100}%`, minWidth: "1rem" }} />
      )}
    />
  );
}
