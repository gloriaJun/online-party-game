import { useTranslations } from "next-intl";
import { Separator } from "@repo/ui/separator";
import { CreateRoomForm } from "@/components/create-room-form";
import { JoinRoomForm } from "@/components/join-room-form";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <CreateRoomForm />

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {t("landing.or")}
          </span>
          <Separator className="flex-1" />
        </div>

        <JoinRoomForm />
      </div>
    </main>
  );
}
