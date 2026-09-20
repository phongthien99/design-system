import "@company/theme/styles.css";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          [
            "Color",
            "Typography",
            "Spacing",
            "Sizing",
            "Border & Radius",
            "Shadow & Elevation",
            "Grid & Layout",
            "Iconography",
            "Motion",
            "Breakpoints"
          ],
          "Patterns",
          "Registry"
        ]
      }
    },
    a11y: {
      test: "todo"
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
