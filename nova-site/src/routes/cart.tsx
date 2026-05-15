import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { useCardStore, cardTypes } from "@/lib/cardStore";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Mon panier — Nova Innovation" },
      { name: "description", content: "Finalisez votre commande de cartes de visite digitales." },
    ],
  }),
  component: Cart,
});

function priceFor(typeId: string) {
  return cardTypes.find((t) => t.id === typeId)?.price ?? 9;
}

function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCardStore();
  const [confirmed, setConfirmed] = useState(false);
  const [method, setMethod] = useState<"card" | "mobile" | "paypal">("card");

  const total = cart.reduce((n, i) => n + i.qty * priceFor(i.card.type), 0);

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 grid place-items-center text-primary text-3xl">✓</div>
            <h1 className="mt-6 font-display text-4xl font-bold">Commande confirmée</h1>
            <p className="mt-3 text-muted-foreground">Merci ! Votre carte digitale est prête. Un email de confirmation vous sera envoyé.</p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 font-semibold">
              Retour à l'accueil
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Mon panier</h1>

        {cart.length === 0 ? (
          <div className="mt-16 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">Votre panier est vide.</p>
            <Link to="/generate" className="mt-6 inline-flex rounded-full bg-foreground text-background px-6 py-3 font-semibold">
              Créer une carte
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-10">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.card.id} className="flex flex-col sm:flex-row gap-6 rounded-3xl bg-card border border-border p-5">
                  <div className="shrink-0 self-center">
                    <BusinessCard card={item.card} scale={0.55} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg truncate">{item.card.businessName || "Carte sans nom"}</div>
                    <div className="text-sm text-muted-foreground">{item.card.ceoName} · {item.card.domain}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {cardTypes.find((t) => t.id === item.card.type)?.label ?? "Carte digitale"} · QR code
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 rounded-full border border-border">
                        <button onClick={() => updateQty(item.card.id, item.qty - 1)} className="w-8 h-8 grid place-items-center hover:bg-secondary rounded-l-full">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.card.id, item.qty + 1)} className="w-8 h-8 grid place-items-center hover:bg-secondary rounded-r-full">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display font-bold">{(item.qty * priceFor(item.card.type)).toFixed(2)}€</div>
                        <button onClick={() => removeFromCart(item.card.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive inline-flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Annuler la commande
              </button>
            </div>

            <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-card border border-border p-6 space-y-5">
              <h2 className="font-display text-xl font-bold">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                <Row label="Sous-total" value={`${total.toFixed(2)}€`} />
                <Row label="Livraison digitale" value="Gratuit" />
                <Row label="TVA incluse" value={`${(total * 0.2).toFixed(2)}€`} muted />
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl font-bold">{total.toFixed(2)}€</span>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Moyen de paiement</div>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "card", label: "Carte" },
                    { id: "mobile", label: "Mobile" },
                    { id: "paypal", label: "PayPal" },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                        method === m.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setConfirmed(true); clearCart(); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3.5 font-semibold hover:opacity-90"
              >
                <CreditCard className="w-4 h-4" /> Confirmer et payer
              </button>
              <p className="text-xs text-muted-foreground text-center inline-flex items-center gap-1 justify-center w-full">
                <Lock className="w-3 h-3" /> Paiement 100% sécurisé
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
