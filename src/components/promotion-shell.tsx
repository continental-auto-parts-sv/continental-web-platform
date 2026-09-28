import Link from "next/link";
import type { ReactNode } from "react";

import { ContinentalLogo } from "./continental-logo";

export function PromotionShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="header promotion-header">
        <div className="container header-inner">
          <ContinentalLogo />
          <nav
            className="promotion-navigation"
            aria-label="Navegación principal"
          >
            <Link href="/">Inicio</Link>
            <Link href="/promociones" aria-current="page">
              Promociones
            </Link>
          </nav>
          <Link className="button small header-cta" href="/#consulta">
            Cotizar repuestos ↗
          </Link>
        </div>
      </header>
      <main id="contenido">{children}</main>
      <footer className="promotion-footer container">
        <ContinentalLogo />
        <Link href="/#consulta">¿Buscas otra pieza? Hablemos ↗</Link>
      </footer>
    </>
  );
}
