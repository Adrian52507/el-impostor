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
    "ACCESO: AUTORIZADO",
    "INICIALIZANDO...",
    "ES TIEMPO DE ESCOGER EL NÚMERO DE JUGADORES Y FINGIDAZOS PARA INICIAR.",
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
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Typewriter per line
  // Typewriter per line (reliable, uses timeouts)
  useEffect(() => {
    if (!mounted.current) return;
    if (lineIndex >= lines.length) return;
    const current = lines[lineIndex];
    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 36);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setLineIndex((i) => i + 1), 600);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, lines]);

  useEffect(() => setCharIndex(0), [lineIndex]);

  function doGlitch() {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 260);
  }

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  async function playClickSound() {
    const a = clickAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      await a.play();
    } catch (e) {
      try {
        a.src = '/sounds/reveal.mp3';
        a.currentTime = 0;
        void a.play();
      } catch (e) {
        // ignore
      }
    }
  }

  function startGame() {
    doGlitch();
    setIsLoading(true);
    // show retro loading UI briefly before navigating
    setTimeout(() => {
      router.push(`/game/categories?players=${players}&impostors=${impostors}`);
    }, 1200);
  }

  const router = useRouter();

  return (
    <main style={{ background: COLORS.bg }} className="w-full h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        :root{--g:${COLORS.primary};--gd:${COLORS.primaryDark};--gh:${COLORS.hover};}
        *{box-sizing:border-box}
        .console{width:94%;max-width:980px;height:84vh;border:1px solid var(--g);padding:20px;display:flex;flex-direction:column;gap:14px;background:#000;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;color:var(--g);} 
        .console .top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--g);padding-bottom:8px}
        .brand{text-transform:uppercase;letter-spacing:2px;font-size:18px;text-shadow:0 0 6px var(--g),0 0 16px var(--gd);padding:6px 0}
        .cmds{display:flex;gap:8px;margin:0px 0px 5px 0px}
        .controls{display:flex;align-items:center;gap:12px}
        .setting{display:flex;align-items:center;gap:8px}
        .setting-label{font-size:12px}
        .value{min-width:36px;text-align:center}
        .cmd{border:1px solid var(--g);padding:6px 10px;background:transparent;color:var(--g);text-transform:uppercase;font-size:12px;cursor:pointer;border-radius:6px}
        .cmd:hover{color:var(--gh);box-shadow:0 0 10px var(--gh);border-color:var(--gh)}
        .cmd:disabled{opacity:0.35;cursor:not-allowed}
        .cmd:active{animation:glitchFrame 160ms steps(2,end)}
        .screen{flex:1;padding-top:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center}
        .row{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--g);text-transform:uppercase;font-size:16px;line-height:1.1;text-shadow:0 0 6px var(--g),0 0 12px var(--gd);text-align:center}
        .row.title{font-size:26px;font-weight:700}
        .cursor{display:inline-block;width:10px;height:18px;background:var(--g);margin-left:6px;vertical-align:middle;animation:blink 1s steps(2,start) infinite}
        /* Retro RUN loading UI */
        .run-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:auto;background:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.6));}
        .run-card{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;color:var(--g);padding:18px 22px;border-radius:6px;border:1px solid rgba(0,255,65,0.08);background:rgba(0,0,0,0.25);box-shadow:0 0 18px rgba(0,255,65,0.04);backdrop-filter:blur(2px);}
        .run-title{font-size:20px;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 8px var(--g),0 0 14px rgba(0,143,17,0.4)}
        .run-dots{margin-left:8px;display:inline-block}
        .run-dots span{display:inline-block;margin-left:6px;color:var(--g);opacity:0.2;transform:translateY(0);animation:runDot 1.05s infinite}
        .run-dots span:nth-child(1){animation-delay:0s}
        .run-dots span:nth-child(2){animation-delay:0.12s}
        .run-dots span:nth-child(3){animation-delay:0.24s}
        @keyframes runDot{0%{opacity:0.18;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}100%{opacity:0.18;transform:translateY(0)}}
        .run-bar{width:220px;height:10px;margin-top:10px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.06);border-radius:3px;overflow:hidden;position:relative}
        .run-bar:before{content:'';position:absolute;left:-40%;top:0;bottom:0;width:40%;background:linear-gradient(90deg,rgba(0,255,65,0.12),rgba(0,255,65,0.32),rgba(0,255,65,0.12));animation:barMove 1.6s linear infinite}
        @keyframes barMove{0%{transform:translateX(0)}100%{transform:translateX(300%)}}
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
          .console{width:90%;padding:10px;height:83vh;gap:10px}
          .console .top{flex-direction:column;align-items:center;gap:10px}
          .brand{font-size:16px;padding:6px 0}
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
          .console{margin-top:100px;margin-bottom:100px;margin-left:20px;margin-right:20px;height:70vh;} .top{flex-wrap:wrap;align-items:center;gap:12px}
          .controls{width:100%;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
          .setting{flex:0 1 auto;min-width:120px;align-items:center}
           .setting-label{font-size:13px}
           .cmds{display:flex;flex-wrap:wrap;gap:8px}
           .cmd{flex:0 0 auto}
        }
      `}</style>

          <div style={{position:'relative'}} className={`console ${glitch ? 'glitch' : ''}`}>
        {isLoading ? (
          <div className="run-overlay" role="status" aria-live="polite">
            <div className="run-card">
              <div className="run-title">CARGANDO<span className="run-dots"><span>.</span><span>.</span><span>.</span></span></div>
              <div className="run-bar" />
            </div>
          </div>
        ) : null}
        <div className="top">
          <div className="brand">SYSTEM: SECURE_TERMINAL</div>
          <div className="controls">
            <div className="setting">
                  <div className="setting-label" style={{color:COLORS.primary,textTransform:'uppercase'}}>Jugadores</div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <button
                  className="cmd"
                  onClick={() => updatePlayers(players - 1)}
                  onMouseDown={playClickSound}
                  disabled={players <= minPlayers}
                  aria-label="Disminuir jugadores"
                >
                  -
                </button>
                <div className="value">{players}</div>
                <button
                  className="cmd"
                  onClick={() => updatePlayers(players + 1)}
                  onMouseDown={playClickSound}
                  disabled={players >= maxPlayers}
                  aria-label="Aumentar jugadores"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting">
              <div style={{fontSize:12,color:COLORS.primary,textTransform:'uppercase'}}>Fingidazos</div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <button
                  className="cmd"
                  onClick={() => updateImpostors(impostors - 1)}
                  onMouseDown={playClickSound}
                  disabled={impostors <= 1}
                  aria-label="Disminuir impostores"
                >
                  -
                </button>
                <div className="value">{impostors}</div>
                <button
                  className="cmd"
                  onClick={() => updateImpostors(impostors + 1)}
                  onMouseDown={playClickSound}
                  disabled={impostors >= maxImpostorsFor(players)}
                  aria-label="Aumentar impostores"
                >
                  +
                </button>
              </div>
            </div>

            <div className="cmds">
              <button className="cmd" onClick={() => startGame()} onMouseDown={playClickSound} disabled={isLoading}>RUN</button>
            </div>
          </div>
        </div>

        <div className="screen">
          {lines.map((l, i) => {
            const isCurrent = i === lineIndex && lineIndex < lines.length;
            let shown = '';
            if (i < lineIndex) shown = l; // already completed lines
            else if (isCurrent) shown = l.slice(0, charIndex); // current typing line

            return (
              <div key={i} className={`row ${i === 0 ? 'title' : ''}`} style={{paddingBottom: i < lineIndex ? 8 : 6}}>
                <span>{shown}</span>
                {isCurrent && charIndex < l.length ? <span className="cursor" /> : null}
              </div>
            );
          })}

          {lineIndex >= lines.length ? (
            <div className="row" style={{marginTop:10}}>&gt;_ SYSTEM READY -- AWAITING COMMAND<span className="cursor" /></div>
          ) : null}
        </div>

        <div style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden>
          <div className="speck" style={{left:'8%',top:'14%'}} />
          <div className="speck" style={{left:'30%',top:'40%'}} />
          <div className="speck" style={{left:'52%',top:'22%'}} />
          <div className="speck" style={{left:'74%',top:'56%'}} />
        </div>
        <audio ref={clickAudioRef} src="/sounds/key_1.mp3" preload="auto" aria-hidden />
      </div>
    </main>
  );
}
