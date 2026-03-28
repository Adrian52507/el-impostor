import { Suspense } from "react";
import NamesClient from "./names-client";

export const dynamic = 'force-dynamic';

export default function NamesPage() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
      <Suspense fallback={<div style={{ color: '#00FF41' }}>Cargando...</div>}>
        <NamesClient />
      </Suspense>
    </main>
  );
}
