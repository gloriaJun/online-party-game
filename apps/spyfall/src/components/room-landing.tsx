"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { isValidRoomCode } from "@repo/game-common";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@repo/ui/card";

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

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
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
      <Card className="mb-6">
        <CardContent className="p-4">
          <CardTitle className="mb-1 text-center">
            {t("createRoom.title")}
          </CardTitle>
          <CardDescription className="mb-4 text-center">
            {t("createRoom.description")}
          </CardDescription>
          <Button
            className="w-full"
            disabled={!hasNickname}
            onClick={handleCreateRoom}
          >
            {t("createRoom.submit")}
          </Button>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">{t("or")}</span>
        <Separator className="flex-1" />
      </div>

      {/* Join Room Section */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-1 text-center">
            {t("joinRoom.title")}
          </CardTitle>
          <CardDescription className="mb-4 text-center">
            {t("joinRoom.description")}
          </CardDescription>
          <div className="mb-4">
            <Label htmlFor="room-code">{t("joinRoom.roomCode")}</Label>
            <Input
              id="room-code"
              placeholder={t("joinRoom.roomCodePlaceholder")}
              value={roomCode}
              onChange={handleRoomCodeChange}
              maxLength={6}
              className="mt-2 font-mono text-lg tracking-widest text-center uppercase"
            />
            {roomCodeError && (
              <p className="mt-1.5 text-sm text-destructive">
                {roomCodeError}
              </p>
            )}
          </div>
          <Button
            className="w-full"
            disabled={!hasNickname || roomCode.length !== 6}
            onClick={handleJoinRoom}
          >
            {t("joinRoom.submit")}
          </Button>
        </CardContent>
      </Card>
    </Card>
  );
}
