import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

function TooltipTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger className={mergeStateClassName("ds-tooltip-trigger", className)} {...props} />;
}

function TooltipPositioner(props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>) {
  return <TooltipPrimitive.Positioner sideOffset={props.sideOffset ?? 8} {...props} />;
}

function TooltipPopup({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>) {
  return <TooltipPrimitive.Popup className={mergeStateClassName("ds-tooltip-popup", className)} {...props} />;
}

function TooltipArrow({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>) {
  return <TooltipPrimitive.Arrow className={mergeStateClassName("ds-tooltip-arrow", className)} {...props} />;
}

export const Tooltip = {
  Arrow: TooltipArrow,
  Handle: TooltipPrimitive.Handle,
  Popup: TooltipPopup,
  Portal: TooltipPrimitive.Portal,
  Positioner: TooltipPositioner,
  Provider: TooltipPrimitive.Provider,
  Root: TooltipPrimitive.Root,
  Trigger: TooltipTrigger,
  Viewport: TooltipPrimitive.Viewport,
  createHandle: TooltipPrimitive.createHandle
};

export type * as TooltipTypes from "@base-ui/react/tooltip";
