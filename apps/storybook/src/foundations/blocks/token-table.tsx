import type { CSSProperties, ReactNode } from "react";

export type TokenRow = {
  name: string;
  value: string;
  usage?: string;
};

const cell: CSSProperties = {
  borderBottom: "1px solid var(--color-border)",
  padding: "var(--ds-spacing-2) var(--ds-spacing-3)",
  textAlign: "left",
  verticalAlign: "middle"
};

const mono: CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "var(--ds-font-size-xs)"
};

export function TokenTable({
  rows,
  preview,
  previewWidth = "6rem"
}: {
  rows: TokenRow[];
  preview?: (row: TokenRow) => ReactNode;
  previewWidth?: string;
}) {
  const hasUsage = rows.some((row) => row.usage);

  return (
    <table style={{ borderCollapse: "collapse", fontSize: "var(--ds-font-size-sm)", width: "100%" }}>
      <thead>
        <tr>
          {preview ? <th style={{ ...cell, width: previewWidth }}>Preview</th> : null}
          <th style={cell}>Token</th>
          <th style={cell}>Value</th>
          {hasUsage ? <th style={cell}>Usage</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            {preview ? <td style={cell}>{preview(row)}</td> : null}
            <td style={{ ...cell, ...mono }}>{row.name}</td>
            <td style={{ ...cell, ...mono }}>{row.value}</td>
            {hasUsage ? <td style={{ ...cell, color: "var(--color-muted-foreground)" }}>{row.usage}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** rem values render as px next to the raw token value so designers and devs read the same number. */
export function toPx(value: string): number {
  if (value.endsWith("rem")) return Number.parseFloat(value) * 16;
  return Number.parseFloat(value);
}
