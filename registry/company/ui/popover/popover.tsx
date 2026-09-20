import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

function PopoverTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger className={mergeStateClassName("ds-popover-trigger", className)} {...props} />;
}

function PopoverPositioner(props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Positioner>) {
  return <PopoverPrimitive.Positioner sideOffset={props.sideOffset ?? 8} {...props} />;
}

function PopoverPopup({ className, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup>) {
  return <PopoverPrimitive.Popup className={mergeStateClassName("ds-popover-popup", className)} {...props} />;
}

function PopoverArrow({ className, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>) {
  return <PopoverPrimitive.Arrow className={mergeStateClassName("ds-popover-arrow", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>) {
  return <PopoverPrimitive.Title className={mergeStateClassName("ds-popover-title", className)} {...props} />;
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Description>) {
  return (
    <PopoverPrimitive.Description
      className={mergeStateClassName("ds-popover-description", className)}
      {...props}
    />
  );
}

function PopoverClose({ className, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close className={mergeStateClassName("ds-popover-close", className)} {...props} />;
}

export const Popover = {
  Arrow: PopoverArrow,
  Backdrop: PopoverPrimitive.Backdrop,
  Close: PopoverClose,
  Description: PopoverDescription,
  Handle: PopoverPrimitive.Handle,
  Popup: PopoverPopup,
  Portal: PopoverPrimitive.Portal,
  Positioner: PopoverPositioner,
  Root: PopoverPrimitive.Root,
  Title: PopoverTitle,
  Trigger: PopoverTrigger,
  Viewport: PopoverPrimitive.Viewport,
  createHandle: PopoverPrimitive.createHandle
};

export type * as PopoverTypes from "@base-ui/react/popover";
