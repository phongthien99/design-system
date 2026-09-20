import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "children" | "className"
> & {
  className?: string;
  indicator?: React.ReactNode;
};

export function Checkbox({ className, indicator, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root className={cn("ds-checkbox", className)} {...props}>
      <CheckboxPrimitive.Indicator className="ds-checkbox-indicator">
        {indicator ?? <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 16 16"
      width="14"
      {...props}
    >
      <path d="m3 8 3 3 7-7" />
    </svg>
  );
}
