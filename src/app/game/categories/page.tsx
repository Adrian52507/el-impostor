import React from "react";

export default function Categories({ searchParams }: { searchParams?: { players?: string; impostors?: string } }) {
  const players = searchParams?.players ?? "?";
  const impostors = searchParams?.impostors ?? "?";
  const ICONS: Record<string, string> = {
    Películas: '🎬',
    Series: '📺',
    Personajes: '🧑',
    Celebridades: '🌟',
    Animales: '🐾',
    Comida: '🍔',
  };

  return (
    <main className="w-full h-screen flex items-center justify-center" style={{ background: '#000' }}>
      <style>{`
        .cat-wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:14px 20px;border:1px solid #00FF41;max-width:760px;width:94%;margin-block:8px}
        .cat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:12px}
        .cat-title{font-size:20px;font-weight:700}
        .cat-meta{font-size:13px;text-align:right}
        .back-btn{background:transparent;border:1px solid transparent;color:var(--g,#00FF41);padding:6px 8px;border-radius:6px;cursor:pointer;font-size:16px}
        .back-btn:active{transform:translateY(1px)}
        .cat-list{display:flex;flex-direction:column;gap:12px}
        .cat-btn{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;border:1px solid #00FF41;background:transparent;color:#00FF41;text-align:left;width:100%;cursor:pointer;transition:transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease}
        .cat-btn:hover{background:rgba(0,255,65,0.03);transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,255,65,0.04)}
        .cat-btn:active{transform:translateY(0);box-shadow:none;background:rgba(0,255,65,0.06)}
        .cat-icon{width:56px;height:40px;border-radius:6px;background:rgba(0,255,65,0.06);display:flex;align-items:center;justify-content:center;font-size:18px}
        .cat-name{font-size:16px;font-weight:700;text-transform:uppercase}
        .cat-sub{font-size:12px;opacity:0.8}
        .cat-arrow{font-size:12px;opacity:0.9}

        /* Mobile adjustments */
        @media (max-width:420px){
          .cat-wrap{padding:12px;width:94%;max-width:100%}
          .cat-title{font-size:18px}
          .cat-icon{width:48px;height:36px;font-size:16px}
          .cat-name{font-size:14px}
          .back-btn{padding:8px 10px}
        }

        /* Small-to-medium widths: ensure header wraps and controls don't overflow */
        @media (max-width:950px){
          .cat-header{flex-wrap:wrap;align-items:center}
          .cat-meta{width:100%;text-align:left;font-size:13px}
        }
      `}</style>

      <div className="cat-wrap">
        <div className="cat-header">
          <a className="back-btn" href="/game" aria-label="Volver">← Volver</a>
          <div className="cat-title">CATEGORÍAS</div>
          <div className="cat-meta">
            <div>Jugadores: <strong>{players}</strong></div>
            <div>Impostores: <strong>{impostors}</strong></div>
          </div>
        </div>

        <div style={{ opacity: 0.9, marginBottom: 12 }}>Selecciona una categoría para la partida:</div>

        <div className="cat-list">
          {[
            'Películas',
            'Series',
            'Personajes',
            'Celebridades',
            'Animales',
            'Comida',
          ].map((cat) => (
            <a
              key={cat}
              className="cat-btn"
              href={`/game/play?cat=${encodeURIComponent(cat)}&players=${players}&impostors=${impostors}`}
            >
              <div className="cat-icon">{ICONS[cat] ?? cat.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div className="cat-name">{cat}</div>
                <div className="cat-sub">Haz clic para empezar con la categoría de {cat.toLowerCase()}.</div>
              </div>
              <div className="cat-arrow">→</div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
