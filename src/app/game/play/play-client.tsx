"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pickRandomWord } from "../../../lib/wordBank";

type Role = "fingidazo" | "normal";
type Player = { id: number; role: Role; word?: string; revealed: boolean };

export function PlayClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const cat = sp?.get("cat") ?? "Películas";
  const playersParam = parseInt(sp?.get("players") ?? "3", 10) || 3;
  const impostorsParam = parseInt(sp?.get("impostors") ?? "1", 10) || 1;

  const playersCount = Math.max(3, Math.min(50, playersParam));
  const impostorsCount = Math.max(1, Math.min(Math.floor(playersCount / 2), impostorsParam));

  const secret = useMemo(() => pickRandomWord(cat) ?? "(sin palabra)", [cat]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [current, setCurrent] = useState(0);
  const [fingIndices, setFingIndices] = useState<number[]>([]);

  useEffect(() => {
    // generate players and assign roles
    const arr: Player[] = Array.from(
      { length: playersCount },
      (_, i) => ({ id: i + 1, role: "normal" as Role, word: undefined, revealed: false })
    );
    // assign impostors (fingidazo) randomly
    const indices = new Set<number>();
    while (indices.size < impostorsCount) {
      indices.add(Math.floor(Math.random() * playersCount));
    }
    indices.forEach((idx) => {
      arr[idx].role = "fingidazo";
      arr[idx].word = undefined;
    });
    setFingIndices(Array.from(indices).map((i) => i + 1));
    // give the secret word to normals
    arr.forEach((p) => {
      if (p.role === "normal") p.word = secret;
    });
    setPlayers(arr);
  }, [playersCount, impostorsCount, secret]);

  function revealCurrent() {
    setPlayers((prev) => prev.map((p, i) => (i === current ? { ...p, revealed: true } : p)));
  }

  function nextPlayer() {
    if (current + 1 < players.length) {
      setCurrent((c) => c + 1);
    } else {
      // all seen -> go to match screen
      const fingParam = fingIndices.join(",");
      router.push(
        `/game/match?cat=${encodeURIComponent(cat)}&players=${playersCount}&impostors=${impostorsCount}&secret=${encodeURIComponent(
          secret
        )}&fing=${encodeURIComponent(fingParam)}`
      );
    }
  }

  const curPlayer = players[current];

  return (
    <main style={{ background: "#000" }} className="w-full h-screen flex items-center justify-center">
      <style>{`
        .wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:18px;border:1px solid #00FF41;max-width:760px;width:94%;}
        .card{width:360px;height:220px;border-radius:8px;border:1px solid rgba(0,255,65,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.12);cursor:pointer}
        .card.closed{background:linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.25));}
        .card .title{font-size:20px;font-weight:700}
        .card .role{margin-top:10px;font-size:16px}
        .controls{margin-top:18px;display:flex;gap:12px;align-items:center;justify-content:center}
        .btn{border:1px solid #00FF41;padding:8px 12px;background:transparent;color:#00FF41;border-radius:6px;cursor:pointer}
        .btn:disabled{opacity:0.35;cursor:not-allowed}
        .hint{font-size:13px;opacity:0.9;margin-bottom:10px}
        @media (min-width:421px) and (max-width:950px){
          .card{width:280px;height:260px}
        }
        @media (max-width:420px){
          .card{width:240px;height:240px}
          .card .title{font-size:18px}
          .card .role{font-size:14px}
        }
      `}</style>

      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Reparto de roles</div>
          <div style={{ fontSize: 13 }}>
            Categoría: <strong>{cat}</strong>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 8 }} className="hint">
          Jugador {current + 1} de {players.length} — toca la tarjeta para revelar
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className={`card ${curPlayer && curPlayer.revealed ? "open" : "closed"}`}
            onClick={() => {
              if (!curPlayer) return;
              if (curPlayer.revealed) return;
              revealCurrent();
            }}
            role="button"
            aria-label={`Tarjeta jugador ${current + 1}`}
          >
            {!curPlayer ? (
              <div className="title">Generando...</div>
            ) : curPlayer.revealed ? (
              <div style={{ textAlign: "center", padding: 12 }}>
                {curPlayer.role === "fingidazo" ? (
                  <>
                    <div className="title">FINGIDAZO 😈</div>
                    <div className="role" style={{ marginTop: 8 }}>
                      Eres el Fingidazo — intenta descubrir la palabra sin que te descubran
                    </div>
                  </>
                ) : (
                  <>
                    <div className="title">JUGADOR</div>
                    <div className="role" style={{ marginTop: 8 }}>
                      Palabra: <strong>{curPlayer.word}</strong>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>Toca para ver</div>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button className="btn" onClick={revealCurrent} disabled={!curPlayer || curPlayer.revealed}>
            Revelar
          </button>
          <button
            className="btn"
            onClick={nextPlayer}
            disabled={!curPlayer || !curPlayer.revealed}
          >
            {current + 1 < players.length ? "Siguiente jugador" : "Ir al juego"}
          </button>
        </div>
      </div>
    </main>
  );
}
