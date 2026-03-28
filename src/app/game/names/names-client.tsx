"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingOverlay } from "../LoadingOverlay";

export default function NamesClient() {
  const sp = useSearchParams();
  const playersCount = parseInt(sp?.get("players") ?? "3", 10) || 3;
  const impostorsCount = parseInt(sp?.get("impostors") ?? "1", 10) || 1;

  const [names, setNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize names array
  useEffect(() => {
    setNames(Array(playersCount).fill(""));
  }, [playersCount]);

  function playClickSound() {
    const a = clickAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      void a.play();
    } catch (e) {
      // ignore
    }
  }

  function updateName(index: number, value: string) {
    const updated = [...names];
    updated[index] = value.substring(0, 20); // limit to 20 chars
    setNames(updated);
  }

  function doGlitch() {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 260);
  }

  const router = useRouter();

  function continueToCategories() {
    // Validate that at least the current name is filled
    const allFilled = names.every((n) => n.trim().length > 0);
    if (!allFilled) {
      alert("Por favor, ingresa un nombre para cada jugador.");
      return;
    }

    doGlitch();
    setIsLoading(true);

    setTimeout(() => {
      const namesParam = encodeURIComponent(JSON.stringify(names));
      router.push(
        `/game/categories?players=${playersCount}&impostors=${impostorsCount}&names=${namesParam}`
      );
    }, 1200);
  }

  const COLORS = {
    bg: "#000000",
    primary: "#00FF41",
    primaryDark: "#008F11",
    hover: "#39FF14",
  };

  return (
    <main style={{ background: COLORS.bg }} className="w-full h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        :root{--g:${COLORS.primary};--gd:${COLORS.primaryDark};--gh:${COLORS.hover};}
        *{box-sizing:border-box}
        .names-console{width:94%;max-width:900px;height:84vh;border:1px solid var(--g);padding:20px;display:flex;flex-direction:column;gap:14px;background:#000;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;color:var(--g);}
        .names-console .top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--g);padding-bottom:8px}
        .names-brand{text-transform:uppercase;letter-spacing:2px;font-size:18px;text-shadow:0 0 6px var(--g),0 0 16px var(--gd);padding:6px 0}
        .names-meta{font-size:13px;opacity:0.8}
        .names-screen{flex:1;padding:12px 0;overflow-y:auto;display:flex;flex-direction:column;gap:8px;scrollbar-width:none;-ms-overflow-style:none}
        .names-screen::-webkit-scrollbar{display:none}
        .name-row{display:flex;align-items:center;gap:12px;padding:8px;border:1px solid rgba(0,255,65,0.3);border-radius:4px}
        .name-label{min-width:120px;font-size:13px;opacity:0.8}
        .name-input{flex:1;background:transparent;border:none;color:var(--g);font-family:inherit;font-size:14px;padding:4px 6px;outline:none}
        .name-input::placeholder{color:rgba(0,255,65,0.4)}
        .controls-names{display:flex;gap:8px;margin-top:12px;justify-content:center}
        .cmd{border:1px solid var(--g);padding:8px 14px;background:transparent;color:var(--g);text-transform:uppercase;font-size:12px;cursor:pointer;border-radius:6px}
        .cmd:hover{color:var(--gh);box-shadow:0 0 10px var(--gh);border-color:var(--gh)}
        .cmd:disabled{opacity:0.35;cursor:not-allowed}
        .row{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--g);text-transform:uppercase;font-size:16px;line-height:1.1;text-shadow:0 0 6px var(--g),0 0 12px var(--gd);text-align:center}
        .names-console:before{content:"";position:absolute;inset:0;opacity:0.06;background-image:repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, #000 2px, #000 3px);pointer-events:none}
        .names-console{animation:subtleFlicker 5.5s infinite}
        @keyframes subtleFlicker{0%,100%{filter:brightness(1)}50%{filter:brightness(0.985)}}
        .speck{position:absolute;width:3px;height:3px;background:var(--g);opacity:0.07}
        @media (max-width:640px){.names-console{padding:12px;height:90vh}.names-brand{font-size:14px}.meta-sep{display:none}.names-meta{display:flex;flex-direction:column;align-items:flex-end;gap:2px}}
        @media (max-width:420px){
          .names-console{width:90%;padding:10px;height:83vh;gap:10px}
          .names-brand{font-size:16px;padding:6px 0}
          .names-meta{font-size:12px}
          .name-row{gap:8px;padding:6px}
          .name-label{min-width:80px;font-size:12px}
          .name-input{font-size:13px}
          .cmd{padding:8px 12px;font-size:11px}
        }
      `}</style>

      <div style={{ position: "relative" }} className={`names-console ${glitch ? "glitch" : ""}`}>
        {isLoading ? <LoadingOverlay /> : null}

        <div className="top">
          <div className="names-brand">SYSTEM: PLAYER_REGISTRY</div>
          <div className="names-meta">
            <strong>Jugadores</strong> {playersCount}<span className="meta-sep"> | </span><strong>Fingidazos</strong> {impostorsCount}
          </div>
        </div>

        <div className="names-screen">
          <div className="row" style={{ marginBottom: 12, opacity: 0.9 }}>INGRESA LOS NOMBRES:</div>

          {names.map((name, idx) => (
            <div key={idx} className="name-row">
              <div className="name-label">Jugador {idx + 1}:</div>
              <input
                type="text"
                className="name-input"
                placeholder={`Nombre ${idx + 1}`}
                value={name}
                onChange={(e) => updateName(idx, e.target.value)}
                onMouseDown={playClickSound}
                maxLength={20}
              />
            </div>
          ))}
        </div>

        <div className="controls-names">
          <button
            className="cmd"
            onClick={() => window.location.href = "/game"}
            onMouseDown={playClickSound}
          >
            Volver
          </button>
          <button
            className="cmd"
            onClick={continueToCategories}
            onMouseDown={playClickSound}
            disabled={isLoading}
          >
            Continuar
          </button>
        </div>

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
          <div className="speck" style={{ left: "8%", top: "14%" }} />
          <div className="speck" style={{ left: "30%", top: "40%" }} />
          <div className="speck" style={{ left: "52%", top: "22%" }} />
          <div className="speck" style={{ left: "74%", top: "56%" }} />
        </div>
        <audio ref={clickAudioRef} src="/sounds/key_1.mp3" preload="auto" aria-hidden />
      </div>
    </main>
  );
}
