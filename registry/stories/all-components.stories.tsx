import type { Meta, StoryObj } from "@storybook/react-vite";
import registry from "../company/ui/registry.json";
import { RegistryCatalog, type RegistryStoryItem } from "./registry-story-shell";

// JSON imports widen `status` to string, so assert the item shape the catalog expects.
const items = (registry.items as RegistryStoryItem[]).filter((item) => item.type === "registry:ui");
const primitives = items.filter((item) => item.files?.some((file) => file.path.startsWith("primitives/")));
const components = items.filter((item) => item.files?.some((file) => file.path.startsWith("components/")));
const composites = items.filter((item) => item.files?.some((file) => file.path.startsWith("composites/")));

const meta: Meta = {
  title: "Registry/Catalog",
  render: () => <RegistryCatalog items={items} />
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Primitives: Story = {
  render: () => (
    <RegistryCatalog
      description="Smallest reusable UI elements used to build higher-level controls and layouts."
      items={primitives}
      title="Primitives"
    />
  )
};

export const Components: Story = {
  render: () => (
    <RegistryCatalog
      description="Complete UI controls with their own API, state, interaction and accessibility behavior."
      items={components}
      title="Components"
    />
  )
};

export const Composites: Story = {
  render: () => (
    <RegistryCatalog
      description="Reusable UI blocks composed from primitives and components."
      items={composites}
      title="Composites"
    />
  )
};
