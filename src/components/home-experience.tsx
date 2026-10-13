"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import "./home-design.css";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PartIcon } from "./part-icon";
import { BrandMarquee } from "./brand-marquee";
import { ServiceHighlights } from "./service-highlights";
import {
  VehicleFields,
  type InquiryErrors,
  type InquiryField,
} from "./vehicle-fields";
import { PromotionFeature } from "./promotion-feature";
import { DevSettings, useDevSettingsState } from "./dev-settings";
import type { Promotion } from "@/lib/promotions";

const categories = [
  { name: "Motor", detail: "Potencia desde adentro.", icon: "engine" },
  { name: "Frenos", detail: "Confianza en cada parada.", icon: "brake" },
  { name: "Suspensión", detail: "El control que se siente.", icon: "spring" },
  { name: "Filtros", detail: "Protección desde adentro.", icon: "filter" },
  { name: "Lubricantes", detail: "Rendimiento en movimiento.", icon: "oil" },
];

const categoryArtworkNames: Record<string, string> = {
  engine: "engine",
  brake: "brake",
  spring: "suspension",
  filter: "filter-v2",
  oil: "lubricant",
};

const wheelOverscrollThreshold = 96;
const touchPullThreshold = 56;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

// Lucide car-front and truck icons (ISC license).
function ProductLineIcon({ type }: { type: "livianos" | "pesados" }) {
  if (type === "pesados") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M10 17h4V5H2v12h3" />
        <path d="M14 9h4l4 4v4h-3" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.65 5h-7.3A2 2 0 0 0 6.5 6.3L5 10 3 8" />
      <path d="M7 14h.01" />
      <path d="M17 14h.01" />
      <rect width="18" height="8" x="3" y="10" rx="2" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </svg>
  );
}

function CategoryArtwork({ kind }: { kind: string }) {
  const artworkName = categoryArtworkNames[kind];

  if (!artworkName) {
    return <PartIcon kind={kind} />;
  }

  const shouldBypassOptimizer = artworkName === "filter-v2";

  return (
    <span className="category-product-art" aria-hidden="true">
      <Image
        className="category-product-image category-product-image-dark"
        src={`/images/categories/${artworkName}-dark.webp`}
        alt=""
        width={1024}
        height={1024}
        sizes="160px"
        unoptimized={shouldBypassOptimizer}
      />
      <Image
        className="category-product-image category-product-image-light"
        src={`/images/categories/${artworkName}-light.webp`}
        alt=""
        width={1024}
        height={1024}
        sizes="160px"
        unoptimized={shouldBypassOptimizer}
      />
    </span>
  );
}

export function HomeExperience({
  hero,
  promotion,
  page = "home",
}: {
  hero?: ReactNode;
  page?: "home" | "products" | "contact";
  promotion?: Promotion;
}) {
  const [showTopbar, setShowTopbar] = useState(false);
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

  useEffect(() => {
    let touchStartY: number | null = null;
    let touchStartedAtTop = false;
    let wheelOverscroll = 0;
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 0 || lastScrollY > 0) {
        wheelOverscroll = 0;
        setShowTopbar(false);
      }

      lastScrollY = currentScrollY;
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || event.deltaY === 0) return;

      if (event.deltaY > 0) {
        wheelOverscroll = 0;
        setShowTopbar(false);
        return;
      }

      if (window.scrollY > 0 || lastScrollY > 0) {
        wheelOverscroll = 0;
        return;
      }

      const deltaScale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      wheelOverscroll += Math.abs(event.deltaY) * deltaScale;

      if (wheelOverscroll >= wheelOverscrollThreshold) {
        setShowTopbar(true);
      }
    }

    function handleTouchStart(event: TouchEvent) {
      touchStartY =
        event.touches.length === 1 ? event.touches[0].clientY : null;
      touchStartedAtTop = window.scrollY <= 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (touchStartY === null || event.touches.length !== 1) return;

      const pullDistance = event.touches[0].clientY - touchStartY;
      if (pullDistance < 0) {
        setShowTopbar(false);
        return;
      }

      if (
        touchStartedAtTop &&
        window.scrollY <= 0 &&
        pullDistance >= touchPullThreshold
      ) {
        setShowTopbar(true);
      }
    }

    function handleTouchEnd() {
      touchStartY = null;
      touchStartedAtTop = false;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [formErrors, setFormErrors] = useState<InquiryErrors>({});
  const [validationAttempted, setValidationAttempted] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

  function clearInquiryFeedback() {
    setSummary("");
    setCopied(false);
    setCopyError(false);
    setFormErrors({});
    setValidationAttempted(false);
  }

  function chooseCategory(name: string) {
    setCategory(name);
    setSummary("");
    document.getElementById("consulta")?.scrollIntoView({
      behavior:
        reducedMotion ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
    });
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const model = String(data.get("model") ?? "").trim();
    const year = String(data.get("year") ?? "").trim();
    const vin = String(data.get("vin") ?? "")
      .trim()
      .toUpperCase();
    const currentYear = new Date().getFullYear() + 1;
    const errors: InquiryErrors = {};

    if (!brand) errors.brand = "Selecciona la marca de tu vehículo.";
    if (!category) errors.category = "Selecciona el repuesto que necesitas.";
    if (!model) errors.model = "Escribe el modelo de tu vehículo.";

    if (!year) {
      errors.year = "Ingresa el año de tu vehículo.";
    } else if (
      !Number.isInteger(Number(year)) ||
      Number(year) < 1950 ||
      Number(year) > currentYear
    ) {
      errors.year = `Ingresa un año entre 1950 y ${currentYear}.`;
    }

    if (vin && (vin.length < 5 || !/^[A-Z0-9 -]+$/.test(vin))) {
      errors.vin =
        "Usa al menos 5 caracteres: letras, números, espacios o guiones.";
    }

    const firstError = Object.keys(errors)[0] as InquiryField | undefined;
    setFormErrors(errors);
    setValidationAttempted(true);

    if (firstError) {
      setSummary("");
      requestAnimationFrame(() => {
        form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      });
      return;
    }

    const vehicleIdentity = vin ? `, chasis o VIN ${vin}` : "";

    setSummary(
      `Hola, Continental Auto Parts. Busco ${category.toLowerCase()} para mi ${brand}, modelo ${model}, año ${year}${vehicleIdentity}. ¿Me pueden ayudar a confirmar compatibilidad y disponibilidad?`,
    );
    setCopied(false);
    setCopyError(false);
  }

  return (
    <div
      className={page === "home" ? "home-page home-landing" : "home-page"}
      data-topbar-visible={showTopbar}
      data-hero-layout={heroLayout}
      data-page-scale={pageScale}
      data-reduced-motion={reducedMotion}
      data-reduced-transparency={reducedTransparency}
      data-increased-contrast={increasedContrast}
    >
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="topbar" aria-hidden={!showTopbar}>
        <div className="container">
          <span>ESPECIALISTAS EN REPUESTOS EUROPEOS</span>
          <span className="location">
            <span aria-hidden="true">⌖</span> El Salvador
          </span>
        </div>
      </div>
      <SiteHeader />
      <main id="contenido">
        {page === "home" && (
          <div className="hero-main-view">
            <section className="hero" id="inicio">
              {hero}
              <div className="hero-shade" />
              <div className="container hero-content">
                <Link className="hero-promotion-link" href="/promociones">
                  <span className="promotion-dot" aria-hidden="true" />
                  <span>Explora nuestras promociones</span>
                  <span className="promotion-chevron" aria-hidden="true">
                    ›
                  </span>
                </Link>
                <h1 className="page-display-title">
                  ¡Tu auto,
                  <br />
                  Siempre <em>listo!</em>
                </h1>
                <p className="hero-description">
                  Repuestos para Volkswagen, Audi, SEAT y Porsche. Encuentra la
                  pieza que necesitas.
                </p>
                <div className="hero-actions">
                  <Link className="button" href="/productos">
                    Encuentra tu repuesto <Arrow />
                  </Link>
                  <a className="text-link light-link" href="#consulta">
                    Hablemos de tu auto <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </section>
            <BrandMarquee
              onChoose={(name) => {
                setBrand(name);
                setSummary("");
              }}
            />
            <ServiceHighlights />
          </div>
        )}
        {page !== "contact" && (
          <>
            <section className="section categories" id="categorias">
              <div className="container">
                <div className="section-heading">
                  <div>
                    {page === "products" ? (
                      <h1 className="page-title">La pieza que necesitas.</h1>
                    ) : (
                      <h2>La pieza que necesitas.</h2>
                    )}
                  </div>
                  <p>Todo lo que tu europeo necesita, en un solo lugar.</p>
                </div>
                {page === "home" && (
                  <nav
                    className="home-product-lines"
                    aria-label="Explorar líneas de productos"
                  >
                    <Link
                      className="home-product-line"
                      href="/productos#livianos"
                      aria-label="Explorar Línea de Livianos"
                    >
                      <span className="home-product-line-icon">
                        <ProductLineIcon type="livianos" />
                      </span>
                      <span className="home-product-line-copy">
                        <strong>Línea de Livianos</strong>
                        <small>Automóviles y SUV</small>
                      </span>
                      <span className="home-product-line-action" aria-hidden>
                        <span>Ver línea</span>
                        <Arrow />
                      </span>
                    </Link>
                    <Link
                      className="home-product-line home-product-line-heavy"
                      href="/productos#pesados"
                      aria-label="Explorar Línea de Pesados"
                    >
                      <span className="home-product-line-icon">
                        <ProductLineIcon type="pesados" />
                      </span>
                      <span className="home-product-line-copy">
                        <strong>Línea de Pesados</strong>
                        <small>Camiones, buses y transporte</small>
                      </span>
                      <span className="home-product-line-action" aria-hidden>
                        <span>Ver línea</span>
                        <Arrow />
                      </span>
                    </Link>
                  </nav>
                )}
                <div className="category-grid">
                  {categories.map((item, index) => (
                    <button
                      className="category-card"
                      key={item.name}
                      onClick={() => chooseCategory(item.name)}
                    >
                      <span className="category-number">0{index + 1}</span>
                      <CategoryArtwork kind={item.icon} />
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                      <span className="category-bottom">
                        Explorar <Arrow />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
            {promotion && <PromotionFeature promotion={promotion} />}
          </>
        )}
        <section className="inquiry-section" id="consulta">
          <div className="container inquiry-grid">
            <div>
              {page === "contact" ? (
                <h1 className="page-title">Hablemos de tu auto.</h1>
              ) : (
                <h2>
                  Encontremos
                  <br />
                  <span>lo que buscas.</span>
                </h2>
              )}
              <p>
                Dinos qué manejas y qué necesitas.
                <br />
                Nosotros te orientamos.
              </p>
            </div>
            <form
              className="inquiry-form"
              noValidate
              onSubmit={submitInquiry}
              onChange={clearInquiryFeedback}
            >
              <VehicleFields
                brand={brand}
                category={category}
                errors={formErrors}
                validationAttempted={validationAttempted}
                onBrandChange={setBrand}
                onCategoryChange={setCategory}
                onEdit={clearInquiryFeedback}
              />
              <button className="button inquiry-submit" type="submit">
                Preparar mi consulta <Arrow />
              </button>
              {summary && (
                <div className="inquiry-result" role="status">
                  <p>{summary}</p>
                  {whatsapp ? (
                    <a
                      className="text-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(summary)}`}
                    >
                      Continuar en WhatsApp <Arrow />
                    </a>
                  ) : (
                    <>
                      <button
                        className="text-link"
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(summary);
                            setCopied(true);
                            setCopyError(false);
                          } catch {
                            setCopied(false);
                            setCopyError(true);
                          }
                        }}
                      >
                        {copied ? "Consulta copiada ✓" : "Copiar consulta"}
                      </button>
                      {copyError && (
                        <small>
                          No se pudo copiar. Selecciona y copia el texto de tu
                          consulta.
                        </small>
                      )}
                      <small>
                        El contacto directo estará disponible próximamente.
                        Puedes guardar tu consulta.
                      </small>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <DevSettings
        heroLayout={heroLayout}
        pageScale={pageScale}
        accessibilityPreview={accessibilityPreview}
        onHeroLayoutChange={setHeroLayout}
        onPageScaleChange={setPageScale}
        onAccessibilityPreviewChange={setAccessibilityPreview}
        showHeroControls={page === "home"}
      />
      <SiteFooter topHref={page === "home" ? "#inicio" : "#contenido"} />
    </div>
  );
}
