"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = {
  bg: "#000000",
  primary: "#00FF41",
  primaryDark: "#008F11",
  hover: "#39FF14",
};

export default function Game() {
  const [lines, setLines] = useState<string[]>([
    "EL FINGIDAZO",
    "ACCESO: RESTRINGIDO",
    "INICIALIZANDO...",
    "ES TIEMPO DE ESCOGER EL NÚMERO DE JUGADORES E IMPOSTORES PARA INICIAR",
  ]);

  // Game settings
  const [players, setPlayers] = useState<number>(10);
  const [impostors, setImpostors] = useState<number>(2);

  const minPlayers = 3;
  const maxPlayers = 20;

  function clampPlayers(n: number) {
    return Math.max(minPlayers, Math.min(maxPlayers, n));
  }

  function maxImpostorsFor(p: number) {
    return Math.floor(p / 2);
  }

  function updatePlayers(n: number) {
    const p = clampPlayers(n);
    setPlayers(p);
    const maxI = maxImpostorsFor(p);
    setImpostors((cur) => Math.min(cur, Math.max(1, maxI)));
  }

  function updateImpostors(n: number) {
    const maxI = maxImpostorsFor(players);
    const i = Math.max(1, Math.min(maxI, n));
    setImpostors(i);
  }

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Typewriter per line
  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const current = lines[lineIndex];
    const t = setInterval(() => {
      setCharIndex((c) => {
        if (!mounted.current) return c;
        if (c + 1 > current.length) {
          clearInterval(t);
          setTimeout(() => setLineIndex((i) => i + 1), 600);
          return current.length;
        }
        return c + 1;
      });
    }, 36);
    return () => clearInterval(t);
  }, [lineIndex]);

  useEffect(() => setCharIndex(0), [lineIndex]);

  function doGlitch() {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 260);
  }

  function startGame() {
    doGlitch();
    // navigate to categories after the glitch animation
    setTimeout(() => {
      router.push(`/game/categories?players=${players}&impostors=${impostors}`);
    }, 260);
  }

  const router = useRouter();

  return (
    <main style={{ background: COLORS.bg }} className="w-full h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        :root{--g:${COLORS.primary};--gd:${COLORS.primaryDark};--gh:${COLORS.hover};}
        *{box-sizing:border-box}
        .console{width:94%;max-width:980px;height:84vh;border:1px solid var(--g);padding:20px;display:flex;flex-direction:column;gap:14px;background:#000;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;color:var(--g);} 
        .console .top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--g);padding-bottom:8px}
        .brand{text-transform:uppercase;letter-spacing:2px;font-size:18px;text-shadow:0 0 6px var(--g),0 0 16px var(--gd)}
        .cmds{display:flex;gap:8px}
        .controls{display:flex;align-items:center;gap:12px}
        .setting{display:flex;align-items:center;gap:8px}
        .value{min-width:36px;text-align:center}
        .cmd{border:1px solid var(--g);padding:6px 10px;background:transparent;color:var(--g);text-transform:uppercase;font-size:12px;cursor:pointer;border-radius:6px}
        .cmd:hover{color:var(--gh);box-shadow:0 0 10px var(--gh);border-color:var(--gh)}
        .cmd:disabled{opacity:0.35;cursor:not-allowed}
        .cmd:active{animation:glitchFrame 160ms steps(2,end)}
        .screen{flex:1;padding-top:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center}
        .row{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--g);text-transform:uppercase;font-size:16px;line-height:1.1;text-shadow:0 0 6px var(--g),0 0 12px var(--gd);text-align:center}
        .row.title{font-size:26px;font-weight:700}
        .cursor{display:inline-block;width:10px;height:18px;background:var(--g);margin-left:6px;vertical-align:middle;animation:blink 1s steps(2,start) infinite}
        @keyframes blink{50%{opacity:0}} 
        @keyframes glitchFrame{0%{transform:translate(0,0)}25%{transform:translate(-2px,0)}50%{transform:translate(2px,0)}75%{transform:translate(-1px,0)}100%{transform:translate(0,0)}}
        /* scanlines */
        .console:before{content:"";position:absolute;inset:0;opacity:0.06;background-image:repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, #000 2px, #000 3px);pointer-events:none}
        /* subtle flicker */
        .console{animation:subtleFlicker 5.5s infinite}
        @keyframes subtleFlicker{0%,100%{filter:brightness(1)}50%{filter:brightness(0.985)}}
        /* pixel specks */
        .speck{position:absolute;width:3px;height:3px;background:var(--g);opacity:0.07}
        @media (max-width:640px){.console{padding:12px;height:90vh}}
        /* Mobile phone adjustments */
        @media (max-width:420px){
          .console{width:90%;padding:10px;height:95vh;gap:10px}
          .console .top{flex-direction:column;align-items:center;gap:10px}
          .brand{font-size:16px}
          .controls{flex-direction:column;align-items:stretch;gap:10px;width:100%}
          .setting{justify-content:space-between;width:100%}
          .value{min-width:44px;font-size:16px}
          .cmd{padding:10px 14px;font-size:15px}
          .screen{padding-top:0}
          .row{font-size:15px}
          .row.title{font-size:20px}
          .cursor{width:8px;height:16px}
        }
        @media (min-width:421px) and (max-width:950px){
          .console{margin-right:20px;margin-left:20px;} .top{flex-wrap:wrap;align-items:center;gap:12px}
          .controls{width:100%;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
          .setting{flex:0 1 auto;min-width:120px}
          .cmds{display:flex;flex-wrap:wrap;gap:8px}
          .cmd{flex:0 0 auto}
        }
      `}</style>

          <div style={{position:'relative'}} className={`console ${glitch ? 'glitch' : ''}`}>
        <div className="top">
          <div className="brand">SISTEMA: SECURE_TERMINAL</div>
          <div className="controls">
            <div className="setting">
              <div style={{fontSize:12,color:COLORS.primary,textTransform:'uppercase'}}>Jugadores</div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <button
                  className="cmd"
                  onClick={() => updatePlayers(players - 1)}
                  disabled={players <= minPlayers}
                  aria-label="Disminuir jugadores"
                >
                  -
                </button>
                <div className="value">{players}</div>
                <button
                  className="cmd"
                  onClick={() => updatePlayers(players + 1)}
                  disabled={players >= maxPlayers}
                  aria-label="Aumentar jugadores"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting">
              <div style={{fontSize:12,color:COLORS.primary,textTransform:'uppercase'}}>Impostores</div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <button
                  className="cmd"
                  onClick={() => updateImpostors(impostors - 1)}
                  disabled={impostors <= 1}
                  aria-label="Disminuir impostores"
                >
                  -
                </button>
                <div className="value">{impostors}</div>
                <button
                  className="cmd"
                  onClick={() => updateImpostors(impostors + 1)}
                  disabled={impostors >= maxImpostorsFor(players)}
                  aria-label="Aumentar impostores"
                >
                  +
                </button>
              </div>
            </div>

            <div className="cmds">
              <button className="cmd" onClick={() => startGame()}>RUN</button>
              <button
                className="cmd"
                onClick={() => {
                  doGlitch();
                  setTimeout(() => router.push('/'), 260);
                }}
              >
                BACKDOOR
              </button>
            </div>
          </div>
        </div>

        <div className="screen">
          {lines.map((l, i) => {
            const isCurrent = i === lineIndex && lineIndex < lines.length;
            const shown = isCurrent ? l.slice(0, charIndex) : l;
            return (
              <div key={i} className={`row ${i === 0 ? 'title' : ''}`} style={{paddingBottom: i < lineIndex ? 8 : 6}}>
                <span>{shown}</span>
                {isCurrent && charIndex < l.length ? <span className="cursor" /> : null}
              </div>
            );
          })}

          <div className="row" style={{marginTop:10}}>&gt;_ SYSTEM READY -- AWAITING COMMAND <span className="cursor" /></div>
        </div>

        <div style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden>
          <div className="speck" style={{left:'8%',top:'14%'}} />
          <div className="speck" style={{left:'30%',top:'40%'}} />
          <div className="speck" style={{left:'52%',top:'22%'}} />
          <div className="speck" style={{left:'74%',top:'56%'}} />
        </div>
      </div>
    </main>
  );
}
