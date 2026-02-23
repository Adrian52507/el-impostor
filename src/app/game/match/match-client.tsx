"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function MatchClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const cat = sp?.get("cat") ?? "Películas";
  const players = sp?.get("players") ?? "?";
  const impostors = sp?.get("impostors") ?? "?";
  const secret = sp?.get("secret") ?? "(oculta)";
  const fingParam = sp?.get("fing") ?? "";
  const fingIndices = fingParam ? fingParam.split(",").map((s) => parseInt(s, 10)).filter(Boolean) : [];

  const [showSecret, setShowSecret] = React.useState(false);
  const [showFing, setShowFing] = React.useState(false);

  return (
    <main style={{ background: '#000' }} className="w-full h-screen flex items-center justify-center">
      <style>{`
        .wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:18px;border:1px solid #00FF41;max-width:760px;width:94%;}
        .headline{font-size:20px;font-weight:700}
        .meta{margin-top:10px;font-size:14px}
        .start{margin-top:18px}
        .btn{border:1px solid #00FF41;padding:8px 12px;background:transparent;color:#00FF41;border-radius:6px;cursor:pointer}
        .btn.pulse{animation:pulse 1.2s ease-in-out infinite;box-shadow:0 0 8px rgba(0,255,65,0.08)}
        @keyframes pulse{0%{transform:scale(1);box-shadow:0 0 6px rgba(0,255,65,0.06)}50%{transform:scale(1.015);box-shadow:0 0 18px rgba(0,255,65,0.18)}100%{transform:scale(1);box-shadow:0 0 6px rgba(0,255,65,0.06)}}
      `}</style>

      <div className="wrap" style={{textAlign:'center'}}>
        <div className="headline">*** GAME READY ***</div>
        <div className="meta">Categoría: <strong>{cat}</strong></div>
        <div className="meta">Jugadores: <strong>{players}</strong> — Fingidazos: <strong>{impostors}</strong></div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:12}}>
          <div style={{textAlign:'center'}}>
            <div className="meta">Palabra secreta</div>
            <div style={{marginTop:8}}>
              {!showSecret ? (
                <button className="btn pulse" onClick={() => setShowSecret(true)}>Tocar para revelar</button>
              ) : (
                <div style={{marginTop:8,fontSize:16}}><strong>{secret}</strong></div>
              )}
            </div>
          </div>

          <div style={{textAlign:'center'}}>
            <div className="meta">Fingidazo(s)</div>
            <div style={{marginTop:8}}>
              {!showFing ? (
                <button className="btn pulse" onClick={() => setShowFing(true)}>Tocar para revelar</button>
              ) : (
                <div style={{marginTop:8,fontSize:16}}>
                  {fingIndices.length ? (
                    <>
                      {fingIndices.length === 1 ? (
                        <span>Jugador <strong>{fingIndices[0]}</strong></span>
                      ) : (
                        <span>Jugadores <strong>{fingIndices.join(', ')}</strong></span>
                      )}
                    </>
                  ) : (
                    <em>No disponible</em>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="start">
          <button className="btn" onClick={() => router.push('/game')}>Volver al menú</button>
        </div>
      </div>
    </main>
  );
}
