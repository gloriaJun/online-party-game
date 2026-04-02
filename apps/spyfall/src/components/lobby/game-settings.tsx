"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  type GameSettings as GameSettingsType,
  getSpyCountOptions,
  getTimerOptions,
} from "@/hooks/use-game-settings";

interface GameSettingsProps {
  readonly settings: GameSettingsType;
  readonly isHost: boolean;
  readonly playerCount: number;
  readonly onUpdate: (patch: Partial<GameSettingsType>) => void;
}

export function GameSettings({
  settings,
  isHost,
  playerCount,
  onUpdate,
}: GameSettingsProps) {
  const t = useTranslations();
  const spyOptions = getSpyCountOptions(playerCount);
  const timerOptions = getTimerOptions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {t("lobby.settings.title")}
          {!isHost && (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              ({t("lobby.settings.hostOnly")})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <Label htmlFor="spy-count">{t("lobby.settings.spyCount")}</Label>
            <Select
              value={String(settings.spyCount)}
              onValueChange={(v) => onUpdate({ spyCount: Number(v) })}
              disabled={!isHost}
            >
              <SelectTrigger id="spy-count" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spyOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="timer-duration">{t("lobby.settings.timer")}</Label>
            <Select
              value={String(settings.timerMinutes)}
              onValueChange={(v) => onUpdate({ timerMinutes: Number(v) })}
              disabled={!isHost}
            >
              <SelectTrigger id="timer-duration" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timerOptions.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {t("lobby.settings.minutes", { count: m })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
