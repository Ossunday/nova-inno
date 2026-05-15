import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QrStyle = "rounded" | "dots" | "squares";

export type CardType =
  | "business"
  | "metallic"
  | "pvc"
  | "pvc-transparent"
  | "invitation"
  | "laser-cut";

export const cardTypes: { id: CardType; label: string; desc: string; price: number }[] = [
  { id: "business",        label: "Business Card",        desc: "Carte premium en papier laminé.",                price: 5 },
  { id: "metallic",        label: "Carte Métallique",     desc: "Acier brossé gravé au laser.",                   price: 25 },
  { id: "pvc",             label: "Carte en PVC",         desc: "Plastique rigide finition mate.",                price: 8 },
  { id: "pvc-transparent", label: "PVC Transparent",      desc: "Plexi cristal effet verre.",                     price: 12 },
  { id: "invitation",      label: "Carte d'invitation",   desc: "Format événementiel élégant.",                   price: 6 },
  { id: "laser-cut",       label: "Découpe Laser",        desc: "Forme personnalisée découpée au laser.",         price: 15 },
];

export interface CardData {
  id: string;
  type: CardType;
  businessName: string;
  ceoName: string;
  domain: string;
  services: string;
  website: string;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  qrLink: string;
  qrStyle: QrStyle;
  theme: "noir" | "orange" | "pink" | "gold";
  createdAt: number;
}

export const emptyCard = (): CardData => ({
  id: crypto.randomUUID(),
  type: "business",
  businessName: "",
  ceoName: "",
  domain: "",
  services: "",
  website: "",
  email: "",
  phone: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  qrLink: "",
  qrStyle: "rounded",
  theme: "noir",
  createdAt: Date.now(),
});

interface CartItem {
  card: CardData;
  qty: number;
}

interface Store {
  draft: CardData;
  setDraft: (patch: Partial<CardData>) => void;
  resetDraft: () => void;
  loadDraft: (c: CardData) => void;

  cart: CartItem[];
  addToCart: (card: CardData) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCardStore = create<Store>()(
  persist(
    (set) => ({
      draft: emptyCard(),
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: emptyCard() }),
      loadDraft: (c) => set({ draft: { ...c } }),

      cart: [],
      addToCart: (card) =>
        set((s) => {
          const existing = s.cart.find((i) => i.card.id === card.id);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.card.id === card.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { cart: [...s.cart, { card, qty: 1 }] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.card.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart.map((i) => (i.card.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "nova-cards-v2" }
  )
);
