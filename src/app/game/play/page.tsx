import { Suspense } from "react";
import { PlayClient } from "./play-client";

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <main style={{ background: "#000" }} className="w-full h-screen flex items-center justify-center">
          <div style={{ color: "#00FF41", fontSize: 18 }}>Cargando...</div>
        </main>
      }
    >
      <PlayClient />
    </Suspense>
  );
}
