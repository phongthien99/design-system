import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import registry from "../../company/ui/registry.json";
import { ComponentPreview } from "../component-previews";
import { playgrounds } from "../playgrounds";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "switch") as RegistryStoryItem;
const playground = playgrounds["switch"];

const meta = {
  title: "Registry/Company UI/Switch",
  component: playground.component,
  args: playground.args,
  argTypes: playground.argTypes,
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  render: (args) => <ComponentPreview name="switch" props={args} />
};

export const TogglesOnClick: Story = {
  args: { defaultChecked: false },
  render: (args) => <ComponentPreview name="switch" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).not.toBeChecked();

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();

    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
  }
};
