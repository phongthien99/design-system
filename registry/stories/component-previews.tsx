import type { ReactElement } from "react";
import { Accordion } from "../company/ui/accordion/accordion";
import { Autocomplete } from "../company/ui/autocomplete/autocomplete";
import { Avatar } from "../company/ui/avatar/avatar";
import { Button } from "../company/ui/button/button";
import { Checkbox } from "../company/ui/checkbox/checkbox";
import { Collapsible } from "../company/ui/collapsible/collapsible";
import { Combobox } from "../company/ui/combobox/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../company/ui/dialog/dialog";
import { Input } from "../company/ui/input/input";
import { Menu } from "../company/ui/menu/menu";
import { Meter } from "../company/ui/meter/meter";
import { Popover } from "../company/ui/popover/popover";
import { Progress } from "../company/ui/progress/progress";
import { Radio } from "../company/ui/radio/radio";
import { RadioGroup } from "../company/ui/radio-group/radio-group";
import { ScrollArea } from "../company/ui/scroll-area/scroll-area";
import { Select } from "../company/ui/select/select";
import { Separator } from "../company/ui/separator/separator";
import { Slider } from "../company/ui/slider/slider";
import { Switch } from "../company/ui/switch/switch";
import { Tabs } from "../company/ui/tabs/tabs";
import { Toggle } from "../company/ui/toggle/toggle";
import { Tooltip } from "../company/ui/tooltip/tooltip";
import { AlertDialog } from "../company/ui/alert-dialog/alert-dialog";
import { CheckboxGroup } from "../company/ui/checkbox-group/checkbox-group";
import { ContextMenu } from "../company/ui/context-menu/context-menu";
import { CSPProvider } from "../company/ui/csp-provider/csp-provider";
import { DirectionProvider } from "../company/ui/direction-provider/direction-provider";
import { Drawer } from "../company/ui/drawer/drawer";
import { Field } from "../company/ui/field/field";
import { Fieldset } from "../company/ui/fieldset/fieldset";
import { Form } from "../company/ui/form/form";
import { FormField } from "../company/ui/form-field/form-field";
import { Menubar } from "../company/ui/menubar/menubar";
import { NavigationMenu } from "../company/ui/navigation-menu/navigation-menu";
import { NumberField } from "../company/ui/number-field/number-field";
import { OTPField } from "../company/ui/otp-field/otp-field";
import { PreviewCard } from "../company/ui/preview-card/preview-card";
import { Toast } from "../company/ui/toast/toast";
import { ToggleGroup } from "../company/ui/toggle-group/toggle-group";
import { Toolbar } from "../company/ui/toolbar/toolbar";

const fruits = ["Apple", "Banana", "Blueberry", "Grape", "Orange", "Strawberry"];
const fruitItems = fruits.map((fruit) => ({ label: fruit, value: fruit.toLowerCase() }));
const defaultAvatarSrc =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces";

// Preview props come from Storybook Controls (Playground) or are empty (Overview).
type PreviewProps = Record<string, any>;

export function ComponentPreview({ name, props }: { name: string; props?: PreviewProps }) {
  const previews: Record<string, (props: PreviewProps) => ReactElement> = {
    accordion: AccordionPreview,
    "alert-dialog": AlertDialogPreview,
    autocomplete: AutocompletePreview,
    avatar: AvatarPreview,
    button: ButtonPreview,
    checkbox: CheckboxPreview,
    "checkbox-group": CheckboxGroupPreview,
    collapsible: CollapsiblePreview,
    combobox: ComboboxPreview,
    "context-menu": ContextMenuPreview,
    "csp-provider": CspProviderPreview,
    dialog: DialogPreview,
    "direction-provider": DirectionProviderPreview,
    drawer: DrawerPreview,
    field: FieldPreview,
    fieldset: FieldsetPreview,
    form: FormPreview,
    "form-field": FormFieldPreview,
    input: InputPreview,
    menu: MenuPreview,
    menubar: MenubarPreview,
    meter: MeterPreview,
    "navigation-menu": NavigationMenuPreview,
    "number-field": NumberFieldPreview,
    "otp-field": OtpFieldPreview,
    popover: PopoverPreview,
    "preview-card": PreviewCardPreview,
    progress: ProgressPreview,
    radio: RadioPreview,
    "radio-group": RadioPreview,
    "scroll-area": ScrollAreaPreview,
    select: SelectPreview,
    separator: SeparatorPreview,
    slider: SliderPreview,
    switch: SwitchPreview,
    tabs: TabsPreview,
    toast: ToastPreview,
    toggle: TogglePreview,
    "toggle-group": ToggleGroupPreview,
    toolbar: ToolbarPreview,
    tooltip: TooltipPreview
  };

  // Overview shows a gallery of states for checkbox; the Playground shows a single instance.
  const Preview = (props && name === "checkbox" ? CheckboxPlayground : previews[name]) as
    | ((props: PreviewProps) => ReactElement)
    | undefined;

  return (
    <div style={styles.previewCanvas}>
      {Preview ? (
        // Remount on any control change so uncontrolled `default*` props take effect.
        <Preview key={props ? JSON.stringify(props) : undefined} {...props} />
      ) : (
        <HeadlessPreview name={name} />
      )}
    </div>
  );
}

function ButtonPreview() {
  return (
    <PreviewStack>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button isLoading>Saving</Button>
    </PreviewStack>
  );
}

function InputPreview() {
  return (
    <PreviewGrid>
      <Input placeholder="Email address" />
      <Input isInvalid placeholder="Invalid state" />
      <Input disabled placeholder="Disabled" />
    </PreviewGrid>
  );
}

function CheckboxPreview() {
  return (
    <PreviewStack>
      <LabelRow>
        <Checkbox defaultChecked />
        Receive product updates
      </LabelRow>
      <LabelRow>
        <Checkbox />
        Enable audit log
      </LabelRow>
      <LabelRow muted>
        <Checkbox disabled />
        Disabled option
      </LabelRow>
    </PreviewStack>
  );
}

function CheckboxPlayground({ label = "Receive product updates", ...props }: PreviewProps) {
  return (
    <LabelRow>
      <Checkbox {...props} />
      {label}
    </LabelRow>
  );
}

function CheckboxGroupPreview(props: PreviewProps) {
  return (
    <CheckboxGroup defaultValue={["email"]} style={styles.fieldGroup} {...props}>
      {[
        ["email", "Email"],
        ["sms", "SMS"],
        ["push", "Push notification"]
      ].map(([value, label]) => (
        <LabelRow key={value}>
          <Checkbox value={value} />
          {label}
        </LabelRow>
      ))}
    </CheckboxGroup>
  );
}

function DialogPreview(props: PreviewProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger className="ds-button ds-button--primary ds-button--md">Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm publish</DialogTitle>
          <DialogDescription>
            This dialog uses the registry Dialog wrapper backed by Base UI.
          </DialogDescription>
        </DialogHeader>
        <p style={styles.bodyText}>Keyboard focus, escape close and portal behavior come from Base UI.</p>
        <DialogFooter>
          <DialogClose className="ds-button ds-button--secondary ds-button--md">Cancel</DialogClose>
          <DialogClose className="ds-button ds-button--primary ds-button--md">Publish</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogPreview(props: PreviewProps) {
  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Trigger style={styles.trigger}>Delete project</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop style={styles.backdrop} />
        <AlertDialog.Popup style={styles.dialogPopup}>
          <AlertDialog.Title style={styles.popTitle}>Delete this project?</AlertDialog.Title>
          <AlertDialog.Description style={styles.bodyText}>
            This action cannot be undone. All registry items in the project will be removed.
          </AlertDialog.Description>
          <div style={styles.actions}>
            <AlertDialog.Close style={styles.smallButton}>Cancel</AlertDialog.Close>
            <AlertDialog.Close style={styles.smallButton}>Delete</AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

const drawerPlacement = {
  down: { bottom: 0, left: 0, right: 0, maxHeight: "60vh" },
  left: { bottom: 0, left: 0, top: 0, width: "320px" },
  right: { bottom: 0, right: 0, top: 0, width: "320px" },
  up: { left: 0, maxHeight: "60vh", right: 0, top: 0 }
} satisfies Record<string, React.CSSProperties>;

function DrawerPreview({ swipeDirection = "down", ...props }: PreviewProps) {
  const placement = drawerPlacement[swipeDirection as keyof typeof drawerPlacement];

  return (
    <Drawer.Root swipeDirection={swipeDirection} {...props}>
      <Drawer.Trigger style={styles.trigger}>Open drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop style={styles.backdrop} />
        <Drawer.Viewport style={styles.drawerViewport}>
          <Drawer.Popup style={{ ...styles.drawerPopup, ...placement }}>
            <Drawer.Content style={styles.compactPanelBare}>
              <Drawer.Title style={styles.popTitle}>Filters</Drawer.Title>
              <Drawer.Description style={styles.bodyText}>
                Swipe or press Escape to dismiss. Placement follows the swipe direction.
              </Drawer.Description>
              <Drawer.Close style={styles.smallButton}>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SelectPreview(props: PreviewProps) {
  return (
    <Select.Root defaultValue="apple" items={fruitItems} {...props}>
      <Select.Trigger>
        <Select.Value placeholder="Choose fruit" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              {fruits.map((fruit) => (
                <Select.Item key={fruit} value={fruit.toLowerCase()}>{fruit}</Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function AutocompletePreview(props: PreviewProps) {
  return (
    <Autocomplete.Root items={fruits} openOnInputClick {...props}>
      <Autocomplete.InputGroup style={styles.inputGroup}>
        <Autocomplete.Input placeholder="Search fruit" style={styles.rawInput} />
        <Autocomplete.Trigger style={styles.iconButton}>v</Autocomplete.Trigger>
      </Autocomplete.InputGroup>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={6}>
          <Autocomplete.Popup style={styles.popup}>
            <Autocomplete.List>
              {(item: string, index: number) => (
                <Autocomplete.Item key={item} value={item} index={index} style={styles.option}>
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty style={styles.empty}>No results</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}

function ComboboxPreview(props: PreviewProps) {
  return (
    <Combobox.Root items={fruitItems} defaultValue="banana" {...props}>
      <Combobox.InputGroup style={styles.inputGroup}>
        <Combobox.Input placeholder="Pick fruit" style={styles.rawInput} />
        <Combobox.Trigger style={styles.iconButton}>v</Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={6}>
          <Combobox.Popup style={styles.popup}>
            <Combobox.List>
              {(item: { label: string; value: string }, index: number) => (
                <Combobox.Item key={item.value} value={item.value} index={index} style={styles.option}>
                  <Combobox.ItemIndicator style={styles.check}>✓</Combobox.ItemIndicator>
                  {item.label}
                </Combobox.Item>
              )}
            </Combobox.List>
            <Combobox.Empty style={styles.empty}>No results</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function TabsPreview({ orientation = "horizontal", ...props }: PreviewProps) {
  const vertical = orientation === "vertical";

  return (
    <Tabs.Root
      defaultValue="overview"
      orientation={orientation}
      style={{ ...styles.compactPanel, gridAutoFlow: vertical ? "column" : "row", gridTemplateColumns: vertical ? "auto 1fr" : undefined }}
      {...props}
    >
      <Tabs.List
        style={{
          ...styles.tabList,
          borderBottom: vertical ? 0 : styles.tabList.borderBottom,
          borderRight: vertical ? "1px solid var(--color-border)" : 0,
          flexDirection: vertical ? "column" : "row"
        }}
      >
        <Tabs.Tab value="overview" style={styles.tab}>
          Overview
        </Tabs.Tab>
        <Tabs.Tab value="usage" style={styles.tab}>
          Usage
        </Tabs.Tab>
        <Tabs.Indicator style={vertical ? styles.tabIndicatorVertical : styles.tabIndicator} />
      </Tabs.List>
      <Tabs.Panel value="overview" style={styles.bodyText}>
        Component preview with token-backed spacing and keyboard navigation.
      </Tabs.Panel>
      <Tabs.Panel value="usage" style={styles.bodyText}>
        Use this as the starting point for the styled registry wrapper.
      </Tabs.Panel>
    </Tabs.Root>
  );
}

function AccordionPreview(props: PreviewProps) {
  return (
    <Accordion.Root defaultValue={["tokens"]} style={styles.compactPanel} {...props}>
      {[
        ["tokens", "Token first", "Styles should resolve to semantic tokens."],
        ["accessibility", "Accessibility", "Focus and keyboard behavior come from Base UI."]
      ].map(([value, title, content]) => (
        <Accordion.Item key={value} value={value} style={styles.accordionItem}>
          <Accordion.Header>
            <Accordion.Trigger style={styles.plainTrigger}>{title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel style={styles.bodyText}>{content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

function PopoverPreview({ side, align, ...props }: PreviewProps) {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger style={styles.trigger}>Open popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} side={side} align={align}>
          <Popover.Popup style={styles.popup}>
            <Popover.Title style={styles.popTitle}>Filter</Popover.Title>
            <Popover.Description style={styles.bodyText}>Popover content is portalled and positioned.</Popover.Description>
            <Popover.Close style={styles.smallButton}>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PreviewCardPreview({ side, align, delay, closeDelay, ...props }: PreviewProps) {
  return (
    <PreviewCard.Root {...props}>
      <PreviewCard.Trigger
        href="#"
        delay={delay}
        closeDelay={closeDelay}
        onClick={(event) => event.preventDefault()}
        style={styles.link}
      >
        @company/design-system
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8} side={side} align={align}>
          <PreviewCard.Popup style={styles.popup}>
            <strong style={styles.popTitle}>Company design system</strong>
            <span style={styles.bodyText}>Registry-first UI components backed by Base UI.</span>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

function TooltipPreview({ delay, closeDelay, side, align, content = "Tooltip content", ...props }: PreviewProps) {
  return (
    <Tooltip.Provider delay={delay} closeDelay={closeDelay}>
      <Tooltip.Root {...props}>
        <Tooltip.Trigger style={styles.trigger}>Hover or focus</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8} side={side} align={align}>
            <Tooltip.Popup style={styles.tooltip}>{content}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function MenuPreview({ side, align, ...props }: PreviewProps) {
  return (
    <Menu.Root {...props}>
      <Menu.Trigger style={styles.trigger}>Open menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} side={side} align={align}>
          <Menu.Popup style={styles.popup}>
            <Menu.Item style={styles.option}>New file</Menu.Item>
            <Menu.Item style={styles.option}>Duplicate</Menu.Item>
            <Menu.Separator style={styles.separator} />
            <Menu.Item style={styles.option}>Archive</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function ContextMenuPreview({ label = "Right-click this area", ...props }: PreviewProps) {
  return (
    <ContextMenu.Root {...props}>
      <ContextMenu.Trigger style={styles.contextArea}>{label}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup style={styles.popup}>
            <ContextMenu.Item style={styles.option}>Copy</ContextMenu.Item>
            <ContextMenu.Item style={styles.option}>Paste</ContextMenu.Item>
            <ContextMenu.Item style={styles.option}>Delete</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function MenubarPreview(props: PreviewProps) {
  return (
    <Menubar style={styles.segmented} {...props}>
      {["File", "Edit", "View"].map((label) => (
        <Menu.Root key={label}>
          <Menu.Trigger style={styles.segment}>{label}</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={6}>
              <Menu.Popup style={styles.popup}>
                <Menu.Item style={styles.option}>{label} item one</Menu.Item>
                <Menu.Item style={styles.option}>{label} item two</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ))}
    </Menubar>
  );
}

function NavigationMenuPreview(props: PreviewProps) {
  return (
    <NavigationMenu.Root {...props}>
      <NavigationMenu.List style={styles.navList}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger style={styles.trigger}>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div style={styles.navContent}>
              <NavigationMenu.Link href="#" onClick={(event) => event.preventDefault()} style={styles.option}>
                Registry
              </NavigationMenu.Link>
              <NavigationMenu.Link href="#" onClick={(event) => event.preventDefault()} style={styles.option}>
                Storybook
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#" onClick={(event) => event.preventDefault()} style={styles.trigger}>
            Docs
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={8}>
          <NavigationMenu.Popup style={styles.popup}>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

function ToastPreview({ title = "Changes saved", description = "Registry item updated.", ...props }: PreviewProps) {
  return (
    <Toast.Provider {...props}>
      <ToastTrigger title={title} description={description} />
      <Toast.Portal>
        <Toast.Viewport style={styles.toastViewport}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastTrigger({ title, description }: { title: string; description: string }) {
  const toastManager = Toast.useToastManager();

  return (
    <Button onClick={() => toastManager.add({ title, description })}>Show toast</Button>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} style={styles.toastRoot}>
      <Toast.Content>
        <Toast.Title style={styles.popTitle} />
        <Toast.Description style={styles.bodyText} />
        <Toast.Close style={styles.smallButton}>Dismiss</Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

function RadioPreview(props: PreviewProps) {
  return (
    <RadioGroup defaultValue="team" style={styles.fieldGroup} {...props}>
      <LabelRow>
        <Radio.Root value="team" style={styles.radio}>
          <Radio.Indicator style={styles.radioDot} />
        </Radio.Root>
        Team
      </LabelRow>
      <LabelRow>
        <Radio.Root value="company" style={styles.radio}>
          <Radio.Indicator style={styles.radioDot} />
        </Radio.Root>
        Company
      </LabelRow>
    </RadioGroup>
  );
}

function SwitchPreview({ label = "Enable notifications", defaultChecked = true, ...props }: PreviewProps) {
  return (
    <LabelRow>
      <Switch.Root defaultChecked={defaultChecked} {...props}>
        <Switch.Thumb />
      </Switch.Root>
      {label}
    </LabelRow>
  );
}

function SliderPreview({ defaultValue = 45, ...props }: PreviewProps) {
  return (
    <Slider.Root defaultValue={defaultValue} style={styles.sliderRoot} {...props}>
      <Slider.Control style={styles.sliderControl}>
        <Slider.Track style={styles.sliderTrack}>
          <Slider.Indicator style={styles.sliderIndicator} />
          <Slider.Thumb style={styles.sliderThumb} />
        </Slider.Track>
      </Slider.Control>
      <Slider.Value style={styles.bodyText} />
    </Slider.Root>
  );
}

function ProgressPreview({ value = 64, min = 0, max = 100, ...props }: PreviewProps) {
  return (
    <Progress.Root value={value} min={min} max={max} style={styles.progressRoot} {...props}>
      <Progress.Track style={styles.progressTrack}>
        <Progress.Indicator style={{ ...styles.progressIndicator, width: `${percentOf(value, min, max)}%` }} />
      </Progress.Track>
      <Progress.Value style={styles.bodyText} />
    </Progress.Root>
  );
}

function MeterPreview({ value = 72, min = 0, max = 100, label = "Adoption score", ...props }: PreviewProps) {
  return (
    <Meter.Root value={value} min={min} max={max} style={styles.progressRoot} {...props}>
      <Meter.Label style={styles.bodyText}>{label}</Meter.Label>
      <Meter.Track style={styles.progressTrack}>
        <Meter.Indicator style={{ ...styles.meterIndicator, width: `${percentOf(value, min, max)}%` }} />
      </Meter.Track>
      <Meter.Value style={styles.bodyText} />
    </Meter.Root>
  );
}

function percentOf(value: number, min: number, max: number) {
  if (max === min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function AvatarPreview({ src = defaultAvatarSrc, alt = "Company", fallback = "DS" }: PreviewProps) {
  return (
    <Avatar.Root style={styles.avatarRoot}>
      <Avatar.Image alt={alt} src={src || undefined} style={styles.avatarImage} />
      <Avatar.Fallback style={styles.avatarFallback}>{fallback}</Avatar.Fallback>
    </Avatar.Root>
  );
}

function CollapsiblePreview({ defaultOpen = true, ...props }: PreviewProps) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} style={styles.compactPanel} {...props}>
      <Collapsible.Trigger style={styles.plainTrigger}>Toggle release notes</Collapsible.Trigger>
      <Collapsible.Panel style={styles.bodyText}>Added registry preview and source ownership rules.</Collapsible.Panel>
    </Collapsible.Root>
  );
}

function ScrollAreaPreview({ orientation = "vertical", ...props }: PreviewProps) {
  const horizontal = orientation === "horizontal";

  return (
    <ScrollArea.Root style={styles.scrollRoot} {...props}>
      <ScrollArea.Viewport style={styles.scrollViewport}>
        <ScrollArea.Content style={horizontal ? { minWidth: "560px" } : undefined}>
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} style={styles.scrollRow}>
              Registry item {index + 1}
            </div>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation={orientation}
        style={horizontal ? { ...styles.scrollbar, height: "8px", width: "auto" } : styles.scrollbar}
      >
        <ScrollArea.Thumb style={styles.scrollThumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

function SeparatorPreview({ orientation = "horizontal", ...props }: PreviewProps) {
  const vertical = orientation === "vertical";

  return (
    <div
      style={
        vertical
          ? { ...styles.compactPanel, alignItems: "center", display: "flex", gap: "12px", height: "72px", width: "auto" }
          : styles.compactPanel
      }
    >
      <span>Before</span>
      <Separator
        orientation={orientation}
        style={vertical ? { ...styles.separator, height: "100%", width: "1px" } : styles.separator}
        {...props}
      />
      <span>After</span>
    </div>
  );
}

function TogglePreview({ label = "Bold", ...props }: PreviewProps) {
  return (
    <Toggle style={styles.trigger} {...props}>
      {label}
    </Toggle>
  );
}

function ToggleGroupPreview({ orientation = "horizontal", ...props }: PreviewProps) {
  return (
    <ToggleGroup
      defaultValue={["left"]}
      orientation={orientation}
      style={{ ...styles.segmented, flexDirection: orientation === "vertical" ? "column" : "row" }}
      {...props}
    >
      {["Left", "Center", "Right"].map((label) => (
        <Toggle key={label} value={label.toLowerCase()} style={styles.segment}>
          {label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

function ToolbarPreview({ orientation = "horizontal", ...props }: PreviewProps) {
  return (
    <Toolbar.Root
      orientation={orientation}
      style={{ ...styles.segmented, flexDirection: orientation === "vertical" ? "column" : "row" }}
      {...props}
    >
      {["Save", "Export", "More"].map((label) => (
        <Toolbar.Button key={label} style={styles.segment}>
          {label}
        </Toolbar.Button>
      ))}
    </Toolbar.Root>
  );
}

function FieldPreview({
  label = "Project name",
  description = "This preview shows field composition using registry Input.",
  errorText = "Project name is required.",
  ...props
}: PreviewProps) {
  return (
    <Field.Root style={styles.previewGrid} {...props}>
      <Field.Label style={styles.label}>{label}</Field.Label>
      <Field.Control className="ds-input ds-input--md" placeholder="Internal portal" />
      <Field.Description style={styles.helpText}>{description}</Field.Description>
      {props.invalid ? (
        <Field.Error match style={styles.errorText}>
          {errorText}
        </Field.Error>
      ) : null}
    </Field.Root>
  );
}

function FieldsetPreview({ legend = "Notification channels", ...props }: PreviewProps) {
  return (
    <Fieldset.Root style={styles.fieldset} {...props}>
      <Fieldset.Legend style={styles.label}>{legend}</Fieldset.Legend>
      <CheckboxGroupPreview disabled={props.disabled} />
    </Fieldset.Root>
  );
}

function FormPreview({ validationMode = "onSubmit", ...props }: PreviewProps) {
  return (
    <Form
      validationMode={validationMode}
      onSubmit={(event) => event.preventDefault()}
      style={styles.formPreview}
      {...props}
    >
      <Field.Root name="email" style={styles.previewGrid}>
        <Field.Control className="ds-input ds-input--md" placeholder="Email" required type="email" />
        <Field.Error style={styles.errorText} />
      </Field.Root>
      <Field.Root name="password" style={styles.previewGrid}>
        <Field.Control className="ds-input ds-input--md" minLength={8} placeholder="Password (8+ characters)" required type="password" />
        <Field.Error style={styles.errorText} />
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

function FormFieldPreview({
  label = "Email address",
  description = "We only use this for account notices.",
  error = ""
}: PreviewProps) {
  return (
    <FormField label={label} description={description || undefined} error={error || undefined} style={styles.previewGrid}>
      <Input isInvalid={Boolean(error)} placeholder="name@company.com" />
    </FormField>
  );
}

function NumberFieldPreview({ defaultValue = 12, ...props }: PreviewProps) {
  return (
    <NumberField.Root defaultValue={defaultValue} {...props}>
      <NumberField.Group style={styles.numberGroup}>
        <NumberField.Decrement style={styles.numberButton}>−</NumberField.Decrement>
        <NumberField.Input style={styles.numberInput} />
        <NumberField.Increment style={styles.numberButton}>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

function OtpFieldPreview({ length = 6, ...props }: PreviewProps) {
  return (
    <OTPField.Root length={length} style={styles.stack} {...props}>
      {Array.from({ length }, (_, index) => (
        <OTPField.Input key={index} className="ds-input ds-input--md" style={styles.otpInput} />
      ))}
    </OTPField.Root>
  );
}

function DirectionProviderPreview({ direction = "ltr" }: PreviewProps) {
  return (
    <DirectionProvider direction={direction}>
      <div dir={direction} style={styles.compactPanel}>
        <span style={styles.label}>Direction: {direction}</span>
        <SliderPreview />
      </div>
    </DirectionProvider>
  );
}

function CspProviderPreview({ nonce = "", disableStyleElements = false }: PreviewProps) {
  return (
    <CSPProvider nonce={nonce || undefined} disableStyleElements={disableStyleElements}>
      <div style={styles.headlessBox}>
        <strong>CSPProvider</strong>
        <span style={styles.bodyText}>
          nonce: {nonce || "(none)"} · disableStyleElements: {String(disableStyleElements)}
        </span>
        <SwitchPreview label="Base UI child inside provider" />
      </div>
    </CSPProvider>
  );
}

function HeadlessPreview({ name, note }: { name: string; note?: string }) {
  return (
    <div style={styles.headlessBox}>
      <strong>{name}</strong>
      <span style={styles.bodyText}>
        {note ?? "Headless primitive is registered. Add a styled wrapper API before product rollout."}
      </span>
    </div>
  );
}

function PreviewStack({ children }: { children: React.ReactNode }) {
  return <div style={styles.stack}>{children}</div>;
}

function PreviewGrid({ children }: { children: React.ReactNode }) {
  return <div style={styles.previewGrid}>{children}</div>;
}

function LabelRow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <label style={{ ...styles.labelRow, opacity: muted ? 0.65 : 1 }}>{children}</label>;
}

const styles = {
  actions: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end"
  },
  backdrop: {
    background: "rgba(0, 0, 0, 0.4)",
    inset: 0,
    position: "fixed"
  },
  contextArea: {
    alignItems: "center",
    border: "1px dashed var(--color-border)",
    borderRadius: "var(--radius-md)",
    color: "var(--color-muted-foreground)",
    display: "flex",
    fontSize: "14px",
    height: "120px",
    justifyContent: "center",
    width: "280px"
  },
  compactPanelBare: {
    display: "grid",
    gap: "10px",
    padding: "16px"
  },
  dialogPopup: {
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-overlay)",
    display: "grid",
    gap: "12px",
    left: "50%",
    maxWidth: "420px",
    padding: "20px",
    position: "fixed",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw - 32px)"
  },
  drawerPopup: {
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-overlay)",
    position: "fixed"
  },
  drawerViewport: {
    inset: 0,
    position: "fixed"
  },
  errorText: {
    color: "var(--color-danger)",
    fontSize: "13px",
    margin: 0
  },
  link: {
    color: "var(--color-primary)",
    fontWeight: 600,
    textDecoration: "underline"
  },
  navContent: {
    display: "grid",
    gap: "2px",
    minWidth: "180px"
  },
  navList: {
    display: "flex",
    gap: "8px",
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  numberButton: {
    background: "var(--color-secondary)",
    border: 0,
    cursor: "pointer",
    font: "inherit",
    padding: "0 12px"
  },
  numberGroup: {
    alignItems: "stretch",
    border: "1px solid var(--color-input)",
    borderRadius: "var(--radius-md)",
    display: "inline-flex",
    minHeight: "40px",
    overflow: "hidden"
  },
  numberInput: {
    background: "transparent",
    border: 0,
    font: "inherit",
    outline: 0,
    textAlign: "center",
    width: "72px"
  },
  tabIndicatorVertical: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    height: "var(--active-tab-height)",
    position: "absolute",
    right: 0,
    top: "var(--active-tab-top)",
    width: "2px"
  },
  toastRoot: {
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-overlay)",
    display: "grid",
    gap: "6px",
    padding: "12px 14px",
    width: "280px"
  },
  toastViewport: {
    bottom: "16px",
    display: "grid",
    gap: "8px",
    position: "fixed",
    right: "16px",
    zIndex: "var(--z-index-toast)"
  },
  accordionItem: {
    borderBottom: "1px solid var(--color-border)",
    display: "grid",
    gap: "8px",
    padding: "10px 0"
  },
  avatarFallback: {
    alignItems: "center",
    background: "var(--color-primary)",
    color: "var(--color-primary-foreground)",
    display: "flex",
    fontWeight: 700,
    inset: 0,
    justifyContent: "center",
    position: "absolute"
  },
  avatarImage: {
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },
  avatarRoot: {
    borderRadius: "var(--radius-full)",
    display: "inline-flex",
    height: "56px",
    overflow: "hidden",
    position: "relative",
    width: "56px"
  },
  bodyText: {
    color: "var(--color-muted-foreground)",
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0
  },
  check: {
    color: "var(--color-primary)",
    width: "18px"
  },
  compactPanel: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "10px",
    maxWidth: "420px",
    padding: "14px",
    width: "100%"
  },
  empty: {
    color: "var(--color-muted-foreground)",
    fontSize: "14px",
    padding: "10px 12px"
  },
  fieldGroup: {
    display: "grid",
    gap: "10px"
  },
  fieldset: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "12px",
    padding: "14px"
  },
  formPreview: {
    display: "grid",
    gap: "12px",
    maxWidth: "320px",
    width: "100%"
  },
  headlessBox: {
    background: "var(--color-muted)",
    border: "1px dashed var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "grid",
    gap: "8px",
    maxWidth: "520px",
    padding: "16px"
  },
  helpText: {
    color: "var(--color-muted-foreground)",
    fontSize: "13px"
  },
  iconButton: {
    background: "transparent",
    border: 0,
    color: "var(--color-muted-foreground)",
    cursor: "pointer",
    padding: "0 10px"
  },
  inputGroup: {
    alignItems: "center",
    background: "var(--color-background)",
    border: "1px solid var(--color-input)",
    borderRadius: "var(--radius-md)",
    display: "flex",
    minHeight: "40px",
    width: "280px"
  },
  label: {
    color: "var(--color-foreground)",
    fontSize: "14px",
    fontWeight: 600
  },
  labelRow: {
    alignItems: "center",
    display: "flex",
    gap: "10px",
    fontSize: "14px"
  },
  meterIndicator: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    display: "block",
    height: "100%",
    width: "72%"
  },
  option: {
    alignItems: "center",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    display: "flex",
    gap: "8px",
    minHeight: "34px",
    padding: "6px 10px"
  },
  otpInput: {
    textAlign: "center",
    width: "40px"
  },
  plainTrigger: {
    background: "transparent",
    border: 0,
    color: "var(--color-foreground)",
    cursor: "pointer",
    font: "inherit",
    fontWeight: 600,
    padding: 0,
    textAlign: "left",
    width: "100%"
  },
  popTitle: {
    fontSize: "14px",
    fontWeight: 700,
    margin: 0
  },
  popup: {
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-overlay)",
    display: "grid",
    gap: "4px",
    minWidth: "220px",
    padding: "6px",
    zIndex: "var(--z-index-dropdown)"
  },
  previewCanvas: {
    alignItems: "center",
    background: "var(--color-background)",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    minHeight: "132px",
    padding: "12px"
  },
  previewGrid: {
    display: "grid",
    gap: "10px",
    maxWidth: "320px",
    width: "100%"
  },
  progressIndicator: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    display: "block",
    height: "100%",
    width: "64%"
  },
  progressRoot: {
    display: "grid",
    gap: "8px",
    width: "280px"
  },
  progressTrack: {
    background: "var(--color-muted)",
    borderRadius: "var(--radius-full)",
    height: "10px",
    overflow: "hidden",
    width: "100%"
  },
  radio: {
    alignItems: "center",
    border: "1px solid var(--color-input)",
    borderRadius: "var(--radius-full)",
    display: "inline-flex",
    height: "18px",
    justifyContent: "center",
    width: "18px"
  },
  radioDot: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    display: "block",
    height: "8px",
    width: "8px"
  },
  rawInput: {
    background: "transparent",
    border: 0,
    color: "var(--color-foreground)",
    flex: 1,
    font: "inherit",
    minWidth: 0,
    outline: 0,
    padding: "0 12px"
  },
  scrollRoot: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    height: "156px",
    overflow: "hidden",
    position: "relative",
    width: "280px"
  },
  scrollRow: {
    borderBottom: "1px solid var(--color-border)",
    fontSize: "14px",
    padding: "10px 12px"
  },
  scrollThumb: {
    background: "var(--color-muted-foreground)",
    borderRadius: "var(--radius-full)",
    display: "block"
  },
  scrollbar: {
    background: "var(--color-muted)",
    padding: "2px",
    width: "8px"
  },
  scrollViewport: {
    height: "100%",
    width: "100%"
  },
  segmented: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    display: "inline-flex",
    overflow: "hidden"
  },
  segment: {
    background: "var(--color-background)",
    border: 0,
    borderRight: "1px solid var(--color-border)",
    cursor: "pointer",
    font: "inherit",
    padding: "8px 12px"
  },
  separator: {
    background: "var(--color-border)",
    height: "1px",
    width: "100%"
  },
  sliderControl: {
    alignItems: "center",
    display: "flex",
    minHeight: "32px"
  },
  sliderIndicator: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    display: "block",
    height: "100%"
  },
  sliderRoot: {
    display: "grid",
    gap: "8px",
    width: "280px"
  },
  sliderThumb: {
    background: "var(--color-background)",
    border: "2px solid var(--color-primary)",
    borderRadius: "var(--radius-full)",
    display: "block",
    height: "18px",
    width: "18px"
  },
  sliderTrack: {
    background: "var(--color-muted)",
    borderRadius: "var(--radius-full)",
    height: "8px",
    width: "100%"
  },
  smallButton: {
    background: "var(--color-secondary)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    justifySelf: "start",
    padding: "6px 10px"
  },
  stack: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  switchRoot: {
    alignItems: "center",
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
    display: "inline-flex",
    height: "24px",
    padding: "2px",
    width: "44px"
  },
  switchThumb: {
    background: "var(--color-background)",
    borderRadius: "var(--radius-full)",
    boxShadow: "var(--shadow-sm)",
    display: "block",
    height: "20px",
    transform: "translateX(20px)",
    width: "20px"
  },
  tab: {
    background: "transparent",
    border: 0,
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    font: "inherit",
    padding: "8px 10px"
  },
  tabIndicator: {
    background: "var(--color-primary)",
    borderRadius: "var(--radius-full)",
    bottom: 0,
    height: "2px",
    left: "var(--active-tab-left)",
    position: "absolute",
    width: "var(--active-tab-width)"
  },
  tabList: {
    borderBottom: "1px solid var(--color-border)",
    display: "flex",
    gap: "4px",
    position: "relative"
  },
  tooltip: {
    background: "var(--color-foreground)",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-background)",
    fontSize: "13px",
    padding: "6px 8px"
  },
  trigger: {
    alignItems: "center",
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    color: "var(--color-foreground)",
    cursor: "pointer",
    display: "inline-flex",
    font: "inherit",
    gap: "8px",
    minHeight: "40px",
    padding: "0 12px"
  }
} satisfies Record<string, React.CSSProperties>;
