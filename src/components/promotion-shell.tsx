import Link from "next/link";
import type { ReactNode } from "react";

import "./home-design.css";
import { SiteHeader } from "./site-header";
import { ContinentalLogo } from "./continental-logo";

export function PromotionShell({ children }: { children: ReactNode }) {
  return (
    <div className="home-page">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <footer className="promotion-footer container">
        <ContinentalLogo />
        <Link href="/contacto">¿Buscas otra pieza? Hablemos ↗</Link>
      </footer>
    </div>
  );
}
