import * as React from "react";
import { cn } from "@/lib/utils";

export type FormFieldProps = React.ComponentPropsWithoutRef<"div"> & {
  description?: React.ReactNode;
  error?: React.ReactNode;
  label: React.ReactNode;
};

export function FormField({ children, className, description, error, label, ...props }: FormFieldProps) {
  return (
    <div className={cn("ds-form-field", className)} {...props}>
      <label className="ds-form-label">{label}</label>
      {children}
      {description ? <p className="ds-form-description">{description}</p> : null}
      {error ? <p className="ds-form-error">{error}</p> : null}
    </div>
  );
}
