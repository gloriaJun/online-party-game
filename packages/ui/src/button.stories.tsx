import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    appName: "Storybook",
    children: "Click me",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomClass: Story = {
  args: {
    className:
      "rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90",
    children: "Styled Button",
  },
};
