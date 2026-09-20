import { Select as SelectPrimitive } from "@base-ui/react/select";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={mergeStateClassName("ds-select-trigger", className)} {...props}>
      {children}
    </SelectPrimitive.Trigger>
  );
}

function SelectValue(props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectIcon({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>) {
  return (
    <SelectPrimitive.Icon className={mergeStateClassName("ds-select-icon", className)} {...props}>
      {children ?? <ChevronDownIcon />}
    </SelectPrimitive.Icon>
  );
}

function SelectPositioner(props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Positioner>) {
  return <SelectPrimitive.Positioner sideOffset={props.sideOffset ?? 6} {...props} />;
}

function SelectPopup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup>) {
  return <SelectPrimitive.Popup className={mergeStateClassName("ds-select-popup", className)} {...props} />;
}

function SelectList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.List>) {
  return <SelectPrimitive.List className={mergeStateClassName("ds-select-list", className)} {...props} />;
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={mergeStateClassName("ds-select-item", className)} {...props}>
      <SelectPrimitive.ItemIndicator className="ds-select-item-indicator">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group className={mergeStateClassName("ds-select-group", className)} {...props} />;
}

function SelectGroupLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      className={mergeStateClassName("ds-select-group-label", className)}
      {...props}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={mergeStateClassName("ds-select-separator", className)} {...props} />
  );
}

export const Select = {
  Arrow: SelectPrimitive.Arrow,
  Backdrop: SelectPrimitive.Backdrop,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Icon: SelectIcon,
  Item: SelectItem,
  ItemIndicator: SelectPrimitive.ItemIndicator,
  ItemText: SelectPrimitive.ItemText,
  Label: SelectPrimitive.Label,
  List: SelectList,
  Popup: SelectPopup,
  Portal: SelectPrimitive.Portal,
  Positioner: SelectPositioner,
  Root: SelectPrimitive.Root,
  ScrollDownArrow: SelectPrimitive.ScrollDownArrow,
  ScrollUpArrow: SelectPrimitive.ScrollUpArrow,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  Value: SelectValue
};

function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" viewBox="0 0 16 16" width="16" {...props}>
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" viewBox="0 0 16 16" width="14" {...props}>
      <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export type * as SelectTypes from "@base-ui/react/select";
