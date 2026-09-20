import type { ArgTypes } from "@storybook/react-vite";
import type { ElementType } from "react";
import { Accordion } from "../company/ui/accordion/accordion";
import { AlertDialog } from "../company/ui/alert-dialog/alert-dialog";
import { Autocomplete } from "../company/ui/autocomplete/autocomplete";
import { Avatar } from "../company/ui/avatar/avatar";
import { Checkbox } from "../company/ui/checkbox/checkbox";
import { CheckboxGroup } from "../company/ui/checkbox-group/checkbox-group";
import { Collapsible } from "../company/ui/collapsible/collapsible";
import { Combobox } from "../company/ui/combobox/combobox";
import { ContextMenu } from "../company/ui/context-menu/context-menu";
import { CSPProvider } from "../company/ui/csp-provider/csp-provider";
import { Dialog } from "../company/ui/dialog/dialog";
import { DirectionProvider } from "../company/ui/direction-provider/direction-provider";
import { Drawer } from "../company/ui/drawer/drawer";
import { Field } from "../company/ui/field/field";
import { Fieldset } from "../company/ui/fieldset/fieldset";
import { Form } from "../company/ui/form/form";
import { FormField } from "../company/ui/form-field/form-field";
import { Menu } from "../company/ui/menu/menu";
import { Menubar } from "../company/ui/menubar/menubar";
import { Meter } from "../company/ui/meter/meter";
import { NavigationMenu } from "../company/ui/navigation-menu/navigation-menu";
import { NumberField } from "../company/ui/number-field/number-field";
import { OTPField } from "../company/ui/otp-field/otp-field";
import { Popover } from "../company/ui/popover/popover";
import { PreviewCard } from "../company/ui/preview-card/preview-card";
import { Progress } from "../company/ui/progress/progress";
import { RadioGroup } from "../company/ui/radio-group/radio-group";
import { ScrollArea } from "../company/ui/scroll-area/scroll-area";
import { Select } from "../company/ui/select/select";
import { Separator } from "../company/ui/separator/separator";
import { Slider } from "../company/ui/slider/slider";
import { Switch } from "../company/ui/switch/switch";
import { Tabs } from "../company/ui/tabs/tabs";
import { Toast } from "../company/ui/toast/toast";
import { Toggle } from "../company/ui/toggle/toggle";
import { ToggleGroup } from "../company/ui/toggle-group/toggle-group";
import { Toolbar } from "../company/ui/toolbar/toolbar";
import { Tooltip } from "../company/ui/tooltip/tooltip";

export type PlaygroundConfig = {
  args: Record<string, unknown>;
  argTypes: ArgTypes;
  component: ElementType;
};

const bool = { control: "boolean" } as const;
const text = { control: "text" } as const;
const number = (range?: { max?: number; min?: number; step?: number }) =>
  ({ control: { type: "number", ...range } }) as const;
const choice = (options: string[]) => ({ control: "inline-radio", options }) as const;

const sides = ["top", "bottom", "left", "right", "inline-start", "inline-end"];
const aligns = ["start", "center", "end"];
const orientations = ["horizontal", "vertical"];

export const playgrounds: Record<string, PlaygroundConfig> = {
  accordion: {
    component: Accordion.Root,
    args: { multiple: false, disabled: false, orientation: "vertical", loopFocus: true },
    argTypes: { multiple: bool, disabled: bool, orientation: choice(orientations), loopFocus: bool }
  },
  "alert-dialog": {
    component: AlertDialog.Root,
    args: { defaultOpen: false },
    argTypes: { defaultOpen: bool }
  },
  autocomplete: {
    component: Autocomplete.Root,
    args: { openOnInputClick: true, autoHighlight: false, highlightItemOnHover: true },
    argTypes: { openOnInputClick: bool, autoHighlight: bool, highlightItemOnHover: bool }
  },
  avatar: {
    component: Avatar.Root,
    args: { alt: "Company", fallback: "DS" },
    argTypes: { src: text, alt: text, fallback: text }
  },
  checkbox: {
    component: Checkbox,
    args: {
      label: "Receive product updates",
      defaultChecked: true,
      disabled: false,
      indeterminate: false,
      readOnly: false,
      required: false
    },
    argTypes: {
      label: text,
      defaultChecked: bool,
      disabled: bool,
      indeterminate: bool,
      readOnly: bool,
      required: bool
    }
  },
  "checkbox-group": {
    component: CheckboxGroup,
    args: { disabled: false },
    argTypes: { disabled: bool }
  },
  collapsible: {
    component: Collapsible.Root,
    args: { defaultOpen: true, disabled: false },
    argTypes: { defaultOpen: bool, disabled: bool }
  },
  combobox: {
    component: Combobox.Root,
    args: { autoHighlight: false, highlightItemOnHover: true },
    argTypes: { autoHighlight: bool, highlightItemOnHover: bool }
  },
  "context-menu": {
    component: ContextMenu.Root,
    args: { label: "Right-click this area", closeParentOnEsc: false },
    argTypes: { label: text, closeParentOnEsc: bool }
  },
  "csp-provider": {
    component: CSPProvider,
    args: { nonce: "", disableStyleElements: false },
    argTypes: { nonce: text, disableStyleElements: bool }
  },
  dialog: {
    component: Dialog,
    args: { defaultOpen: false, modal: true, disablePointerDismissal: false },
    argTypes: { defaultOpen: bool, modal: bool, disablePointerDismissal: bool }
  },
  "direction-provider": {
    component: DirectionProvider,
    args: { direction: "ltr" },
    argTypes: { direction: choice(["ltr", "rtl"]) }
  },
  drawer: {
    component: Drawer.Root,
    args: { defaultOpen: false, swipeDirection: "down", modal: true, disablePointerDismissal: false },
    argTypes: {
      defaultOpen: bool,
      swipeDirection: choice(["down", "up", "left", "right"]),
      modal: bool,
      disablePointerDismissal: bool
    }
  },
  field: {
    component: Field.Root,
    args: {
      label: "Project name",
      description: "This preview shows field composition using registry Input.",
      errorText: "Project name is required.",
      disabled: false,
      invalid: false
    },
    argTypes: { label: text, description: text, errorText: text, disabled: bool, invalid: bool }
  },
  fieldset: {
    component: Fieldset.Root,
    args: { legend: "Notification channels", disabled: false },
    argTypes: { legend: text, disabled: bool }
  },
  form: {
    component: Form,
    args: { validationMode: "onSubmit" },
    argTypes: { validationMode: choice(["onSubmit", "onBlur", "onChange"]) }
  },
  "form-field": {
    component: FormField,
    args: { label: "Email address", description: "We only use this for account notices.", error: "" },
    argTypes: { label: text, description: text, error: text }
  },
  menu: {
    component: Menu.Root,
    args: { defaultOpen: false, disabled: false, modal: true, loopFocus: true, side: "bottom", align: "center" },
    argTypes: {
      defaultOpen: bool,
      disabled: bool,
      modal: bool,
      loopFocus: bool,
      side: choice(sides),
      align: choice(aligns)
    }
  },
  menubar: {
    component: Menubar,
    args: { disabled: false, loopFocus: true, modal: true },
    argTypes: { disabled: bool, loopFocus: bool, modal: bool }
  },
  meter: {
    component: Meter.Root,
    args: { value: 72, min: 0, max: 100, label: "Adoption score" },
    argTypes: { value: number(), min: number(), max: number(), label: text }
  },
  "navigation-menu": {
    component: NavigationMenu.Root,
    args: { orientation: "horizontal", delay: 50, closeDelay: 50 },
    argTypes: { orientation: choice(orientations), delay: number({ min: 0 }), closeDelay: number({ min: 0 }) }
  },
  "number-field": {
    component: NumberField.Root,
    args: {
      defaultValue: 12,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      readOnly: false,
      required: false,
      allowWheelScrub: false
    },
    argTypes: {
      defaultValue: number(),
      min: number(),
      max: number(),
      step: number({ min: 0 }),
      disabled: bool,
      readOnly: bool,
      required: bool,
      allowWheelScrub: bool
    }
  },
  "otp-field": {
    component: OTPField.Root,
    args: { length: 6, disabled: false, readOnly: false, required: false, mask: false, validationType: "numeric" },
    argTypes: {
      length: number({ min: 1, max: 8 }),
      disabled: bool,
      readOnly: bool,
      required: bool,
      mask: bool,
      validationType: choice(["numeric", "alpha", "alphanumeric", "none"])
    }
  },
  popover: {
    component: Popover.Root,
    args: { defaultOpen: false, modal: false, side: "bottom", align: "center" },
    argTypes: { defaultOpen: bool, modal: bool, side: choice(sides), align: choice(aligns) }
  },
  "preview-card": {
    component: PreviewCard.Root,
    args: { defaultOpen: false, side: "bottom", align: "center", delay: 600, closeDelay: 300 },
    argTypes: {
      defaultOpen: bool,
      side: choice(sides),
      align: choice(aligns),
      delay: number({ min: 0 }),
      closeDelay: number({ min: 0 })
    }
  },
  progress: {
    component: Progress.Root,
    args: { value: 64, min: 0, max: 100 },
    argTypes: { value: number(), min: number(), max: number() }
  },
  radio: {
    component: RadioGroup,
    args: { disabled: false, readOnly: false, required: false },
    argTypes: { disabled: bool, readOnly: bool, required: bool }
  },
  "radio-group": {
    component: RadioGroup,
    args: { disabled: false, readOnly: false, required: false },
    argTypes: { disabled: bool, readOnly: bool, required: bool }
  },
  "scroll-area": {
    component: ScrollArea.Root,
    args: { orientation: "vertical" },
    argTypes: { orientation: choice(["vertical", "horizontal"]) }
  },
  select: {
    component: Select.Root,
    args: { defaultOpen: false, disabled: false, readOnly: false, required: false, modal: true },
    argTypes: { defaultOpen: bool, disabled: bool, readOnly: bool, required: bool, modal: bool }
  },
  separator: {
    component: Separator,
    args: { orientation: "horizontal" },
    argTypes: { orientation: choice(orientations) }
  },
  slider: {
    component: Slider.Root,
    args: { defaultValue: 45, min: 0, max: 100, step: 1, disabled: false },
    argTypes: { defaultValue: number(), min: number(), max: number(), step: number({ min: 1 }), disabled: bool }
  },
  switch: {
    component: Switch.Root,
    args: { label: "Enable notifications", defaultChecked: true, disabled: false, readOnly: false, required: false },
    argTypes: { label: text, defaultChecked: bool, disabled: bool, readOnly: bool, required: bool }
  },
  tabs: {
    component: Tabs.Root,
    args: { orientation: "horizontal" },
    argTypes: { orientation: choice(orientations) }
  },
  toast: {
    component: Toast.Provider,
    args: { title: "Changes saved", description: "Registry item updated.", limit: 3, timeout: 5000 },
    argTypes: { title: text, description: text, limit: number({ min: 1 }), timeout: number({ min: 0, step: 500 }) }
  },
  toggle: {
    component: Toggle,
    args: { label: "Bold", defaultPressed: false, disabled: false },
    argTypes: { label: text, defaultPressed: bool, disabled: bool }
  },
  "toggle-group": {
    component: ToggleGroup,
    args: { multiple: false, disabled: false, loopFocus: true, orientation: "horizontal" },
    argTypes: { multiple: bool, disabled: bool, loopFocus: bool, orientation: choice(orientations) }
  },
  toolbar: {
    component: Toolbar.Root,
    args: { orientation: "horizontal", disabled: false, loopFocus: true },
    argTypes: { orientation: choice(orientations), disabled: bool, loopFocus: bool }
  },
  tooltip: {
    component: Tooltip.Root,
    args: {
      content: "Tooltip content",
      defaultOpen: false,
      disabled: false,
      side: "top",
      align: "center",
      delay: 400,
      closeDelay: 0
    },
    argTypes: {
      content: text,
      defaultOpen: bool,
      disabled: bool,
      side: choice(sides),
      align: choice(aligns),
      delay: number({ min: 0 }),
      closeDelay: number({ min: 0 })
    }
  }
};
