import * as React from "react";
import { cn } from "@/lib/utils";

export type FormFieldProps = React.ComponentPropsWithoutRef<"div"> & {
  description?: React.ReactNode;
  error?: React.ReactNode;
  label: React.ReactNode;
};

export function FormField({ children, className, description, error, id, label, ...props }: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const control = enhanceControl(children, {
    describedBy,
    id: fieldId,
    isInvalid: Boolean(error)
  });

  return (
    <div className={cn("ds-form-field", className)} {...props}>
      <label className="ds-form-label" htmlFor={fieldId}>
        {label}
      </label>
      {control}
      {description ? (
        <p className="ds-form-description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="ds-form-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function enhanceControl(children: React.ReactNode, props: { describedBy?: string; id: string; isInvalid: boolean }) {
  const childArray = React.Children.toArray(children);
  const [firstChild, ...rest] = childArray;

  if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(firstChild)) {
    return children;
  }

  const existingDescribedBy = firstChild.props["aria-describedby"];
  const describedBy = [existingDescribedBy, props.describedBy].filter(Boolean).join(" ") || undefined;

  return [
    React.cloneElement(firstChild, {
      "aria-describedby": describedBy,
      "aria-invalid": props.isInvalid || firstChild.props["aria-invalid"] ? true : undefined,
      id: firstChild.props.id ?? props.id
    }),
    ...rest
  ];
}
