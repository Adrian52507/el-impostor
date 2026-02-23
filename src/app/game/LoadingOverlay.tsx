"use client";

export function LoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        zIndex: 9999,
        background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
      }}
    >
      <style>{`
        .loading-dots {
          display: inline-flex;
          gap: 6px;
        }
        .loading-dots span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #00FF41;
          border-radius: 50%;
          opacity: 0.3;
          animation: jump 1.05s infinite;
        }
        .loading-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.12s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.24s;
        }
        @keyframes jump {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
      `}</style>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
