import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import registry from "../../company/ui/registry.json";
import { ComponentPreview } from "../component-previews";
import { playgrounds } from "../playgrounds";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "checkbox") as RegistryStoryItem;
const playground = playgrounds["checkbox"];

const meta = {
  title: "Registry/Company UI/Checkbox",
  component: playground.component,
  args: playground.args,
  argTypes: playground.argTypes,
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  render: (args) => <ComponentPreview name="checkbox" props={args} />
};

export const TogglesOnClick: Story = {
  args: { defaultChecked: false, label: "Receive product updates" },
  render: (args) => <ComponentPreview name="checkbox" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: /receive product updates/i });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  }
};

export const DisabledIgnoresClick: Story = {
  args: { defaultChecked: false, disabled: true, label: "Receive product updates" },
  render: (args) => <ComponentPreview name="checkbox" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: /receive product updates/i });

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  }
};
