import type { Meta, StoryObj } from "@storybook/react-vite";
import registry from "../../company/ui/registry.json";
import { Input } from "../../company/ui/input/input";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "input") as RegistryStoryItem;

const meta = {
  title: "Registry/Company UI/Input",
  component: Input,
  args: { placeholder: "Type something" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    isInvalid: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    className: { table: { disable: true } }
  },
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  args: { size: "md" },
  render: (args) => <Input {...args} />
};
