import { BusinessCard } from "./BusinessCard";
import type { CardData } from "@/lib/cardStore";

interface Props {
  card: CardData;
  variant: "laser" | "stack" | "stationery" | "invoice";
  scale?: number;
}

export function CardMockup({ card, variant, scale = 1 }: Props) {
  const bg = {
    laser:      "linear-gradient(135deg,#2a2a2a 0%,#111 100%)", // Photo 1: dark, sleek
    stack:      "linear-gradient(135deg,#1c2636 0%,#0d1421 100%)", // Photo 2: dark navy blue
    stationery: "linear-gradient(135deg,#333 0%,#1a1a1a 100%)", // Photo 3: dark grey/black setup
    invoice:    "linear-gradient(135deg,#e0e5ec 0%,#c1c8d4 100%)", // Photo 4: light grey desk
  }[variant];

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-none md:rounded-2xl overflow-hidden grid place-items-center"
      style={{ background: bg }}
    >
      <div 
        className="absolute inset-0 origin-center flex items-center justify-center w-full h-full" 
        style={{ transform: `scale(${scale})` }}
      >
        {/* texture noise for all */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.25), transparent 50%)",
          }}
        />

        {variant === "laser" && (
          <div style={{ transform: "perspective(1200px) rotateX(15deg) rotateY(-10deg) rotateZ(5deg)", filter: "drop-shadow(-20px 20px 30px rgba(0,0,0,0.6))" }}>
            <BusinessCard card={{...card, type: "laser-cut"}} side="recto" scale={0.9} />
          </div>
        )}

        {variant === "stack" && (
          <div className="relative w-full h-full grid place-items-center">
            {/* Fake Gold Stapler Highlight */}
            <div className="absolute -top-[50px] right-[10%] w-[300px] h-[100px] rounded-full bg-gradient-to-r from-yellow-600 to-yellow-300 opacity-20 blur-3xl transform rotate-45 pointer-events-none" />
            
            <div className="absolute" style={{ transform: "translate(-50px,40px) rotate(-15deg)", filter: "blur(2px) drop-shadow(0 10px 10px rgba(0,0,0,0.5))", opacity: 0.8 }}>
              <BusinessCard card={card} side="verso" scale={0.7} />
            </div>
            <div className="absolute" style={{ transform: "translate(-20px,20px) rotate(-5deg)", filter: "blur(0.5px) drop-shadow(0 15px 15px rgba(0,0,0,0.5))" }}>
              <BusinessCard card={card} side="recto" scale={0.7} />
            </div>
            <div className="absolute" style={{ transform: "translate(20px,-10px) rotate(8deg)", filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.6))" }}>
              <BusinessCard card={card} side="recto" scale={0.75} />
            </div>
          </div>
        )}

        {variant === "stationery" && (
          <div className="relative w-full h-full grid place-items-center">
            {/* CSS Clipboard */}
            <div className="absolute left-[10%] top-[10%] w-[200px] h-[280px] bg-[#1f1f1f] border border-white/5 shadow-2xl rounded-sm flex justify-center">
              <div className="w-[80px] h-[15px] bg-[#111] rounded-b-md shadow-md mt-0" />
            </div>
            {/* CSS Envelope */}
            <div className="absolute right-[10%] top-[15%] w-[180px] h-[120px] bg-[#222] border border-white/5 shadow-xl flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-white/10" />
            </div>
            
            {/* Main card */}
            <div className="absolute" style={{ transform: "translate(30px, 30px) perspective(1000px) rotateZ(-2deg)", filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.5))" }}>
              <BusinessCard card={card} side="recto" scale={0.8} />
            </div>
          </div>
        )}

        {variant === "invoice" && (
          <div className="relative w-full h-full grid place-items-center">
            {/* Fake Invoice Document */}
            <div 
              className="absolute bg-white shadow-xl flex flex-col p-6 overflow-hidden"
              style={{ 
                width: "280px", height: "350px", 
                transform: "translate(40px, -20px) rotate(5deg)", 
                transformOrigin: "center"
              }}
            >
              <div className="w-full h-12 bg-blue-500/90 mb-6 flex items-center px-4"><div className="w-1/2 h-3 bg-white/50" /></div>
              <div className="w-1/2 h-4 bg-gray-200 mb-2" />
              <div className="w-1/3 h-4 bg-gray-200 mb-6" />
              <div className="w-full h-px bg-gray-300 mb-4" />
              <div className="w-full flex justify-between mb-3"><div className="w-10 h-3 bg-gray-200"/><div className="w-10 h-3 bg-gray-200"/></div>
              <div className="w-full flex justify-between mb-3"><div className="w-10 h-3 bg-gray-200"/><div className="w-10 h-3 bg-gray-200"/></div>
              <div className="w-full flex justify-between mb-3"><div className="w-10 h-3 bg-gray-200"/><div className="w-10 h-3 bg-gray-200"/></div>
            </div>
            
            {/* Cards over the invoice */}
            <div className="absolute" style={{ transform: "translate(-80px, -40px) perspective(1000px) rotateZ(-12deg)", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))" }}>
              <BusinessCard card={card} side="recto" scale={0.65} />
            </div>
            <div className="absolute" style={{ transform: "translate(-30px, 70px) perspective(1000px) rotateZ(-5deg)", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))" }}>
              <BusinessCard card={card} side="verso" scale={0.65} />
            </div>
          </div>
        )}

      </div>
      <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white/50 mix-blend-difference pointer-events-none">
        {variant} mockup
      </div>
    </div>
  );
}
