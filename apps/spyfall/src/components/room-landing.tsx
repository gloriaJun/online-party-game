"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { isValidRoomCode } from "@repo/game-common";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card } from "@repo/ui/card";
import { RoomCodeInput } from "@repo/ui/room-code-input";
import { SectionDivider } from "@repo/ui/section-divider";
import { FormSection } from "@repo/ui/form-section";
import { createRoomAction, joinRoomAction } from "@/app/actions/room";

export function RoomLanding() {
  const t = useTranslations("landing");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoomCode = searchParams.get("roomCode") ?? "";
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [roomCodeError, setRoomCodeError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  const navigateToLobby = (code: string, playerId: string) => {
    const params = new URLSearchParams({
      nickname: nickname.trim(),
      playerId,
    });
    router.push(`/lobby/${code}?${params.toString()}`);
  };

  const handleCreateRoom = () => {
    if (!nickname.trim()) return;
    setActionError("");
    startTransition(async () => {
      const result = await createRoomAction(nickname.trim());
      if (result.success) {
        navigateToLobby(result.roomCode, result.playerId);
      } else {
        setActionError(tErrors(result.error));
      }
    });
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) return;
    if (!isValidRoomCode(roomCode)) {
      setRoomCodeError(t("joinRoom.invalidRoomCode"));
      return;
    }
    setActionError("");
    startTransition(async () => {
      const result = await joinRoomAction(roomCode, nickname.trim());
      if (result.success) {
        navigateToLobby(result.roomCode, result.playerId);
      } else {
        setActionError(tErrors(result.error));
      }
    });
  };

  const handleRoomCodeChange = (value: string) => {
    setRoomCode(value);
    if (roomCodeError) setRoomCodeError("");
    if (actionError) setActionError("");
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
          disabled={isPending}
        />
      </div>

      {/* Action Error */}
      {actionError && (
        <p className="mb-4 text-sm text-red-500" role="alert">
          {actionError}
        </p>
      )}

      {/* Create Room Section */}
      <FormSection
        title={t("createRoom.title")}
        description={t("createRoom.description")}
        className="mb-6"
      >
        <Button
          className="w-full"
          disabled={!hasNickname || isPending}
          onClick={handleCreateRoom}
        >
          {isPending ? t("createRoom.loading") : t("createRoom.submit")}
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
          disabled={!hasNickname || roomCode.length !== 6 || isPending}
          onClick={handleJoinRoom}
        >
          {isPending ? t("joinRoom.loading") : t("joinRoom.submit")}
        </Button>
      </FormSection>
    </Card>
  );
}
