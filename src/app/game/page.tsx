"use client";

import { useState, useEffect } from "react";

export default function Game() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animar la entrada inmediatamente
    setIsVisible(true);
  }, []);

  return (
    <main className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <style jsx>{`
        @keyframes materialize {
          from {
            opacity: 0;
            transform: scale(0.4) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(0.6) translateY(0);
          }
        }

        .materialize {
          animation: materialize 0.6s ease-out forwards;
        }
      `}</style>

      <div
        className={`text-center transition-all duration-600 ${
          isVisible ? "materialize" : "opacity-0"
        }`}
      >
        <h1 className="text-6xl font-bold text-white mb-8">EL FINGIDAZO</h1>
        <p className="text-2xl text-gray-400">🎮 El juego viene pronto... 🎮</p>
      </div>
    </main>
  );
}
