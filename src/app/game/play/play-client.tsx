"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pickRandomWord } from "../../../lib/wordBank";
import { LoadingOverlay } from "../LoadingOverlay";

type Role = "fingidazo" | "normal";
type Player = { id: number; role: Role; word?: string; revealed: boolean };

const IMPOSTOR_STREAKS_STORAGE_KEY = "el-impostor:impostor-streaks:v1";
const MAX_CONSECUTIVE_IMPOSTOR_MATCHES = 2;

export function PlayClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const cat = sp?.get("cat") ?? "Películas";
  const playersParam = parseInt(sp?.get("players") ?? "3", 10) || 3;
  const impostorsParam = parseInt(sp?.get("impostors") ?? "1", 10) || 1;
  const namesParam = sp?.get("names") ?? "";
  let playerNames: string[] = [];
  try {
    if (namesParam) {
      playerNames = JSON.parse(decodeURIComponent(namesParam));
    }
  } catch (e) {
    playerNames = [];
  }

  const playersCount = Math.max(3, Math.min(50, playersParam));
  const impostorsCount = Math.max(1, Math.min(Math.floor(playersCount / 2), impostorsParam));
  const rosterKey = useMemo(() => {
    const normalizedNames = Array.from({ length: playersCount }, (_, i) => {
      const rawName = playerNames[i] ?? "";
      const normalized = rawName.trim().toLowerCase();
      return normalized || `jugador-${i + 1}`;
    });
    return `${playersCount}::${normalizedNames.join("|")}`;
  }, [playersCount, namesParam]);

  const secret = useMemo(() => pickRandomWord(cat) ?? "(sin palabra)", [cat]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [current, setCurrent] = useState(0);
  const [fingIndices, setFingIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dragStartRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [draggingRevealed, setDraggingRevealed] = useState(false);

  function handleTouchStart(ev: React.TouchEvent) {
    if (!curPlayer) return;
    ev.preventDefault();
    const t = ev.touches[0];
    if (!t) return;
    dragStartRef.current = t.clientY;
    setIsDragging(true);
  }

  function handleTouchMove(ev: React.TouchEvent) {
    if (!isDragging || dragStartRef.current === null) return;
    ev.preventDefault();
    const t = ev.touches[0];
    if (!t) return;
    const dy = dragStartRef.current - t.clientY;
    setDragY(dy);
    setDraggingRevealed(dy > 60);
  }

  function handleTouchEnd() {
    setIsDragging(false);
    dragStartRef.current = null;
    setDragY(0);
    if (draggingRevealed) {
      revealCurrent();
    }
    setTimeout(() => setDraggingRevealed(false), 120);
  }

  useEffect(() => {
    // generate players and assign roles
    const arr: Player[] = Array.from(
      { length: playersCount },
      (_, i) => ({ id: i + 1, role: "normal" as Role, word: undefined, revealed: false })
    );
    // assign impostors (fingidazo) randomly with a max 2-match streak per player
    let prevStreaks = Array.from({ length: playersCount }, () => 0);
    try {
      const rawStored = localStorage.getItem(IMPOSTOR_STREAKS_STORAGE_KEY);
      if (rawStored) {
        const parsed: Record<string, number[]> = JSON.parse(rawStored);
        const savedStreaks = parsed[rosterKey];
        if (Array.isArray(savedStreaks)) {
          prevStreaks = Array.from({ length: playersCount }, (_, i) => {
            const value = savedStreaks[i];
            return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
          });
        }
      }
    } catch {
      prevStreaks = Array.from({ length: playersCount }, () => 0);
    }

    const indices = new Set<number>();
    const eligible = prevStreaks
      .map((streak, idx) => ({ streak, idx }))
      .filter((entry) => entry.streak < MAX_CONSECUTIVE_IMPOSTOR_MATCHES)
      .map((entry) => entry.idx);

    const selectable = [...eligible];
    while (indices.size < impostorsCount && selectable.length > 0) {
      const pick = Math.floor(Math.random() * selectable.length);
      const [selected] = selectable.splice(pick, 1);
      if (typeof selected === "number") {
        indices.add(selected);
      }
    }

    // Safety fallback: should rarely be needed, but guarantees we always assign the required impostors.
    if (indices.size < impostorsCount) {
      const fallback = Array.from({ length: playersCount }, (_, idx) => idx).filter((idx) => !indices.has(idx));
      while (indices.size < impostorsCount && fallback.length > 0) {
        const pick = Math.floor(Math.random() * fallback.length);
        const [selected] = fallback.splice(pick, 1);
        if (typeof selected === "number") {
          indices.add(selected);
        }
      }
    }

    const nextStreaks = prevStreaks.map((streak, idx) => {
      if (!indices.has(idx)) return 0;
      return Math.min(MAX_CONSECUTIVE_IMPOSTOR_MATCHES, streak + 1);
    });

    try {
      const rawStored = localStorage.getItem(IMPOSTOR_STREAKS_STORAGE_KEY);
      const parsed: Record<string, number[]> = rawStored ? JSON.parse(rawStored) : {};
      parsed[rosterKey] = nextStreaks;
      localStorage.setItem(IMPOSTOR_STREAKS_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // Ignore storage errors and keep game flow functional.
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
  }, [playersCount, impostorsCount, rosterKey, secret]);

  function revealCurrent() {
    setPlayers((prev) => prev.map((p, i) => (i === current ? { ...p, revealed: true } : p)));
  }

  function nextPlayer() {
    if (current + 1 < players.length) {
      setCurrent((c) => c + 1);
    } else {
      // all seen -> go to match screen
      setIsLoading(true);
      const fingParam = fingIndices.join(",");
      const nextNamesParam = namesParam ? `&names=${encodeURIComponent(namesParam)}` : "";
      router.push(
        `/game/match?cat=${encodeURIComponent(cat)}&players=${playersCount}&impostors=${impostorsCount}&secret=${encodeURIComponent(
          secret
        )}&fing=${encodeURIComponent(fingParam)}${nextNamesParam}`
      );
    }
  }

  const curPlayer = players[current];
  const revealRatio = Math.min(Math.max((curPlayer && curPlayer.revealed ? 1 : dragY / 120) || 0, 0), 1);

  return (
    <main style={{ background: "#000" }} className="w-full h-screen flex items-center justify-center">
      <style>{`
        @keyframes glitch {
          0% {
            transform: translate(0, 0);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          10% {
            transform: translate(-3px, 2px);
            clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
          }
          20% {
            transform: translate(2px, -2px);
            clip-path: polygon(0 0, 100% 8%, 100% 100%, 0 92%);
          }
          30% {
            transform: translate(-2px, 1px);
            clip-path: polygon(0 2%, 100% 0, 100% 98%, 0 100%);
          }
          40% {
            transform: translate(3px, -1px);
            clip-path: polygon(0 0, 100% 3%, 100% 100%, 0 97%);
          }
          50% {
            transform: translate(-1px, 0);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          60% {
            transform: translate(2px, 2px);
            clip-path: polygon(0 7%, 100% 0, 100% 93%, 0 100%);
          }
          70% {
            transform: translate(-3px, -1px);
            clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%);
          }
          80% {
            transform: translate(1px, 1px);
            clip-path: polygon(0 1%, 100% 0, 100% 99%, 0 100%);
          }
          90% {
            transform: translate(-2px, 0);
            clip-path: polygon(0 0, 100% 4%, 100% 100%, 0 96%);
          }
          100% {
            transform: translate(0, 0);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
        }
        .wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:18px;border:1px solid #00FF41;max-width:760px;width:94%;position:relative;overflow:hidden;height: min(78vh, 720px);}
        .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:20;pointer-events:none}
        .cardContainer{position:absolute;inset:0;box-sizing:border-box;padding:18px;display:flex;align-items:center;justify-content:center;z-index:40}
        .backCard{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0px;border:1px solid rgba(0,0,0,0.12);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:28px;background:#00FF41;color:#000;box-shadow:0 6px 18px rgba(0,0,0,0.35);z-index:1}
        .frontCard{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0px;border:1px solid rgba(0,255,65,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;cursor:pointer;z-index:2;touch-action:none;-webkit-user-drag:none;-webkit-tap-highlight-color:transparent;pointer-events:auto;animation:glitch 0.4s steps(10, end)}
        .frontCard.closed{background:#000}
        .frontCard .title{font-size:20px;font-weight:700}
        .frontCard .role{margin-top:10px;font-size:16px}
        .card-header{display:flex;justify-content:space-between;align-items:center}
        .card-category{font-size:13px}
        .controls{margin-top:18px;display:flex;gap:12px;align-items:center;justify-content:center}
        .btn{border:1px solid #00FF41;padding:8px 12px;background:transparent;color:#00FF41;border-radius:6px;cursor:pointer}
        .btn:disabled{opacity:0.35;cursor:not-allowed}
        .hint{font-size:15px;opacity:0.9;margin-bottom:10px}
        @media (min-width:421px) and (max-width:950px){
          .cardContainer{padding:18px}
        }
        @media (max-width:420px){
          .cardContainer{padding:12px}
          .frontCard .title{font-size:18px}
          .frontCard .role{font-size:14px}
          .card-header{flex-direction:column;justify-content:center;align-items:center;gap:6px}
          .card-category{font-size:12px}
        }
      `}</style>

      <div className="wrap">

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="cardContainer" aria-hidden={false}>
            <div
              className="backCard"
              aria-hidden={false}
              style={{
                // reveal ratio based on dragY (or fully revealed if player already marked revealed)
                opacity: revealRatio,
                transform: `translateY(${12 * (1 - revealRatio)}px)`,
                transition: isDragging ? "none" : "opacity 160ms ease, transform 160ms ease",
                pointerEvents: (curPlayer && curPlayer.revealed) || dragY > 60 ? "auto" : "none",
                justifyContent: "flex-end",
                paddingBottom: 28,
              }}
            >
              {!curPlayer ? (
                <div className="title">Generando...</div>
              ) : (
                <div style={{ textAlign: "center", padding: 12 }}>
                  {curPlayer.role === "fingidazo" ? (
                    <>
                      <div className="role" style={{ marginTop: 0, marginBottom: 16 }}>
                        <strong>FINGIDAZO 😈</strong>
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
              key={current}
              className={`frontCard ${curPlayer && curPlayer.revealed ? "open" : "closed"}`}
              role="button"
              aria-label={`Tarjeta jugador ${current + 1}`}
              onPointerDown={(e) => {
                if (!curPlayer) return;
                e.preventDefault();
                (e.target as Element).setPointerCapture?.(e.pointerId);
                dragStartRef.current = e.clientY;
                setIsDragging(true);
              }}
              onPointerMove={(e) => {
                if (!isDragging || dragStartRef.current === null) return;
                e.preventDefault();
                const dy = dragStartRef.current - e.clientY; // positive when moving up
                setDragY(dy);
                setDraggingRevealed(dy > 60);
              }}
              onPointerUp={(e) => {
                try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch { }
                setIsDragging(false);
                dragStartRef.current = null;
                setDragY(0);
                if (draggingRevealed) {
                  revealCurrent();
                }
                setTimeout(() => setDraggingRevealed(false), 120);
              }}
              onPointerCancel={(e) => {
                try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch { }
                setIsDragging(false);
                dragStartRef.current = null;
                setDragY(0);
                setDraggingRevealed(false);
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              style={{
                transform: isDragging ? `translateY(-${Math.min(dragY, 160)}px)` : undefined,
                transition: isDragging ? "none" : "transform 220ms ease",
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', boxSizing: 'border-box', padding: 18, justifyContent: 'space-between' }}>
                <div className="card-header">
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Reparto de roles</div>
                  <div className="card-category">Categoría: <strong>{cat}</strong></div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!curPlayer ? (
                    <div className="title">Generando...</div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20 }}>Arrastra hacia arriba para ver</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ textAlign: "center" }} className="hint">
                    {playerNames.length > current && playerNames[current]
                      ? playerNames[current]
                      : `Jugador ${current + 1}`}
                  </div>
                  <div className="controls">
                    <button
                      className="btn"
                      onClick={nextPlayer}
                      disabled={!curPlayer || !curPlayer.revealed}
                    >
                      {current + 1 < players.length ? "Siguiente jugador" : "Iniciar juego"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingOverlay /> : null}
    </main>
  );
}
