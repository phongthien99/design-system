import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ComponentPropsWithoutRef<typeof ButtonPrimitive> & {
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<React.ElementRef<typeof ButtonPrimitive>, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      isLoading = false,
      size = "md",
      type = "button",
      variant = "primary",
      ...props
    },
    ref
  ) => {
    return (
      <ButtonPrimitive
        ref={ref}
        className={mergeStateClassName(
          `ds-button ds-button--${variant} ds-button--${size}`,
          className
        )}
        data-loading={isLoading ? "true" : undefined}
        disabled={disabled || isLoading}
        type={type}
        {...props}
      >
        {isLoading ? <span aria-hidden="true" className="ds-button-spinner" /> : null}
        {children}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = "Button";
