import * as React from "react";
import { ComponentPreview } from "./component-previews";

type RegistryFile = {
  path: string;
  target?: string;
  type: string;
};

export type RegistryStoryItem = {
  dependencies?: string[];
  description?: string;
  devDependencies?: string[];
  files?: RegistryFile[];
  name: string;
  registryDependencies?: string[];
  title?: string;
  type: string;
};

export function RegistryStoryShell({ item }: { item: RegistryStoryItem }) {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <span style={styles.kicker}>{item.type}</span>
        <h1 style={styles.title}>{item.title ?? item.name}</h1>
        <p style={styles.description}>{item.description ?? "Company UI registry item."}</p>
      </header>

      <section style={styles.previewPanel}>
        <div style={styles.previewHeader}>
          <h2 style={styles.panelTitle}>Preview</h2>
          <span style={styles.previewHint}>Interactive development preview</span>
        </div>
        <ComponentPreview name={item.name} />
      </section>

      <section style={styles.grid}>
        <InfoPanel title="Install">
          <CodeBlock>{`company-ui add ${item.name}`}</CodeBlock>
        </InfoPanel>

        <InfoPanel title="Dependencies">
          <TokenList items={item.dependencies ?? []} empty="No npm dependencies" />
        </InfoPanel>

        <InfoPanel title="Registry Dependencies">
          <TokenList items={item.registryDependencies ?? []} empty="No registry dependencies" />
        </InfoPanel>

        <InfoPanel title="Target Files">
          <FileList files={item.files ?? []} />
        </InfoPanel>
      </section>
    </main>
  );
}

export function RegistryCatalog({ items }: { items: RegistryStoryItem[] }) {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <span style={styles.kicker}>Company UI Registry</span>
        <h1 style={styles.title}>All UI Components</h1>
        <p style={styles.description}>
          Shadcn-compatible registry items backed by Base UI primitives and Company tokens.
        </p>
      </header>

      <div style={styles.catalogGrid}>
        {items.map((item) => (
          <article key={item.name} style={styles.card}>
            <div style={styles.cardHeader}>
              <strong>{item.title ?? item.name}</strong>
              <code style={styles.badge}>{item.type}</code>
            </div>
            <p style={styles.cardText}>{item.description}</p>
            <CodeBlock>{`company-ui add ${item.name}`}</CodeBlock>
          </article>
        ))}
      </div>
    </main>
  );
}

function InfoPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      {children}
    </section>
  );
}

function TokenList({ empty, items }: { empty: string; items: string[] }) {
  if (items.length === 0) {
    return <p style={styles.muted}>{empty}</p>;
  }

  return (
    <div style={styles.tokenList}>
      {items.map((item) => (
        <code key={item} style={styles.token}>
          {item}
        </code>
      ))}
    </div>
  );
}

function FileList({ files }: { files: RegistryFile[] }) {
  if (files.length === 0) {
    return <p style={styles.muted}>No files declared</p>;
  }

  return (
    <div style={styles.fileList}>
      {files.map((file) => (
        <div key={`${file.path}:${file.target ?? ""}`} style={styles.fileRow}>
          <code>{file.path}</code>
          <span style={styles.arrow}>{"->"}</span>
          <code>{file.target ?? "default target"}</code>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return <pre style={styles.code}>{children}</pre>;
}

const styles = {
  arrow: {
    color: "var(--color-muted-foreground)"
  },
  badge: {
    background: "var(--color-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    padding: "2px 6px"
  },
  card: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "12px",
    minHeight: "180px",
    padding: "16px"
  },
  cardHeader: {
    alignItems: "center",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between"
  },
  cardText: {
    color: "var(--color-muted-foreground)",
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0
  },
  catalogGrid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
  },
  code: {
    background: "var(--color-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    fontSize: "13px",
    margin: 0,
    overflow: "auto",
    padding: "12px"
  },
  description: {
    color: "var(--color-muted-foreground)",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "720px"
  },
  fileList: {
    display: "grid",
    gap: "10px"
  },
  fileRow: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  grid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
  },
  header: {
    display: "grid",
    gap: "8px"
  },
  kicker: {
    color: "var(--color-muted-foreground)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const
  },
  muted: {
    color: "var(--color-muted-foreground)",
    margin: 0
  },
  page: {
    display: "grid",
    gap: "24px",
    padding: "24px"
  },
  panel: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "12px",
    padding: "16px"
  },
  panelTitle: {
    fontSize: "14px",
    margin: 0
  },
  previewHeader: {
    alignItems: "center",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between"
  },
  previewHint: {
    color: "var(--color-muted-foreground)",
    fontSize: "12px"
  },
  previewPanel: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "16px",
    overflow: "hidden",
    padding: "16px"
  },
  title: {
    fontSize: "32px",
    lineHeight: 1.1,
    margin: 0
  },
  token: {
    background: "var(--color-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "4px 8px"
  },
  tokenList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  }
} satisfies Record<string, React.CSSProperties>;
