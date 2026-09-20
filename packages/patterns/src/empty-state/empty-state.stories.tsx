import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Patterns/EmptyState",
  component: EmptyState
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: <Button variant="secondary">Create new</Button>,
    description: "There is no data to show yet.",
    title: "No results"
  }
};
