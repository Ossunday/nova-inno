import { forwardRef } from "react";
import { Globe, Mail, Phone, Instagram, Facebook, MapPin, Sparkles } from "lucide-react";
import { QRCode } from "./QRCode";
import type { CardData, CardType } from "@/lib/cardStore";

type ThemeKey = CardData["theme"];

interface ThemeStyle {
  bg: string;
  fg: string;
  accent: string;
  sub: string;
  qrBg: string;
  qrFg: string;
  pattern?: string;
}

const baseThemes: Record<ThemeKey, ThemeStyle> = {
  noir: {
    bg: "linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%)",
    fg: "#ffffff",
    accent: "#FF4A09",
    sub: "rgba(255,255,255,0.65)",
    qrBg: "#ffffff",
    qrFg: "#0a0a0a",
  },
  orange: {
    bg: "linear-gradient(135deg,#FF4A09 0%,#D83A00 100%)",
    fg: "#ffffff",
    accent: "#ffffff",
    sub: "rgba(255,255,255,0.8)",
    qrBg: "#ffffff",
    qrFg: "#FF4A09",
  },
  pink: {
    bg: "linear-gradient(135deg,#ff7eb6 0%,#ff4d8d 100%)",
    fg: "#ffffff",
    accent: "#0a0a0a",
    sub: "rgba(255,255,255,0.8)",
    qrBg: "#ffffff",
    qrFg: "#0a0a0a",
  },
  gold: {
    bg: "linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%)",
    fg: "#ffffff",
    accent: "#c9a84c",
    sub: "rgba(255,255,255,0.7)",
    qrBg: "#ffffff",
    qrFg: "#0a0a0a",
  },
};

function styleForType(type: CardType, theme: ThemeStyle): { wrap: React.CSSProperties; overlay?: React.ReactNode; finishLabel: string } {
  switch (type) {
    case "metallic":
      return {
        wrap: {
          background:
            "linear-gradient(135deg,#5a5a5a 0%,#9a9a9a 25%,#cfcfcf 50%,#8a8a8a 75%,#3a3a3a 100%)",
          color: "#0a0a0a",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
        },
        overlay: (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 6px)",
              mixBlendMode: "overlay",
            }}
          />
        ),
        finishLabel: "Métal",
      };
    case "pvc":
      return {
        wrap: { background: theme.bg, color: theme.fg, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)" },
        overlay: (
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.08),transparent 40%)" }} />
        ),
        finishLabel: "PVC",
      };
    case "pvc-transparent":
      return {
        wrap: {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(200,220,255,0.10) 100%)",
          color: "#0a0a0a",
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.35), inset 0 0 40px rgba(255,255,255,0.25)",
        },
        overlay: (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.6) 45%, transparent 55%)",
              opacity: 0.35,
            }}
          />
        ),
        finishLabel: "Plexi",
      };
    case "invitation":
      return {
        wrap: {
          background:
            "linear-gradient(135deg,#fdf6ec 0%,#f5e6c8 100%)",
          color: "#3a2a14",
          boxShadow: "0 30px 80px -20px rgba(120,80,20,0.3)",
        },
        overlay: (
          <div className="absolute inset-3 pointer-events-none rounded-2xl border border-[#c9a84c]/40" />
        ),
        finishLabel: "Invitation",
      };
    case "laser-cut":
      return {
        wrap: {
          background: theme.bg,
          color: theme.fg,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.45)",
        },
        finishLabel: "Laser",
      };
    case "business":
    default:
      return {
        wrap: { background: theme.bg, color: theme.fg, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.45)" },
        finishLabel: "Premium",
      };
  }
}

interface Props {
  card: CardData;
  scale?: number;
  side?: "recto" | "verso";
}

export const BusinessCard = forwardRef<HTMLDivElement, Props>(function BusinessCard({ card, scale = 1, side = "recto" }, ref) {
  const t = baseThemes[card.theme] ?? baseThemes.noir;
  const s = styleForType(card.type, t);

  const isMetal = card.type === "metallic";
  const isTransparent = card.type === "pvc-transparent";
  const isInvit = card.type === "invitation";
  const isLaser = card.type === "laser-cut";

  const fg = isMetal ? "#0a0a0a" : isTransparent ? "#0a0a0a" : isInvit ? "#3a2a14" : t.fg;
  const sub = isMetal ? "rgba(0,0,0,0.7)" : isTransparent ? "rgba(0,0,0,0.7)" : isInvit ? "rgba(58,42,20,0.7)" : t.sub;
  const accent = isMetal ? "#0a0a0a" : isInvit ? "#c9a84c" : t.accent;
  const qrBg = isTransparent ? "rgba(255,255,255,0.7)" : isMetal ? "#0a0a0a" : isInvit ? "#3a2a14" : t.qrBg;
  const qrFg = isTransparent ? "#0a0a0a" : isMetal ? "#d4d4d4" : isInvit ? "#fdf6ec" : t.qrFg;

  const isRecto = side === "recto";

  // For Laser cut shape: heavily rounded left side on recto, flipped on verso
  const radius = isLaser
    ? (isRecto ? "130px 22px 22px 130px" : "22px 130px 130px 22px")
    : "22px";

  return (
    <div
      ref={ref}
      style={{
        width: 420 * scale,
        height: 260 * scale,
        perspective: 1000,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          ...s.wrap,
          color: fg,
          width: 420,
          height: 260,
          borderRadius: radius,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="relative p-6 overflow-hidden font-sans flex flex-col justify-center"
      >
        {s.overlay}

        {/* Accent corner bar */}
        {!isLaser && (
          <div
            className="absolute top-0 h-full w-1.5"
            style={{
              background: accent,
              opacity: isMetal ? 0.6 : 1,
              left: isRecto ? 0 : "auto",
              right: isRecto ? "auto" : 0,
            }}
          />
        )}

        {/* Laser Cut specific elements */}
        {isLaser && (
          <div
            className="absolute top-1/2 -translate-y-1/2 grid place-items-center"
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              boxShadow: "inset 0 10px 25px rgba(0,0,0,0.6), 0 2px 5px rgba(255,255,255,0.1)",
              border: `2px solid ${accent}`,
              [isRecto ? "left" : "right"]: 20,
            }}
          >
            <div style={{ color: accent }}>
              <Sparkles className="w-10 h-10" />
            </div>
            {/* Cutout rings */}
            <div className="absolute inset-2 border border-current opacity-30 rounded-full pointer-events-none" style={{ color: accent }} />
            <div className="absolute inset-4 border-2 border-current opacity-20 rounded-full pointer-events-none" style={{ color: accent }} />
          </div>
        )}

        <div className={`relative h-full flex flex-col justify-between ${isLaser ? (isRecto ? "pl-[170px]" : "pr-[170px]") : "px-3"}`}>
          {isRecto ? (
            // RECTO CONTENT
            <div className={`flex flex-col justify-center h-full ${isLaser && !isRecto ? 'items-end text-right' : ''}`}>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: sub }}>
                {card.domain || s.finishLabel}
              </div>
              <div className="font-display font-bold text-3xl leading-tight truncate">
                {card.businessName || "Votre Marque"}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1 h-5" style={{ background: accent }} />
                <div className="text-base font-medium" style={{ color: fg }}>{card.ceoName || "Nom du CEO"}</div>
              </div>
              {card.services && (
                <div className="text-xs mt-3 max-w-[220px] line-clamp-3 leading-relaxed" style={{ color: sub }}>
                  {card.services}
                </div>
              )}
            </div>
          ) : (
            // VERSO CONTENT
            <div className={`flex items-center justify-between h-full gap-6 ${isLaser ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1 flex flex-col justify-center gap-2 text-xs" style={{ color: sub }}>
                {card.phone && <Row icon={<Phone className="w-3.5 h-3.5" style={{ color: accent }} />}>{card.phone}</Row>}
                {card.email && <Row icon={<Mail className="w-3.5 h-3.5" style={{ color: accent }} />}>{card.email}</Row>}
                {card.website && <Row icon={<Globe className="w-3.5 h-3.5" style={{ color: accent }} />}>{card.website}</Row>}
                {card.instagram && <Row icon={<Instagram className="w-3.5 h-3.5" style={{ color: accent }} />}>@{card.instagram.replace(/^@/, "")}</Row>}
                {card.facebook && <Row icon={<Facebook className="w-3.5 h-3.5" style={{ color: accent }} />}>{card.facebook}</Row>}
                {card.tiktok && <Row icon={<MapPin className="w-3.5 h-3.5" style={{ color: accent }} />}>@{card.tiktok.replace(/^@/, "")}</Row>}
              </div>
              <div className="rounded-xl p-2 shrink-0 shadow-lg" style={{ background: qrBg }}>
                <QRCode
                  value={card.qrLink || card.website || "https://novainnovation.app"}
                  size={96}
                  style={card.qrStyle}
                  fg={qrFg}
                  bg={qrBg}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 truncate py-1">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}
