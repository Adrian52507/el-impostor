import { Suspense } from "react";
import CategoriesClient from "./categories-client";

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
      <style>{`
        .cat-wrap{color:#00FF41;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;padding:14px 20px 14px 25px;border:1px solid #00FF41;max-width:760px;width:94%;margin-block:8px;cursor:default}
        .cat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:12px}
        .cat-title{font-size:20px;font-weight:700}
        .cat-meta{font-size:13px;text-align:right}
        .back-btn{background:transparent;border:1px solid transparent;color:var(--g,#00FF41);padding:6px 8px;border-radius:6px;cursor:pointer;font-size:16px}
        .back-btn:active{transform:translateY(1px)}
        .cat-list{display:flex;flex-direction:column;gap:12px;max-height:288px;overflow-y:auto;padding-top:8px;padding-right:6px;-webkit-overflow-scrolling:touch;-ms-overflow-style:none;scrollbar-width:none}
        .cat-list::-webkit-scrollbar{display:none;width:0;height:0}
        .cat-btn{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;border:1px solid #00FF41;background:transparent;color:#00FF41;text-align:left;width:100%;cursor:pointer;transition:transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;font:inherit;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace}
        .cat-btn:hover{background:rgba(0,255,65,0.03);transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,255,65,0.04)}
        .cat-btn:active{transform:translateY(0);box-shadow:none;background:rgba(0,255,65,0.06)}
        .cat-icon{width:56px;height:40px;border-radius:6px;background:rgba(0,255,65,0.06);display:flex;align-items:center;justify-content:center;font-size:18px}
        .cat-name{font-size:16px;font-weight:700;text-transform:uppercase}
        .cat-sub{font-size:12px;opacity:0.8}
        .cat-arrow{font-size:12px;opacity:0.9}
        .cat-btn.selected{background:rgba(0,255,65,0.06);box-shadow:0 8px 18px rgba(0,255,65,0.03)}

        .play-row{display:flex;justify-content:center;padding:12px;width:100%}
        .play-btn{border:1px solid #00FF41;padding:10px 16px;background:transparent;color:#00FF41;text-transform:uppercase;border-radius:6px;cursor:pointer;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace}
        .play-btn:disabled{opacity:0.35;cursor:not-allowed}
        .play-btn:hover:not(:disabled){color:var(--gh,#39FF14);box-shadow:0 0 10px var(--gh,#39FF14);border-color:var(--gh,#39FF14)}

        /* Retro RUN fallback (match Game loading UI) */
        .run-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:auto;z-index:9999;background:linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7));}
        .run-card{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;color:#00FF41;padding:18px 22px;border-radius:6px;border:1px solid rgba(0,255,65,0.08);background:rgba(0,0,0,0.25);box-shadow:0 0 18px rgba(0,255,65,0.04);backdrop-filter:blur(2px)}
        .run-title{font-size:20px;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 8px #00FF41,0 0 14px rgba(0,143,17,0.4)}
        .run-dots{margin-left:8px;display:inline-block}
        .run-dots span{display:inline-block;margin-left:6px;color:#00FF41;opacity:0.2;transform:translateY(0);animation:runDot 1.05s infinite}
        .run-dots span:nth-child(1){animation-delay:0s}
        .run-dots span:nth-child(2){animation-delay:0.12s}
        .run-dots span:nth-child(3){animation-delay:0.24s}
        @keyframes runDot{0%{opacity:0.18;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}100%{opacity:0.18;transform:translateY(0)}}
        .run-bar{width:220px;height:10px;margin-top:10px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.06);border-radius:3px;overflow:hidden;position:relative}
        .run-bar:before{content:'';position:absolute;left:-40%;top:0;bottom:0;width:40%;background:linear-gradient(90deg,rgba(0,255,65,0.12),rgba(0,255,65,0.32),rgba(0,255,65,0.12));animation:barMove 1.6s linear infinite}
        @keyframes barMove{0%{transform:translateX(0)}100%{transform:translateX(300%)}}

        /* Mobile adjustments */
        @media (max-width:420px){
          .cat-wrap{padding:12px 12px 12px 17px;width:88%;max-width:360px;margin-left:auto;margin-right:auto;cursor:default}
          .cat-title{font-size:18px}
          .cat-icon{width:48px;height:36px;font-size:16px}
          .cat-name{font-size:14px}
          .back-btn{padding:8px 10px}
          .cat-list{max-height:420px;padding-top:6px;-ms-overflow-style:none;scrollbar-width:none}
          .cat-list::-webkit-scrollbar{display:none;width:0;height:0}
        }

        /* Small-to-medium widths: ensure header wraps and controls don't overflow */
        @media (max-width:950px){
          .cat-header{flex-wrap:wrap;align-items:center}
          .cat-meta{width:100%;text-align:left;font-size:13px}
        }

        @media (min-width:421px) and (max-width:950px){
          .cat-wrap{min-height:565px;max-width:640px;width:86%;margin-left:auto;margin-right:auto} /* Ensure enough height and reduce width on medium screens */
          .cat-list{max-height:400px} /* Reduce list height on medium screens to fit better */
        }
      `}</style>

      <Suspense
        fallback={
          <div className="run-overlay" role="status" aria-live="polite">
            <div className="run-card">
              <div className="run-title">CARGANDO<span className="run-dots"><span>.</span><span>.</span><span>.</span></span></div>
              <div className="run-bar" />
            </div>
          </div>
        }
      >
        <CategoriesClient />
      </Suspense>
    </main>
  );
}
