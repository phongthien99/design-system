import { TokenTable } from "./token-table";

const semanticTokens: { name: string; usage: string }[] = [
  { name: "--color-background", usage: "Nền trang, nền card/dialog" },
  { name: "--color-foreground", usage: "Text chính" },
  { name: "--color-muted", usage: "Nền phụ, hover nhẹ, disabled" },
  { name: "--color-muted-foreground", usage: "Text phụ, placeholder, description" },
  { name: "--color-border", usage: "Viền mặc định" },
  { name: "--color-input", usage: "Viền của form control" },
  { name: "--color-primary", usage: "Hành động chính" },
  { name: "--color-primary-hover", usage: "Hover của hành động chính" },
  { name: "--color-primary-foreground", usage: "Text trên nền primary" },
  { name: "--color-secondary", usage: "Hành động phụ" },
  { name: "--color-secondary-hover", usage: "Hover của hành động phụ" },
  { name: "--color-secondary-foreground", usage: "Text trên nền secondary" },
  { name: "--color-danger", usage: "Hành động phá hủy, lỗi" },
  { name: "--color-danger-hover", usage: "Hover của danger" },
  { name: "--color-danger-foreground", usage: "Text trên nền danger" },
  { name: "--color-ring", usage: "Focus ring" }
];

/** Resolves each semantic token from the live theme so the table never drifts from styles.css. */
export function SemanticColors() {
  const styles = getComputedStyle(document.documentElement);
  const rows = semanticTokens.map(({ name, usage }) => ({ name, usage, value: styles.getPropertyValue(name).trim() }));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => (
        <span
          style={{
            background: `var(${row.name})`,
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            display: "block",
            height: "1.5rem",
            width: "3rem"
          }}
        />
      )}
    />
  );
}
