import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";
import registry from "../../company/ui/registry.json";
import { ComponentPreview } from "../component-previews";
import { playgrounds } from "../playgrounds";
import { RegistryStoryShell, type RegistryStoryItem } from "../registry-story-shell";

const item = registry.items.find((entry) => entry.name === "dialog") as RegistryStoryItem;
const playground = playgrounds["dialog"];

const meta = {
  title: "Registry/Company UI/Dialog",
  component: playground.component,
  args: playground.args,
  argTypes: playground.argTypes,
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Playground: Story = {
  render: (args) => <ComponentPreview name="dialog" props={args} />
};

export const OpensAndCloses: Story = {
  render: (args) => <ComponentPreview name="dialog" props={args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    // The dialog is portalled outside the story canvas.
    const dialog = await screen.findByRole("dialog", { name: "Confirm publish" });
    await expect(dialog).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  }
};

export const ClosesOnEscape: Story = {
  render: (args) => <ComponentPreview name="dialog" props={args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  }
};
