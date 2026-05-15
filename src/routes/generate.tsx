import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toJpeg } from "html-to-image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, Download, Edit3, ShoppingBag, Sparkles, Trash2, X, ZoomIn } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { CardMockup } from "@/components/CardMockup";
import { useCardStore, type CardData, type QrStyle, cardTypes } from "@/lib/cardStore";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Créer ma carte de visite — Nova Innovation" },
      { name: "description", content: "Choisissez le type de carte (business, métallique, PVC, transparent, invitation, laser) et générez en quelques étapes." },
    ],
  }),
  component: Generate,
});

const themes: { id: CardData["theme"]; label: string; bg: string }[] = [
  { id: "noir", label: "Noir",  bg: "linear-gradient(135deg,#1a1a1a,#0a0a0a)" },
  { id: "orange", label: "Orange",  bg: "linear-gradient(135deg,#FF4A09,#D83A00)" },
  { id: "pink", label: "Pink",  bg: "linear-gradient(135deg,#ff7eb6,#ff4d8d)" },
  { id: "gold", label: "Gold",  bg: "linear-gradient(135deg,#1a1a1a,#3a2a14)" },
];

const qrStyles: { id: QrStyle; label: string }[] = [
  { id: "rounded", label: "Arrondi" },
  { id: "dots", label: "Points" },
  { id: "squares", label: "Carrés" },
];

function Generate() {
  const draft = useCardStore((s) => s.draft);
  const setDraft = useCardStore((s) => s.setDraft);
  const resetDraft = useCardStore((s) => s.resetDraft);
  const addToCart = useCardStore((s) => s.addToCart);
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0: type, 1: entreprise, 2: contacts, 3: réseaux, 4: QR/style, 5: preview
  const steps = ["Type", "Entreprise", "Contacts", "Réseaux", "Style"];

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const handleAdd = () => {
    addToCart({ ...draft });
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-10">
        <div className="flex items-start justify-between mb-8 gap-6 flex-wrap">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
              {step === 5 ? "Votre carte est prête" : "Créez votre carte"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {step === 5 ? "Aperçu Recto/Verso, mockups et export JPG." : "Pas besoin d'inscription. Aperçu en direct à droite."}
            </p>
          </div>
          {step < 5 && <Stepper step={step} steps={steps} />}
        </div>

        {step < 5 ? (
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
            <div className="rounded-3xl bg-card border border-border p-8 shadow-soft">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 0 && (
                    <Section title="Choisissez le type de carte">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {cardTypes.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setDraft({ type: t.id })}
                            className={`text-left p-4 rounded-2xl border-2 transition ${
                              draft.type === t.id
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-display font-bold">{t.label}</div>
                              <div className="text-sm font-bold">{t.price}€</div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                          </button>
                        ))}
                      </div>
                    </Section>
                  )}
                  {step === 1 && (
                    <Section title="Informations entreprise (Recto)">
                      <Field label="Nom du business" value={draft.businessName} onChange={(v) => setDraft({ businessName: v })} placeholder="Nova Studio" />
                      <Field label="Nom & prénom du CEO" value={draft.ceoName} onChange={(v) => setDraft({ ceoName: v })} placeholder="Awa Diop" />
                      <Field label="Domaine d'activité" value={draft.domain} onChange={(v) => setDraft({ domain: v })} placeholder="Design & Branding" />
                      <Field label="Services proposés" value={draft.services} onChange={(v) => setDraft({ services: v })} placeholder="UI/UX, identité visuelle, web" textarea />
                    </Section>
                  )}
                  {step === 2 && (
                    <Section title="Coordonnées (Verso)">
                      <Field label="Site web" value={draft.website} onChange={(v) => setDraft({ website: v })} placeholder="novastudio.io" />
                      <Field label="Email" value={draft.email} onChange={(v) => setDraft({ email: v })} placeholder="hello@novastudio.io" type="email" />
                      <Field label="Numéro de téléphone" value={draft.phone} onChange={(v) => setDraft({ phone: v })} placeholder="+221 77 000 00 00" />
                    </Section>
                  )}
                  {step === 3 && (
                    <Section title="Réseaux sociaux (Verso)">
                      <Field label="Instagram" value={draft.instagram} onChange={(v) => setDraft({ instagram: v })} placeholder="novastudio" prefix="@" />
                      <Field label="Facebook" value={draft.facebook} onChange={(v) => setDraft({ facebook: v })} placeholder="Nova Studio" />
                      <Field label="TikTok" value={draft.tiktok} onChange={(v) => setDraft({ tiktok: v })} placeholder="novastudio" prefix="@" />
                    </Section>
                  )}
                  {step === 4 && (
                    <Section title="QR Code & Style">
                      <Field label="Lien à intégrer dans le QR code" value={draft.qrLink} onChange={(v) => setDraft({ qrLink: v })} placeholder="https://novastudio.io" />
                      <div>
                        <Label>Style du QR</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {qrStyles.map((q) => (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => setDraft({ qrStyle: q.id })}
                              className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${
                                draft.qrStyle === q.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
                              }`}
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Thème de la carte</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                          {themes.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setDraft({ theme: t.id })}
                              className={`relative h-20 rounded-xl overflow-hidden border-2 transition ${
                                draft.theme === t.id ? "border-foreground ring-4 ring-foreground/10" : "border-transparent"
                              }`}
                              style={{ background: t.bg }}
                            >
                              <span className="absolute bottom-1 left-2 text-xs font-semibold text-white drop-shadow mix-blend-difference">{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </Section>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-semibold disabled:opacity-40 hover:bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </button>
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90"
                >
                  {step === 4 ? "Générer la carte" : "Suivant"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Aperçu en direct (Recto & Verso)</div>
              <div className="rounded-3xl bg-gradient-to-br from-secondary to-background p-8 flex flex-col items-center gap-8 min-h-[320px] max-h-[calc(100vh-160px)] overflow-y-auto shadow-inner">
                <div className="relative">
                  <div className="absolute -top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-md z-10">Recto</div>
                  <BusinessCard card={draft} side="recto" scale={0.85} />
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="relative">
                  <div className="absolute -top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-md z-10">Verso</div>
                  <BusinessCard card={draft} side="verso" scale={0.85} />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                <Sparkles className="inline w-3 h-3 mr-1" />
                Type: <strong>{cardTypes.find((t) => t.id === draft.type)?.label}</strong> — modifications instantanées.
              </p>
            </div>
          </div>
        ) : (
          <PreviewStep
            card={draft}
            onEdit={() => setStep(0)}
            onAdd={handleAdd}
            onReset={() => { resetDraft(); setStep(0); }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stepper({ step, steps }: { step: number; steps: string[] }) {
  return (
    <div className="hidden md:flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold transition ${
            i < step ? "bg-foreground text-background" : i === step ? "bg-orange text-ink" : "bg-secondary text-muted-foreground"
          }`}>
            {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-border ml-1" />}
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold mb-1.5">{children}</label>;
}

function Field({
  label, value, onChange, placeholder, type = "text", textarea, prefix,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; textarea?: boolean; prefix?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>
        )}
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-input bg-background ${prefix ? "pl-8" : "px-4"} pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition`}
            style={prefix ? { paddingLeft: "1.75rem" } : undefined}
          />
        )}
      </div>
    </div>
  );
}

function PreviewStep({ card, onEdit, onAdd, onReset }: {
  card: CardData; onEdit: () => void; onAdd: () => void; onReset: () => void;
}) {
  const setDraft = useCardStore((s) => s.setDraft);
  const cardRef = useRef<HTMLDivElement>(null);
  const mockupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [zoomedMockup, setZoomedMockup] = useState<string | null>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toJpeg(cardRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: "#0a0a0a" });
    triggerDownload(dataUrl, `${slug(card.businessName)}-card-complet.jpg`);
  };

  const downloadMockup = async (key: string) => {
    const node = mockupRefs.current[key];
    if (!node) return;
    const dataUrl = await toJpeg(node, { quality: 0.95, pixelRatio: 2 });
    triggerDownload(dataUrl, `${slug(card.businessName)}-${key}.jpg`);
  };

  const mockups = [
    { id: "laser", title: "Découpe Laser" },
    { id: "stack", title: "Pile de cartes" },
    { id: "stationery", title: "Papeterie" },
    { id: "invoice", title: "Sur Facture" },
  ] as const;

  return (
    <div className="space-y-10">
      {/* Card hero */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-10 items-start">
        <div ref={cardRef} className="rounded-3xl bg-[#0a0a0a] p-12 flex flex-col items-center justify-center gap-10 min-h-[420px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(80%_80%_at_50%_50%,rgba(255,74,9,0.15),transparent)]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <div className="relative group">
              <div className="absolute -inset-4 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-white/50">Recto</div>
              <BusinessCard card={card} side="recto" scale={1} />
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-white/50">Verso</div>
              <BusinessCard card={card} side="verso" scale={1} />
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-display text-xl font-bold">Édition rapide</h3>
            <p className="text-sm text-muted-foreground mt-1">Modifiez directement les champs principaux.</p>
            <div className="mt-5 grid gap-4">
              <Field label="Nom du business" value={card.businessName} onChange={(v) => setDraft({ businessName: v })} />
              <Field label="CEO" value={card.ceoName} onChange={(v) => setDraft({ ceoName: v })} />
              <Field label="Lien QR" value={card.qrLink} onChange={(v) => setDraft({ qrLink: v })} />
              <div>
                <Label>Thème</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDraft({ theme: t.id })}
                      className={`h-12 rounded-lg border-2 transition ${card.theme === t.id ? "border-foreground ring-2 ring-foreground/10" : "border-transparent"}`}
                      style={{ background: t.bg }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onEdit} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border font-semibold hover:bg-secondary">
              <Edit3 className="w-4 h-4" /> Tout modifier
            </button>
            <button onClick={downloadCard} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange text-white font-semibold hover:opacity-90 shadow-glow">
              <Download className="w-4 h-4" /> Carte JPG
            </button>
            <button onClick={onAdd} className="col-span-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90">
              <ShoppingBag className="w-4 h-4" /> Ajouter au panier
            </button>
            <button onClick={onReset} className="col-span-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-destructive hover:bg-destructive/10 font-semibold text-sm">
              <Trash2 className="w-4 h-4" /> Annuler et recommencer
            </button>
          </div>
        </div>
      </div>

      {/* Mockups */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Mockups</div>
            <h2 className="mt-2 font-display text-3xl font-bold">Votre carte en situation</h2>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">Cliquez pour agrandir. Téléchargez en JPG haute qualité.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockups.map((m) => (
            <div key={m.id} className="space-y-3">
              <div 
                ref={(el) => { mockupRefs.current[m.id] = el; }}
                onClick={() => setZoomedMockup(m.id)}
                className="cursor-zoom-in relative group rounded-2xl overflow-hidden ring-1 ring-border hover:ring-foreground/30 transition-all duration-300"
              >
                <CardMockup card={card} variant={m.id as any} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-background/90 text-foreground p-3 rounded-full backdrop-blur-md shadow-xl transform translate-y-4 group-hover:translate-y-0 transition">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => downloadMockup(m.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary"
              >
                <Download className="w-4 h-4" /> {m.id.toUpperCase()}.jpg
              </button>
            </div>
          ))}
        </div>

        {/* Dialog Lightbox */}
        <Dialog.Root open={!!zoomedMockup} onOpenChange={(o) => !o && setZoomedMockup(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] outline-none animate-in zoom-in-95 duration-200">
              {zoomedMockup && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
                  <button 
                    onClick={() => setZoomedMockup(null)} 
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <CardMockup card={card} variant={zoomedMockup as any} scale={2} />
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>
    </div>
  );
}

function slug(s: string) {
  return (s || "nova-card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "nova-card";
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
