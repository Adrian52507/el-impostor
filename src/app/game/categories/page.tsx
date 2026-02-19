"use client";

import { useSearchParams } from "next/navigation";

export default function Categories() {
  const params = useSearchParams();
  const players = params?.get("players") ?? "?";
  const impostors = params?.get("impostors") ?? "?";

  return (
    <main className="w-full h-screen flex items-center justify-center" style={{background:'#000'}}>
      <div style={{color:'#00FF41',fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",padding:20,border:'1px solid #00FF41',maxWidth:640,width:'92%'}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:12}}>CATEGORÍAS</div>
        <div style={{marginBottom:8}}>Jugadores: <strong>{players}</strong></div>
        <div style={{marginBottom:16}}>Impostores: <strong>{impostors}</strong></div>
        <div style={{opacity:0.9}}>Selecciona una categoría para la partida (ejemplo):</div>
        <ul style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}>
          <li><button style={{background:'transparent',color:'#00FF41',border:'1px solid #00FF41',padding:'8px 10px',borderRadius:6}}>Clásico</button></li>
          <li><button style={{background:'transparent',color:'#00FF41',border:'1px solid #00FF41',padding:'8px 10px',borderRadius:6}}>Personalizado</button></li>
          <li><button style={{background:'transparent',color:'#00FF41',border:'1px solid #00FF41',padding:'8px 10px',borderRadius:6}}>Aleatorio</button></li>
        </ul>
      </div>
    </main>
  );
}
