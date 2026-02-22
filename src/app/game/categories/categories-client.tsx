"use client";

import React, { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CategoriesClient() {
  const sp = useSearchParams();
  const players = sp?.get("players") ?? "?";
  const impostors = sp?.get("impostors") ?? "?";
  const ICONS: Record<string, string> = {
    Películas: '🎬',
    Series: '📺',
    Personajes: '🧑',
    Celebridades: '🌟',
    Animales: '🐾',
    Comida: '🍔',
    Disney: '🏰',
    Perú: '🦙',
  };

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

  function playHoverSound() {
    const a = hoverAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      void a.play();
    } catch (e) {
      // ignore play errors (user not interacted yet)
    }
  }
  const DESCRIPTIONS: Record<string, string> = {
    Películas: 'Los títulos y escenas más famosas de películas de todos los tiempos.',
    Series: 'Series populares de TV, tramas y temporadas que todos recuerdan.',
    Personajes: 'Personajes icónicos de películas o series, protagonistas y secundarios.',
    Celebridades: 'Famosos, celebridades y figuras públicas reconocidas mundialmente.',
    Animales: 'Especies, mascotas y criaturas del reino animal, domésticas y salvajes.',
    Comida: 'Platos, recetas, ingredientes y sabores de distintas cocinas al rededor del mundo.',
    Disney: 'Personajes, películas y momentos mágicos del mundo de Disney.',    
    Perú: 'Cosas, lugares y elementos icónicos de la cultura peruana.',  };

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <div className="cat-wrap">
        <div className="cat-header">
          <a className="back-btn" href="/game" aria-label="Volver">←</a>
          <div className="cat-title">CATEGORÍAS</div>
          <div className="cat-meta">
            <div>Jugadores: <strong>{players}</strong></div>
            <div>Fingidazos: <strong>{impostors}</strong></div>
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
            'Disney',
            'Perú',
          ].map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${selectedCat === cat ? 'selected' : ''}`}
              onMouseEnter={playHoverSound}
              onFocus={playHoverSound}
              onTouchStart={playHoverSound}
              onClick={() => {
                setSelectedCat((cur) => (cur === cat ? null : cat));
              }}
            >
              <div className="cat-icon">{ICONS[cat] ?? cat.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div className="cat-name">{cat}</div>
                <div className="cat-sub">{DESCRIPTIONS[cat] ?? 'Descripción breve'}</div>
              </div>
              <div className="cat-arrow">→</div>
            </button>
          ))}
        </div>
        <audio ref={hoverAudioRef} src="/sounds/mouse_up.mp3" preload="auto" aria-hidden />
      </div>

      <div className="play-row">
        <button
          className="play-btn"
          disabled={!selectedCat}
          onClick={() => {
            if (!selectedCat) return;
            router.push(`/game/play?cat=${encodeURIComponent(selectedCat)}&players=${players}&impostors=${impostors}`);
          }}
        >
          JUGAR
        </button>
      </div>
    </>
  );
}
