"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { isValidRoomCode } from "@repo/game-common";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/ui/card";

export function JoinRoomForm() {
  const t = useTranslations("landing.joinRoom");
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [roomCodeError, setRoomCodeError] = useState("");

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setRoomCode(value);
    if (roomCodeError) setRoomCodeError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRoomCode(roomCode)) {
      setRoomCodeError(t("invalidRoomCode"));
      return;
    }
    // TODO: Implement room joining with Supabase
  };

  const isValid = nickname.trim() && roomCode.length === 6;

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="room-code">{t("roomCode")}</Label>
              <Input
                id="room-code"
                placeholder={t("roomCodePlaceholder")}
                value={roomCode}
                onChange={handleRoomCodeChange}
                maxLength={6}
                className="font-mono text-lg tracking-widest uppercase"
                required
              />
              {roomCodeError && (
                <p className="text-sm text-destructive">{roomCodeError}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="join-nickname">{t("nickname")}</Label>
              <Input
                id="join-nickname"
                placeholder={t("nicknamePlaceholder")}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!isValid}>
            {t("submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
