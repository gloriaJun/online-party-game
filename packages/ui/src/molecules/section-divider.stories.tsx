import type { Meta, StoryObj } from "@storybook/react";
import { SectionDivider } from "./section-divider";

const meta = {
  title: "Molecules/SectionDivider",
  component: SectionDivider,
} satisfies Meta<typeof SectionDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  args: { label: "OR" },
};

export const WithoutLabel: Story = {
  args: {},
};
