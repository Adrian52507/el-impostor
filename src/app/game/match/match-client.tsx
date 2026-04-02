"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingOverlay } from "../LoadingOverlay";

export function MatchClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const cat = sp?.get("cat") ?? "Películas";
  const players = sp?.get("players") ?? "?";
  const playersCount = parseInt(players, 10) || 0;
  const impostors = sp?.get("impostors") ?? "?";
  const names = sp?.get("names") ?? "";
  const secret = sp?.get("secret") ?? "(oculta)";
  const fingParam = sp?.get("fing") ?? "";
  const fingIndices = fingParam ? fingParam.split(",").map((s) => parseInt(s, 10)).filter(Boolean) : [];
  let playerNames: string[] = [];
  try {
    if (names) {
      playerNames = JSON.parse(decodeURIComponent(names));
    }
  } catch {
    playerNames = [];
  }

  const [showSecret, setShowSecret] = React.useState(false);
  const [revealedPlayers, setRevealedPlayers] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showStarterOverlay, setShowStarterOverlay] = React.useState(true);
  const [isPickingStarter, setIsPickingStarter] = React.useState(true);
  const [rouletteLabel, setRouletteLabel] = React.useState("...");
  const [starterLabel, setStarterLabel] = React.useState("");
  const [passDirection, setPassDirection] = React.useState<"izquierda" | "derecha" | "">("");

  const playerLabels = React.useMemo(
    () =>
      Array.from({ length: playersCount }).map((_, idx) =>
        playerNames[idx]?.trim() ? playerNames[idx] : `Jugador ${idx + 1}`
      ),
    [playersCount, names]
  );

  React.useEffect(() => {
    if (!playersCount || !playerLabels.length) {
      setShowStarterOverlay(false);
      setIsPickingStarter(false);
      setStarterLabel("");
      return;
    }

    setShowStarterOverlay(true);
    setIsPickingStarter(true);
    setStarterLabel("");
    setPassDirection("");

    let tick = 0;
    const totalTicks = Math.max(18, playersCount * 8);
    const timer = window.setInterval(() => {
      const current = playerLabels[tick % playerLabels.length] ?? `Jugador ${(tick % playersCount) + 1}`;
      setRouletteLabel(current);
      tick += 1;

      if (tick >= totalTicks) {
        window.clearInterval(timer);
        const winner = playerLabels[Math.floor(Math.random() * playerLabels.length)];
        const direction = Math.random() < 0.5 ? "izquierda" : "derecha";
        setRouletteLabel(winner);
        setStarterLabel(winner);
        setPassDirection(direction);
        setIsPickingStarter(false);
      }
    }, 85);

    return () => window.clearInterval(timer);
  }, [playersCount, playerLabels]);

  function goTo(path: string) {
    if (isLoading) return;
    setIsLoading(true);
    router.push(path);
  }

  return (
    <main style={{ background: '#000' }} className="w-full min-h-screen flex items-center justify-center py-6 px-3">
      <style>{`
        .wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:18px;border:1px solid #00FF41;max-width:980px;width:100%;position:relative;overflow:hidden}
        .headline{font-size:20px;font-weight:700}
        .meta{margin-top:10px;font-size:14px}
        .top-section{margin-top:14px;padding:14px;border:1px solid rgba(0,255,65,0.35);border-radius:10px}
        .section-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
        .reveal-area{margin-top:10px;min-height:42px;display:flex;align-items:center;justify-content:center}
        .starter-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.94);display:flex;align-items:center;justify-content:center;padding:18px;z-index:40}
        .starter-panel{width:min(560px,100%);border:1px solid rgba(0,255,65,0.65);border-radius:10px;padding:16px;text-align:center;box-shadow:0 0 20px rgba(0,255,65,0.14)}
        .starter-title{font-size:13px;letter-spacing:.8px;text-transform:uppercase;opacity:.9}
        .starter-roulette{margin-top:12px;border:1px solid rgba(0,255,65,0.45);border-radius:8px;min-height:74px;display:flex;align-items:center;justify-content:center;padding:8px 10px;background:rgba(0,255,65,0.04)}
        .starter-name{font-size:24px;font-weight:700;letter-spacing:.4px;text-shadow:0 0 10px rgba(0,255,65,0.35)}
        .starter-name.rolling{animation:pickBlink .26s linear infinite}
        .starter-help{margin-top:10px;font-size:12px;opacity:.82;min-height:18px}
        .starter-final{margin-top:12px;font-size:15px}
        .start{margin-top:18px}
        .btn{border:1px solid #00FF41;padding:8px 12px;background:transparent;color:#00FF41;border-radius:6px;cursor:pointer}
        .btn.pulse{animation:pulse 1.2s ease-in-out infinite;box-shadow:0 0 8px rgba(0,255,65,0.08)}
        .players-wrap{margin-top:14px;padding:14px;border:1px solid rgba(0,255,65,0.35);border-radius:10px}
        .players-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:10px}
        .player-card{flex:0 0 calc(33.333% - 8px);border:1px solid rgba(0,255,65,0.45);border-radius:8px;padding:10px;text-align:center;min-height:128px;display:flex;flex-direction:column;justify-content:flex-start}
        .player-name{font-size:14px;font-weight:700;min-height:36px;display:flex;align-items:center;justify-content:center}
        .player-result{margin-top:10px;font-size:14px;min-height:30px;display:flex;align-items:center;justify-content:center}
        @media (max-width:640px){
          .wrap{padding:14px}
          .headline{font-size:18px}
          .meta{font-size:13px}
          .top-section,.players-wrap{padding:12px}
          .players-grid{gap:8px}
          .player-card{flex-basis:calc(33.333% - 5.5px);min-height:96px;padding:8px 6px}
          .player-name{font-size:12px;min-height:28px}
          .player-result{font-size:12px;min-height:24px}
          .btn{padding:6px 8px;font-size:12px}
          .starter-panel{padding:12px}
          .starter-name{font-size:19px}
        }
        @keyframes pickBlink{0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes pulse{0%{transform:scale(1);box-shadow:0 0 6px rgba(0,255,65,0.06)}50%{transform:scale(1.015);box-shadow:0 0 18px rgba(0,255,65,0.18)}100%{transform:scale(1);box-shadow:0 0 6px rgba(0,255,65,0.06)}}
      `}</style>

      <div className="wrap" style={{ textAlign: 'center' }}>
        {isLoading ? <LoadingOverlay /> : null}
        {showStarterOverlay ? (
          <div className="starter-overlay">
            <div className="starter-panel">
              <div className="starter-title">
                {isPickingStarter ? "Seleccionando jugador inicial..." : "Jugador inicial seleccionado"}
              </div>
              <div className="starter-roulette" aria-live="polite">
                <div className={`starter-name ${isPickingStarter ? "rolling" : ""}`}>{rouletteLabel}</div>
              </div>
              {isPickingStarter ? (
                <div className="starter-help">La ruleta está decidiendo quién empieza</div>
              ) : null}
              {!isPickingStarter ? (
                <>
                  <div className="starter-final">Empieza la partida: <strong>{starterLabel}</strong></div>
                  <div className="starter-final">Pasa el teléfono hacia la <strong>{passDirection}</strong></div>
                  <div style={{ marginTop: 14 }}>
                    <button className="btn pulse" onClick={() => setShowStarterOverlay(false)}>Entrar a la partida</button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="headline">*** GAME READY ***</div>
        <div className="meta">Categoría: <strong>{cat}</strong></div>
        <div className="meta">Jugadores: <strong>{players}</strong> — Fingidazos: <strong>{impostors}</strong></div>
        <div className="top-section" style={{ textAlign: 'center' }}>
          <div className="section-title">Palabra secreta</div>
          <div className="reveal-area">
            {!showSecret ? (
              <button className="btn pulse" onClick={() => setShowSecret(true)}>Tocar para revelar</button>
            ) : (
              <div style={{ marginTop: 8, fontSize: 18 }}><strong>{secret}</strong></div>
            )}
          </div>
        </div>

        <div className="players-wrap" style={{ textAlign: 'center' }}>
          <div className="section-title">Fingidazo(s)</div>
          <div className="players-grid">
            {Array.from({ length: playersCount }).map((_, idx) => {
              const playerNumber = idx + 1;
              const isRevealed = revealedPlayers.includes(playerNumber);
              const isFingidazo = fingIndices.includes(playerNumber);
              const label = playerLabels[idx] ?? `Jugador ${playerNumber}`;

              return (
                <div key={playerNumber} className="player-card">
                  <div className="player-name">{label}</div>
                  {!isRevealed ? (
                    <button
                      className="btn pulse"
                      onClick={() => setRevealedPlayers((prev) => [...prev, playerNumber])}
                    >
                      Revelar rol
                    </button>
                  ) : (
                    <div className="player-result">
                      {isFingidazo ? <strong>Fingidazo</strong> : <span>Jugador normal</span>}
                    </div>
                  )}
                </div>
              );
            })}
            {!playersCount && (
              <div style={{ marginTop: 8, fontSize: 14 }}>
                <em>No disponible</em>
              </div>
            )}
          </div>
        </div>

        <div className="start" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={() => {
              const namesParam = names ? `&names=${encodeURIComponent(names)}` : "";
              goTo(`/game/categories?players=${players}&impostors=${impostors}${namesParam}`);
            }}
            disabled={isLoading}
          >
            Escoger otra categoría
          </button>
          <button className="btn" onClick={() => goTo('/game')} disabled={isLoading}>Volver al menú</button>
        </div>
      </div>
    </main>
  );
}
