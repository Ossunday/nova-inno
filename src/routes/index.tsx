import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Sparkles, Layers, Zap, ScanLine } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { emptyCard, cardTypes, type CardType, type CardData } from "@/lib/cardStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Innovation — Cartes de visite premium avec QR code" },
      { name: "description", content: "Business card, métallique, PVC, transparent, invitation, découpe laser. Créez votre carte ultra-réaliste avec QR code." },
      { property: "og:title", content: "Nova Innovation — Cartes de visite premium" },
      { property: "og:description", content: "Générez des cartes de visite premium avec mockups téléchargeables." },
    ],
  }),
  component: Home,
});

const baseCard = (over: Partial<CardData>): CardData => ({
  ...emptyCard(),
  businessName: "Nova Studio",
  ceoName: "Awa Diop",
  domain: "Design • Branding",
  services: "Identité visuelle, web, motion",
  website: "novastudio.io",
  email: "hello@novastudio.io",
  phone: "+221 77 000 00 00",
  instagram: "novastudio",
  qrLink: "https://novainnovation.app",
  qrStyle: "rounded",
  ...over,
});

const carousel: CardData[] = [
  baseCard({ type: "business",        theme: "noir",                                        businessName: "Helios Tech",  domain: "Fintech" }),
  baseCard({ type: "metallic",        theme: "noir",                                        businessName: "Aurum Co.",     domain: "Luxury" }),
  baseCard({ type: "pvc",             theme: "orange",                                        businessName: "Volt Studio",   domain: "Energie" }),
  baseCard({ type: "pvc-transparent", theme: "noir",                                        businessName: "Crystal Lab",   domain: "Recherche" }),
  baseCard({ type: "invitation",      theme: "noir",                                        businessName: "Soirée Gala",   domain: "Évènement" }),
  baseCard({ type: "laser-cut",       theme: "pink",                                        businessName: "Sakura Atelier",domain: "Art • Mode" }),
];

function Home() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % carousel.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative bg-ink text-ink-foreground overflow-hidden rounded-b-[3rem]">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(50%_50%_at_75%_30%,rgba(212,255,58,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_15%_80%,rgba(255,126,182,0.15),transparent_60%)]" />

          <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                Nouveau — 6 types de cartes ultra-réalistes
              </div>
              <h1 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[0.95] tracking-tighter text-balance">
                Digitalisez votre <span className="text-orange">carte</span> de visite
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/70">
                Business, métallique, PVC, transparent, invitation ou découpe laser — créez votre carte
                avec QR code et téléchargez le mockup en JPG haute qualité.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/generate"
                  className="group inline-flex items-center gap-2 rounded-full bg-orange text-ink px-6 py-3.5 font-semibold hover:opacity-90 transition shadow-glow"
                >
                  Créer ma carte
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition" />
                </Link>
                <a href="#types" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/10 transition">
                  Voir les types
                </a>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-white/60">
                <div className="flex -space-x-2">
                  {["bg-orange","bg-pink-400","bg-amber-400","bg-emerald-400"].map((c) => (
                    <div key={c} className={`w-8 h-8 rounded-full border-2 border-ink ${c}`} />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-white">12K+ professionnels</div>
                  ont déjà créé leur carte
                </div>
              </div>
            </motion.div>

            {/* CAROUSEL */}
            <div className="relative h-[320px] md:h-[420px] w-full block mt-8 lg:mt-0 overflow-hidden sm:overflow-visible">
              {carousel.map((c, i) => {
                const offset = (i - active + carousel.length) % carousel.length;
                const visible = offset <= 3;
                const z = carousel.length - offset;
                const translate = offset * 22;
                const scale = 1 - offset * 0.06;
                const blur = offset === 0 ? 0 : Math.min(8, offset * 3);
                const opacity = offset === 0 ? 1 : Math.max(0.25, 1 - offset * 0.25);
                return (
                  <motion.div
                    key={c.id}
                    animate={{
                      x: translate,
                      y: -translate * 0.6,
                      scale,
                      opacity: visible ? opacity : 0,
                      filter: `blur(${blur}px)`,
                      rotate: offset === 0 ? 0 : 4 + offset * 1.5,
                    }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                    style={{ zIndex: z }}
                    className="absolute top-12 right-0 left-0 flex justify-center lg:right-8 lg:left-auto lg:block"
                  >
                    <BusinessCard card={c} scale={1.05} />
                    {offset === 0 && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange text-ink text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                        {cardTypes.find((t) => t.id === c.type)?.label}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Dots */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {carousel.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-orange" : "w-1.5 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-7xl px-6 -mt-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden shadow-card">
            {[
              { k: "6", v: "Types de cartes" },
              { k: "12K+", v: "Cartes créées" },
              { k: "<60s", v: "Temps moyen" },
              { k: "JPG", v: "Mockup HD" },
            ].map((s) => (
              <div key={s.k} className="bg-card p-6 text-center">
                <div className="font-display text-3xl font-bold">{s.k}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CARD TYPES */}
        <section id="types" className="mx-auto max-w-7xl px-6 mt-32">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <div className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Catalogue</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
              Choisissez le type qui vous correspond
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Six finitions premium. Chaque carte est rendue de façon ultra-réaliste avant impression ou export digital.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardTypes.map((t) => {
              const sample = baseCard({ type: t.id as CardType, businessName: t.label.split(" ")[0], domain: t.desc.split(" ")[0] });
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -6 }}
                  className="group p-6 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all"
                >
                  <div className="rounded-2xl bg-gradient-to-br from-secondary to-background p-6 grid place-items-center min-h-[220px]">
                    <div style={{ transform: "rotate(-4deg)" }}>
                      <BusinessCard card={sample} scale={0.65} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold">{t.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-xl font-bold">{t.price}€</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/ carte</div>
                    </div>
                  </div>
                  <Link
                    to="/generate"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:opacity-90"
                  >
                    Créer ce modèle <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-6 mt-32">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <div className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Fonctionnalités</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
              Tout ce qu'il faut pour briller
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { i: <ScanLine />,   t: "QR code stylisé",     d: "Arrondi, points ou carrés. Lien personnalisable." },
              { i: <Layers />,     t: "Mockups réalistes",   d: "4 scènes prêtes : bureau, main, stack, néon." },
              { i: <Zap />,        t: "Export JPG instant",  d: "Téléchargez votre carte et ses mockups en HD." },
              { i: <Sparkles />,   t: "Édition visuelle",    d: "Modifiez champs et thème en direct." },
              { i: <Check />,      t: "Sans inscription",    d: "Générez sans créer de compte." },
              { i: <ArrowUpRight />,t: "Panier & commande",  d: "Confirmez et payez en quelques clics." },
            ].map((f) => (
              <motion.div
                key={f.t}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-3xl bg-card border border-border hover:border-foreground/30 transition-all"
              >
                <div className="w-11 h-11 grid place-items-center rounded-xl bg-orange text-ink [&>svg]:w-5 [&>svg]:h-5">
                  {f.i}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 mt-32 mb-20">
          <div className="rounded-[2.5rem] bg-ink text-ink-foreground p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(60%_60%_at_80%_30%,rgba(212,255,58,0.3),transparent)]" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                  Prêt à créer la <span className="text-orange">vôtre</span> ?
                </h3>
                <p className="mt-4 text-white/70 text-lg max-w-md mx-auto md:mx-0">
                  Générez votre carte en moins d'une minute, sans inscription requise.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Link to="/generate" className="inline-flex items-center gap-2 rounded-full bg-orange text-ink px-8 py-4 font-bold text-lg hover:opacity-90 transition">
                  Démarrer maintenant <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
