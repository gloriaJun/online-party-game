"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";

interface RoomCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  className?: string;
}

export function RoomCodeInput({
  value,
  onChange,
  label,
  placeholder = "ABC123",
  error,
  id = "room-code",
  className,
}: RoomCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    onChange(filtered);
  };

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={6}
        className="font-mono text-lg tracking-widest text-center uppercase"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
