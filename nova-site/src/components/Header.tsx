import { Link } from "@tanstack/react-router";
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCardStore } from "@/lib/cardStore";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const cart = useCardStore((s) => s.cart);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg z-[60]">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-primary text-white">
            <Sparkles className="w-4 h-4" />
          </span>
          Nova<span className="text-primary">Innovation</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Accueil</Link>
          <Link to="/generate" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Créer une carte</Link>
          <a href="/#features" className="hover:text-primary transition">Fonctionnalités</a>
          <a href="/#pricing" className="hover:text-primary transition">Tarifs</a>
        </nav>
        <div className="flex items-center gap-3 z-[60]">
          <Link to="/cart" className="relative grid place-items-center w-10 h-10 rounded-full hover:bg-secondary transition">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/generate"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
          >
            Commencer
          </Link>
          <button 
            className="md:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-secondary transition"
            onClick={toggleMenu}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-2xl text-foreground border-b border-border p-6 shadow-2xl md:hidden flex flex-col gap-5 text-lg font-bold z-[55]"
          >
            <Link to="/" onClick={toggleMenu} className="hover:text-primary transition p-2 rounded-lg hover:bg-secondary/50">Accueil</Link>
            <Link to="/generate" onClick={toggleMenu} className="hover:text-primary transition p-2 rounded-lg hover:bg-secondary/50">Créer une carte</Link>
            <a href="/#features" onClick={toggleMenu} className="hover:text-primary transition p-2 rounded-lg hover:bg-secondary/50">Fonctionnalités</a>
            <a href="/#pricing" onClick={toggleMenu} className="hover:text-primary transition p-2 rounded-lg hover:bg-secondary/50">Tarifs</a>
            <Link
              to="/generate"
              onClick={toggleMenu}
              className="mt-4 flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-foreground text-background text-base font-bold shadow-lg"
            >
              Commencer maintenant
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
