import type { Meta, StoryObj } from "@storybook/react";
import { FormSection } from "./form-section";
import { Button } from "../atoms/button";

const meta = {
  title: "Molecules/FormSection",
  component: FormSection,
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Create Room",
    description: "Start a new game room and invite friends",
    children: <Button className="w-full">Create Room</Button>,
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "Quick Action",
    children: <Button className="w-full">Go</Button>,
  },
};
