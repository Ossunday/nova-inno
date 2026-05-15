import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-primary text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            Nova<span className="text-primary">Innovation</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Cartes de visite digitales nouvelle génération avec QR code et partage instantané.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Produit</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/generate" className="hover:text-foreground">Générateur</Link></li>
            <li><a href="/#features" className="hover:text-foreground">Fonctionnalités</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">Tarifs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Société</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">À propos</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Carrières</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Légal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Confidentialité</a></li>
            <li><a href="#" className="hover:text-foreground">CGU</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nova Innovation. Tous droits réservés.
      </div>
    </footer>
  );
}
