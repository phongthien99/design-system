import type { Meta, StoryObj } from "@storybook/react-vite";
import registry from "../company/ui/registry.json";
import { RegistryCatalog } from "./registry-story-shell";

const items = registry.items.filter((item) => item.type === "registry:ui");

const meta: Meta = {
  title: "Registry/All Components",
  render: () => <RegistryCatalog items={items} />
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
