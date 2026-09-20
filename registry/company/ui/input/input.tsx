import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<React.ComponentPropsWithoutRef<typeof InputPrimitive>, "size"> & {
  isInvalid?: boolean;
  size?: InputSize;
};

export const Input = React.forwardRef<React.ElementRef<typeof InputPrimitive>, InputProps>(
  ({ className, isInvalid = false, size = "md", ...props }, ref) => {
    return (
      <InputPrimitive
        ref={ref}
        aria-invalid={isInvalid || props["aria-invalid"] ? true : undefined}
        className={mergeStateClassName(`ds-input ds-input--${size}`, className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
