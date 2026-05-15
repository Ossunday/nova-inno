import { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";
import type { QrStyle } from "@/lib/cardStore";

interface Props {
  value: string;
  size?: number;
  style?: QrStyle;
  fg?: string;
  bg?: string;
}

export function QRCode({ value, size = 160, style = "rounded", fg = "#0a0a14", bg = "#ffffff" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const text = value || "https://novainnovation.app";
    QRCodeLib.toCanvas(canvas, text, {
      width: size,
      margin: 1,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "H",
    }).then(() => {
      if (style === "rounded" || style === "dots") {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Read the rendered pixels and re-draw as rounded squares / dots
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const cell = Math.max(4, Math.floor(canvas.width / 33));
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y += cell) {
          for (let x = 0; x < canvas.width; x += cell) {
            const i = (y * canvas.width + x) * 4;
            const isDark = img.data[i] < 128;
            if (!isDark) continue;
            ctx.fillStyle = fg;
            const pad = style === "dots" ? cell * 0.15 : 0;
            const r = style === "dots" ? cell / 2 - pad : cell * 0.3;
            ctx.beginPath();
            const px = x + pad;
            const py = y + pad;
            const w = cell - pad * 2;
            const h = cell - pad * 2;
            if (style === "dots") {
              ctx.arc(x + cell / 2, y + cell / 2, r, 0, Math.PI * 2);
            } else {
              ctx.moveTo(px + r, py);
              ctx.arcTo(px + w, py, px + w, py + h, r);
              ctx.arcTo(px + w, py + h, px, py + h, r);
              ctx.arcTo(px, py + h, px, py, r);
              ctx.arcTo(px, py, px + w, py, r);
            }
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    });
  }, [value, size, style, fg, bg]);

  return <canvas ref={ref} width={size} height={size} className="rounded-lg" />;
}
