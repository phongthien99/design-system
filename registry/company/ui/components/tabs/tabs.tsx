import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={mergeStateClassName("ds-tabs-list", className)} {...props} />;
}

function TabsTab({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>) {
  return <TabsPrimitive.Tab className={mergeStateClassName("ds-tabs-tab", className)} {...props} />;
}

function TabsIndicator({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Indicator>) {
  return <TabsPrimitive.Indicator className={mergeStateClassName("ds-tabs-indicator", className)} {...props} />;
}

function TabsPanel({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel className={mergeStateClassName("ds-tabs-panel", className)} {...props} />;
}

export const Tabs = {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsPrimitive.Root,
  Tab: TabsTab
};

export type * as TabsTypes from "@base-ui/react/tabs";
