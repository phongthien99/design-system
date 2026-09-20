import { grid, sizing } from "@company/tokens";
import { TokenTable, toPx } from "./token-table";

export function ControlSizes() {
  const rows = Object.entries(sizing.control).map(([name, value]) => ({
    name: `--ds-size-control-${name}`,
    value: `${value} (${toPx(value)}px)`
  }));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => (
        <span
          style={{
            background: "var(--color-muted)",
            border: "1px solid var(--color-input)",
            borderRadius: "var(--radius-md)",
            display: "block",
            height: `var(${row.name})`,
            width: "4rem"
          }}
        />
      )}
    />
  );
}

export function IconSizes() {
  const rows = Object.entries(sizing.icon).map(([name, value]) => ({
    name: `--ds-size-icon-${name}`,
    value: `${value} (${toPx(value)}px)`
  }));

  return (
    <TokenTable
      rows={rows}
      preview={(row) => (
        <span
          style={{
            background: "var(--color-primary)",
            borderRadius: "var(--radius-sm)",
            display: "block",
            height: `var(${row.name})`,
            width: `var(${row.name})`
          }}
        />
      )}
    />
  );
}

export function GridDemo() {
  const columns = Number(grid.columns);

  return (
    <div
      style={{
        display: "grid",
        gap: "var(--ds-grid-gutter)",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          style={{
            background: "var(--color-primary)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-primary-foreground)",
            fontSize: "var(--ds-font-size-xs)",
            opacity: 0.85,
            padding: "var(--ds-spacing-3) 0",
            textAlign: "center"
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export function GridTokens() {
  return (
    <TokenTable
      rows={[
        { name: "--ds-grid-columns", value: grid.columns, usage: "Số cột của layout chính" },
        {
          name: "--ds-grid-gutter",
          value: `${grid.gutter} (${toPx(grid.gutter)}px)`,
          usage: "Khoảng cách giữa các cột"
        },
        ...Object.entries(grid.container).map(([name, value]) => ({
          name: `--ds-grid-container-${name}`,
          value: `${value} (${toPx(value)}px)`,
          usage: "Max-width của container"
        }))
      ]}
    />
  );
}
