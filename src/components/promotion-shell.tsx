import type { ReactNode } from "react";

import "./home-design.css";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PromotionShell({ children }: { children: ReactNode }) {
  return (
    <div className="home-page">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </div>
  );
}
