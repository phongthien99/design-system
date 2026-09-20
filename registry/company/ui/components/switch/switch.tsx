import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

function SwitchRoot({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return <SwitchPrimitive.Root className={mergeStateClassName("ds-switch", className)} {...props} />;
}

function SwitchThumb({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>) {
  return <SwitchPrimitive.Thumb className={mergeStateClassName("ds-switch-thumb", className)} {...props} />;
}

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb
};

export type * as SwitchTypes from "@base-ui/react/switch";
