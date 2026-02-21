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

        /* Mobile adjustments */
        @media (max-width:420px){
          .cat-wrap{padding:12px 12px 12px 17px;width:94%;max-width:100%;cursor:default}
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
      `}</style>

      <Suspense fallback={<div style={{color:'#00FF41'}}>Cargando...</div>}>
        <CategoriesClient />
      </Suspense>
    </main>
  );
}
