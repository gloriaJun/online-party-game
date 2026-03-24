import { Suspense } from "react";
import { RoomLanding } from "@/components/room-landing";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Suspense>
        <RoomLanding />
      </Suspense>
    </main>
  );
}
