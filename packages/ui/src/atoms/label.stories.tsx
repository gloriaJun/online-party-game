import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Input } from "./input";

const meta = {
  title: "Atoms/Label",
  component: Label,
  args: {
    children: "Label text",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="room-code">Room Code</Label>
      <Input id="room-code" placeholder="Enter room code" />
    </div>
  ),
};
