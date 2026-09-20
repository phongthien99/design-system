import * as React from "react";

export type EmptyStateProps = React.ComponentPropsWithoutRef<"div"> & {
  actions?: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
};

export function EmptyState({ actions, children, description, title, ...props }: EmptyStateProps) {
  return (
    <div className="ds-empty-state" {...props}>
      <h3 className="ds-empty-state-title">{title}</h3>
      {description ? <p className="ds-empty-state-description">{description}</p> : null}
      {children}
      {actions}
    </div>
  );
}
