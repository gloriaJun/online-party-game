"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RoomCodeInput } from "./room-code-input";

const meta = {
  title: "Molecules/RoomCodeInput",
  component: RoomCodeInput,
  args: {
    value: "",
    onChange: () => {},
  },
} satisfies Meta<typeof RoomCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="max-w-sm">
        <RoomCodeInput
          value={value}
          onChange={setValue}
          label="Room Code"
          placeholder="ABC123"
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("ABC");
    return (
      <div className="max-w-sm">
        <RoomCodeInput
          value={value}
          onChange={setValue}
          label="Room Code"
          error="Room code must be 6 characters"
        />
      </div>
    );
  },
};
