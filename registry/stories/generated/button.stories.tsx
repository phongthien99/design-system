import type { Meta, StoryObj } from "@storybook/react-vite";
import registry from "../../company/ui/registry.json";
import { Button } from "../../company/ui/primitives/button/button";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "button") as RegistryStoryItem;

const meta = {
  title: "Registry/Primitives/Button",
  component: Button,
  args: { children: "Button" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    className: { table: { disable: true } }
  },
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  args: { variant: "primary", size: "md" },
  render: (args) => <Button {...args} />
};
