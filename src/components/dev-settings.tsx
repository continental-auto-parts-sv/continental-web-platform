"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import "./dev-settings.css";

export type HeroLayout = "complete" | "slideshow";
export type PageScale = 80 | 90 | 100 | 110 | 120;
export type AccessibilityPreview = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CategoryTitleFont = "primary" | "secondary";

const pageScales: PageScale[] = [80, 90, 100, 110, 120];
const heroLayoutStorageKey = "continental-dev-hero-layout";
const heroLayoutChangeEvent = "continental-dev-hero-layout-change";
const pageScaleStorageKey = "continental-dev-page-scale";
const pageScaleChangeEvent = "continental-dev-page-scale-change";
const accessibilityStorageKey = "continental-dev-accessibility";
const accessibilityChangeEvent = "continental-dev-accessibility-change";
const categoryTitleFontStorageKey = "continental-dev-category-title-font";
const categoryTitleFontChangeEvent =
  "continental-dev-category-title-font-change";
let sessionHeroLayout: HeroLayout = "complete";
let sessionPageScale: PageScale = 100;
let sessionAccessibilityPreview: AccessibilityPreview = 0;
let sessionCategoryTitleFont: CategoryTitleFont = "primary";

const accessibilityOptions = [
  {
    bit: 1,
    label: "Movimiento reducido",
    description: "Pausa autoplay y elimina transiciones.",
  },
  {
    bit: 2,
    label: "Transparencia reducida",
    description: "Convierte materiales translúcidos en sólidos.",
  },
  {
    bit: 4,
    label: "Contraste alto",
    description: "Refuerza texto, bordes y controles.",
  },
] as const;

function getHeroLayoutSnapshot(): HeroLayout {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return "complete";
  }

  try {
    const savedLayout = window.localStorage?.getItem?.(heroLayoutStorageKey);

    return savedLayout === "slideshow" || savedLayout === "complete"
      ? savedLayout
      : sessionHeroLayout;
  } catch {
    return sessionHeroLayout;
  }
}

function subscribeToHeroLayout(onChange: () => void) {
  window.addEventListener(heroLayoutChangeEvent, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(heroLayoutChangeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getPageScaleSnapshot(): PageScale {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return 100;
  }

  try {
    const savedScale = Number(
      window.localStorage?.getItem?.(pageScaleStorageKey),
    );

    return savedScale === 80 ||
      savedScale === 90 ||
      savedScale === 100 ||
      savedScale === 110 ||
      savedScale === 120
      ? savedScale
      : sessionPageScale;
  } catch {
    return sessionPageScale;
  }
}

function subscribeToPageScale(onChange: () => void) {
  window.addEventListener(pageScaleChangeEvent, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(pageScaleChangeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getAccessibilitySnapshot(): AccessibilityPreview {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return 0;
  }

  try {
    const savedPreview = Number(
      window.localStorage?.getItem?.(accessibilityStorageKey),
    );

    return Number.isInteger(savedPreview) &&
      savedPreview >= 0 &&
      savedPreview <= 7
      ? (savedPreview as AccessibilityPreview)
      : sessionAccessibilityPreview;
  } catch {
    return sessionAccessibilityPreview;
  }
}

function subscribeToAccessibility(onChange: () => void) {
  window.addEventListener(accessibilityChangeEvent, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(accessibilityChangeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getCategoryTitleFontSnapshot(): CategoryTitleFont {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return "primary";
  }

  try {
    const savedFont = window.localStorage?.getItem?.(
      categoryTitleFontStorageKey,
    );

    return savedFont === "primary" || savedFont === "secondary"
      ? savedFont
      : sessionCategoryTitleFont;
  } catch {
    return sessionCategoryTitleFont;
  }
}

function subscribeToCategoryTitleFont(onChange: () => void) {
  window.addEventListener(categoryTitleFontChangeEvent, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(categoryTitleFontChangeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDevSettingsState() {
  const heroLayout = useSyncExternalStore(
    subscribeToHeroLayout,
    getHeroLayoutSnapshot,
    (): HeroLayout => "complete",
  );
  const pageScale = useSyncExternalStore(
    subscribeToPageScale,
    getPageScaleSnapshot,
    (): PageScale => 100,
  );
  const accessibilityPreview = useSyncExternalStore(
    subscribeToAccessibility,
    getAccessibilitySnapshot,
    (): AccessibilityPreview => 0,
  );
  const categoryTitleFont = useSyncExternalStore(
    subscribeToCategoryTitleFont,
    getCategoryTitleFontSnapshot,
    (): CategoryTitleFont => "primary",
  );
  const reducedMotion = Boolean(accessibilityPreview & 1);
  const reducedTransparency = Boolean(accessibilityPreview & 2);
  const increasedContrast = Boolean(accessibilityPreview & 4);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.devReducedMotion = String(reducedMotion);
    root.dataset.devReducedTransparency = String(reducedTransparency);
    root.dataset.devIncreasedContrast = String(increasedContrast);

    return () => {
      delete root.dataset.devReducedMotion;
      delete root.dataset.devReducedTransparency;
      delete root.dataset.devIncreasedContrast;
    };
  }, [increasedContrast, reducedMotion, reducedTransparency]);

  function setHeroLayout(layout: HeroLayout) {
    sessionHeroLayout = layout;

    try {
      window.localStorage?.setItem?.(heroLayoutStorageKey, layout);
    } catch {
      // The setting still applies for this session.
    }

    window.dispatchEvent(new Event(heroLayoutChangeEvent));
  }

  function setPageScale(scale: PageScale) {
    sessionPageScale = scale;

    try {
      window.localStorage?.setItem?.(pageScaleStorageKey, String(scale));
    } catch {
      // The setting still applies for this session.
    }

    window.dispatchEvent(new Event(pageScaleChangeEvent));
  }

  function setAccessibilityPreview(preview: AccessibilityPreview) {
    sessionAccessibilityPreview = preview;

    try {
      window.localStorage?.setItem?.(accessibilityStorageKey, String(preview));
    } catch {
      // The setting still applies for this session.
    }

    window.dispatchEvent(
      new CustomEvent(accessibilityChangeEvent, { detail: preview }),
    );
  }

  function setCategoryTitleFont(font: CategoryTitleFont) {
    sessionCategoryTitleFont = font;

    try {
      window.localStorage?.setItem?.(categoryTitleFontStorageKey, font);
    } catch {
      // The setting still applies for this session.
    }

    window.dispatchEvent(new Event(categoryTitleFontChangeEvent));
  }

  return {
    accessibilityPreview,
    categoryTitleFont,
    heroLayout,
    increasedContrast,
    pageScale,
    reducedMotion,
    reducedTransparency,
    setAccessibilityPreview,
    setCategoryTitleFont,
    setHeroLayout,
    setPageScale,
  };
}

export function DevSettings({
  heroLayout,
  onHeroLayoutChange,
  pageScale,
  onPageScaleChange,
  accessibilityPreview,
  onAccessibilityPreviewChange,
  categoryTitleFont = "primary",
  onCategoryTitleFontChange,
  showHeroControls = true,
  showCategoryFontControls = false,
}: {
  heroLayout: HeroLayout;
  onHeroLayoutChange: (layout: HeroLayout) => void;
  pageScale: PageScale;
  onPageScaleChange: (scale: PageScale) => void;
  accessibilityPreview: AccessibilityPreview;
  onAccessibilityPreviewChange: (preview: AccessibilityPreview) => void;
  categoryTitleFont?: CategoryTitleFont;
  onCategoryTitleFontChange?: (font: CategoryTitleFont) => void;
  showHeroControls?: boolean;
  showCategoryFontControls?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <aside className="dev-settings">
      {open && (
        <div className="dev-settings-panel">
          <div className="dev-settings-heading">
            <div>
              <strong>Ajustes de desarrollo</strong>
              <span>Vista, escala y accesibilidad</span>
            </div>
            <button
              type="button"
              aria-label="Cerrar ajustes de desarrollo"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          {showHeroControls && (
            <section className="dev-settings-section">
              <p>Hero</p>
              <div
                className="dev-settings-options"
                role="group"
                aria-label="Hero"
              >
                <button
                  type="button"
                  aria-pressed={heroLayout === "complete"}
                  onClick={() => onHeroLayoutChange("complete")}
                >
                  <strong>Hero completo</strong>
                  <span>Beneficios al final de la vista.</span>
                </button>
                <button
                  type="button"
                  aria-pressed={heroLayout === "slideshow"}
                  onClick={() => onHeroLayoutChange("slideshow")}
                >
                  <strong>Slideshow completo</strong>
                  <span>La imagen ocupa toda la vista.</span>
                </button>
              </div>
            </section>
          )}
          {showCategoryFontControls && onCategoryTitleFontChange && (
            <section className="dev-settings-section">
              <p>Tipografía de categorías</p>
              <div
                className="dev-settings-options"
                role="group"
                aria-label="Tipografía de títulos de categorías"
              >
                <button
                  type="button"
                  aria-pressed={categoryTitleFont === "primary"}
                  onClick={() => onCategoryTitleFontChange("primary")}
                >
                  <strong>Fuente principal</strong>
                  <span>Formula 1 Display en todos los títulos.</span>
                </button>
                <button
                  type="button"
                  aria-pressed={categoryTitleFont === "secondary"}
                  onClick={() => onCategoryTitleFontChange("secondary")}
                >
                  <strong>Fuente secundaria</strong>
                  <span>Volkswagen Text en todos los títulos.</span>
                </button>
              </div>
            </section>
          )}
          <section className="dev-settings-section">
            <div className="dev-settings-section-heading">
              <p>Escala de página</p>
              <output>{pageScale}%</output>
            </div>
            <div
              className="dev-settings-scale"
              role="group"
              aria-label="Escala de página"
            >
              {pageScales.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  aria-label={`${scale}%`}
                  aria-pressed={pageScale === scale}
                  onClick={() => onPageScaleChange(scale)}
                >
                  {scale}
                </button>
              ))}
            </div>
            <span className="dev-settings-scale-note">
              Ajusta texto, espacios, imágenes y componentes.
            </span>
          </section>
          <section className="dev-settings-section">
            <p>Vista de accesibilidad</p>
            <div
              className="dev-settings-accessibility"
              role="group"
              aria-label="Vista de accesibilidad"
            >
              {accessibilityOptions.map((option) => {
                const enabled = Boolean(accessibilityPreview & option.bit);

                return (
                  <button
                    key={option.bit}
                    type="button"
                    aria-pressed={enabled}
                    onClick={() =>
                      onAccessibilityPreviewChange(
                        (accessibilityPreview ^
                          option.bit) as AccessibilityPreview,
                      )
                    }
                  >
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
      <button
        className="dev-settings-trigger"
        type="button"
        aria-label="Ajustes de desarrollo"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">⚙</span>
        Dev
      </button>
    </aside>
  );
}
