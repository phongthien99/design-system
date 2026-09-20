import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import registry from "../../company/ui/registry.json";
import { ComponentPreview } from "../component-previews";
import { playgrounds } from "../playgrounds";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "accordion") as RegistryStoryItem;
const playground = playgrounds["accordion"];

const meta = {
  title: "Registry/Company UI/Accordion",
  component: playground.component,
  args: playground.args,
  argTypes: playground.argTypes,
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  render: (args) => <ComponentPreview name="accordion" props={args} />
};

export const OpensOneItemAtATime: Story = {
  render: (args) => <ComponentPreview name="accordion" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const tokens = canvas.getByRole("button", { name: "Token first" });
    const accessibility = canvas.getByRole("button", { name: "Accessibility" });
    await expect(tokens).toHaveAttribute("aria-expanded", "true");
    await expect(accessibility).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(accessibility);
    await expect(accessibility).toHaveAttribute("aria-expanded", "true");
    await expect(tokens).toHaveAttribute("aria-expanded", "false");
  }
};
