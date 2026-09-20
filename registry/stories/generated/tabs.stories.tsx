import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import registry from "../../company/ui/registry.json";
import { ComponentPreview } from "../component-previews";
import { playgrounds } from "../playgrounds";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "tabs") as RegistryStoryItem;
const playground = playgrounds["tabs"];

const meta = {
  title: "Registry/Company UI/Tabs",
  component: playground.component,
  args: playground.args,
  argTypes: playground.argTypes,
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  render: (args) => <ComponentPreview name="tabs" props={args} />
};

export const SwitchesPanels: Story = {
  render: (args) => <ComponentPreview name="tabs" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole("tab", { name: "Overview" });
    const usage = canvas.getByRole("tab", { name: "Usage" });
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(/keyboard navigation/i);

    await userEvent.click(usage);
    await expect(usage).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(/starting point/i);
  }
};

export const ArrowKeysMoveSelection: Story = {
  render: (args) => <ComponentPreview name="tabs" props={args} />,
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole("tab", { name: "Overview" });

    overview.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Usage" })).toHaveFocus();
  }
};
