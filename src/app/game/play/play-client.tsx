"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
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
  const dragStartRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [draggingRevealed, setDraggingRevealed] = useState(false);
  const lastVibrateRef = useRef<number>(0);

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
        .wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:18px;border:1px solid #00FF41;max-width:760px;width:94%;position:relative;overflow:hidden;height: min(78vh, 720px);}
        .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:20;pointer-events:none}
        .cardContainer{position:absolute;inset:0;box-sizing:border-box;padding:18px;display:flex;align-items:center;justify-content:center;z-index:40}
        .backCard{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;border:1px solid rgba(0,0,0,0.12);display:flex;flex-direction:column;align-items:center;justify-content:center;background:#00FF41;color:#000;box-shadow:0 6px 18px rgba(0,0,0,0.35);z-index:1}
        .frontCard{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;border:1px solid rgba(0,255,65,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.12);cursor:pointer;z-index:2;touch-action:none;-webkit-user-drag:none;-webkit-tap-highlight-color:transparent;pointer-events:auto}
        .frontCard.closed{background:linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.25));}
        .frontCard .title{font-size:20px;font-weight:700}
        .frontCard .role{margin-top:10px;font-size:16px}
        .controls{margin-top:18px;display:flex;gap:12px;align-items:center;justify-content:center}
        .btn{border:1px solid #00FF41;padding:8px 12px;background:transparent;color:#00FF41;border-radius:6px;cursor:pointer}
        .btn:disabled{opacity:0.35;cursor:not-allowed}
        .hint{font-size:13px;opacity:0.9;margin-bottom:10px}
        @media (min-width:421px) and (max-width:950px){
          .cardContainer{padding:18px}
        }
        @media (max-width:420px){
          .cardContainer{padding:12px}
          .frontCard .title{font-size:18px}
          .frontCard .role{font-size:14px}
        }
      `}</style>

      <div className="wrap">

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="cardContainer" aria-hidden={false}>
            <div
              className="backCard"
              aria-hidden={!draggingRevealed}
              style={{
                opacity: draggingRevealed ? 1 : 0,
                transform: draggingRevealed ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 160ms ease, transform 160ms ease",
                pointerEvents: draggingRevealed ? "auto" : "none",
              }}
            >
              {!curPlayer ? (
                <div className="title">Generando...</div>
              ) : (
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
              )}
            </div>

            <div
              className={`frontCard ${curPlayer && curPlayer.revealed ? "open" : "closed"}`}
              role="button"
              aria-label={`Tarjeta jugador ${current + 1}`}
              onPointerDown={(e) => {
                if (!curPlayer) return;
                e.preventDefault();
                if (e.pointerType === "touch") {
                  navigator.vibrate?.(10);
                  lastVibrateRef.current = Date.now();
                }
                (e.target as Element).setPointerCapture?.(e.pointerId);
                dragStartRef.current = e.clientY;
                setIsDragging(true);
              }}
              onPointerMove={(e) => {
                if (!isDragging || dragStartRef.current === null) return;
                e.preventDefault();
                const dy = dragStartRef.current - e.clientY; // positive when moving up
                setDragY(dy);
                // haptic feedback on touch devices while dragging, throttled
                if (e.pointerType === "touch") {
                  const now = Date.now();
                  if (!draggingRevealed && dy > 60) {
                    // crossed threshold: stronger vibration
                    navigator.vibrate?.(40);
                    lastVibrateRef.current = now;
                  } else if (dy > 6 && now - lastVibrateRef.current > 120) {
                    // light tick while dragging
                    navigator.vibrate?.(8);
                    lastVibrateRef.current = now;
                  }
                }
                if (dy > 60) setDraggingRevealed(true);
                else setDraggingRevealed(false);
              }}
              onPointerUp={(e) => {
                try {(e.target as Element).releasePointerCapture?.(e.pointerId);} catch {}
                setIsDragging(false);
                dragStartRef.current = null;
                setDragY(0);
                if (draggingRevealed) {
                  revealCurrent();
                  if ((e as any).pointerType === "touch") navigator.vibrate?.(30);
                }
                setTimeout(() => setDraggingRevealed(false), 120);
              }}
              onPointerCancel={(e) => {
                try {(e.target as Element).releasePointerCapture?.(e.pointerId);} catch {}
                setIsDragging(false);
                dragStartRef.current = null;
                setDragY(0);
                setDraggingRevealed(false);
              }}
              style={{
                transform: isDragging ? `translateY(-${Math.min(dragY, 160)}px)` : undefined,
                transition: isDragging ? "none" : "transform 220ms ease",
              }}
            >
              <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',boxSizing:'border-box',padding:18,justifyContent:'space-between'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Reparto de roles</div>
                  <div style={{ fontSize: 13 }}>Categoría: <strong>{cat}</strong></div>
                </div>

                <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {!curPlayer ? (
                    <div className="title">Generando...</div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20 }}>Arrastra hacia arriba para ver</div>
                    </div>
                  )}
                </div>

                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <div style={{ textAlign: "center" }} className="hint">
                    Jugador {current + 1} de {players.length} — arrastra la tarjeta hacia arriba para ver
                  </div>
                  <div className="controls">
                    <button
                      className="btn"
                      onClick={nextPlayer}
                      disabled={!curPlayer || !curPlayer.revealed}
                    >
                      {current + 1 < players.length ? "Siguiente jugador" : "Ir al juego"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
