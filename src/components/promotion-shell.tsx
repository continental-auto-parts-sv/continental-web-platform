"use client";

import type { ReactNode } from "react";

import "./home-design.css";
import { DevSettings, useDevSettingsState } from "./dev-settings";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PromotionShell({ children }: { children: ReactNode }) {
  const {
    accessibilityPreview,
    heroLayout,
    increasedContrast,
    pageScale,
    reducedMotion,
    reducedTransparency,
    setAccessibilityPreview,
    setHeroLayout,
    setPageScale,
  } = useDevSettingsState();

  return (
    <div
      className="home-page"
      data-page-scale={pageScale}
      data-reduced-motion={reducedMotion}
      data-reduced-transparency={reducedTransparency}
      data-increased-contrast={increasedContrast}
    >
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <DevSettings
        heroLayout={heroLayout}
        pageScale={pageScale}
        accessibilityPreview={accessibilityPreview}
        onHeroLayoutChange={setHeroLayout}
        onPageScaleChange={setPageScale}
        onAccessibilityPreviewChange={setAccessibilityPreview}
        showHeroControls={false}
      />
      <SiteFooter />
    </div>
  );
}
