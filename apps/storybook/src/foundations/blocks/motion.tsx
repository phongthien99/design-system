import { motion } from "@company/tokens";
import { useState } from "react";
import { TokenTable } from "./token-table";

function Track({ duration, easing, label }: { duration: string; easing: string; label: string }) {
  const [moved, setMoved] = useState(false);

  return (
    <button
      aria-label={`Play ${label}`}
      onClick={() => setMoved((value) => !value)}
      style={{
        background: "var(--color-muted)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-full)",
        containerType: "inline-size",
        cursor: "pointer",
        height: "1.5rem",
        padding: 0,
        position: "relative",
        width: "100%"
      }}
      type="button"
    >
      <span
        style={{
          background: "var(--color-primary)",
          borderRadius: "var(--radius-full)",
          height: "1.125rem",
          left: 2,
          position: "absolute",
          top: 2,
          transform: moved ? "translateX(calc(100cqw - 1.125rem - 4px))" : "translateX(0)",
          transition: `transform var(${duration}) var(${easing})`,
          width: "1.125rem"
        }}
      />
    </button>
  );
}

export function MotionDemo() {
  const durations = Object.entries(motion.duration).map(([name, value]) => ({
    name: `--ds-duration-${name}`,
    value
  }));
  const easings = Object.entries(motion.easing).map(([name, value]) => ({
    name: `--ds-easing-${name}`,
    value
  }));

  return (
    <div style={{ display: "grid", gap: "var(--ds-spacing-8)" }}>
      <section>
        <h3>Duration</h3>
        <TokenTable
          rows={durations}
          previewWidth="14rem"
          preview={(row) => <Track duration={row.name} easing="--ds-easing-standard" label={`duration ${row.name}`} />}
        />
      </section>
      <section>
        <h3>Easing</h3>
        <TokenTable
          rows={easings}
          previewWidth="14rem"
          preview={(row) => <Track duration="--ds-duration-slow" easing={row.name} label={`easing ${row.name}`} />}
        />
      </section>
    </div>
  );
}
