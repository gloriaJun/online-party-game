"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { isValidRoomCode } from "@repo/game-common";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card } from "@repo/ui/card";
import { RoomCodeInput } from "@repo/ui/room-code-input";
import { SectionDivider } from "@repo/ui/section-divider";
import { FormSection } from "@repo/ui/form-section";

export function RoomLanding() {
  const t = useTranslations("landing");
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomCodeError, setRoomCodeError] = useState("");

  const handleCreateRoom = () => {
    if (!nickname.trim()) return;
    // TODO: Implement room creation with Supabase
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) return;
    if (!isValidRoomCode(roomCode)) {
      setRoomCodeError(t("joinRoom.invalidRoomCode"));
      return;
    }
    // TODO: Implement room joining with Supabase
  };

  const handleRoomCodeChange = (value: string) => {
    setRoomCode(value);
    if (roomCodeError) setRoomCodeError("");
  };

  const hasNickname = nickname.trim().length > 0;

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      {/* Nickname Input */}
      <div className="mb-6">
        <Label htmlFor="nickname">{t("nickname")}</Label>
        <Input
          id="nickname"
          placeholder={t("nicknamePlaceholder")}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="mt-2"
        />
      </div>

      {/* Create Room Section */}
      <FormSection
        title={t("createRoom.title")}
        description={t("createRoom.description")}
        className="mb-6"
      >
        <Button
          className="w-full"
          disabled={!hasNickname}
          onClick={handleCreateRoom}
        >
          {t("createRoom.submit")}
        </Button>
      </FormSection>

      {/* Divider */}
      <SectionDivider label={t("or")} className="mb-6" />

      {/* Join Room Section */}
      <FormSection
        title={t("joinRoom.title")}
        description={t("joinRoom.description")}
      >
        <div className="mb-4">
          <RoomCodeInput
            value={roomCode}
            onChange={handleRoomCodeChange}
            label={t("joinRoom.roomCode")}
            placeholder={t("joinRoom.roomCodePlaceholder")}
            error={roomCodeError}
          />
        </div>
        <Button
          className="w-full"
          disabled={!hasNickname || roomCode.length !== 6}
          onClick={handleJoinRoom}
        >
          {t("joinRoom.submit")}
        </Button>
      </FormSection>
    </Card>
  );
}
