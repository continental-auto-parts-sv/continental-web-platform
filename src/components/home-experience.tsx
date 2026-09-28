"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

import "./home-design.css";

import { SiteHeader } from "./site-header";
import { ContinentalLogo } from "./continental-logo";
import { PartIcon } from "./part-icon";
import { BrandMarquee } from "./brand-marquee";
import { VehicleFields } from "./vehicle-fields";
import { PromotionFeature } from "./promotion-feature";
import type { Promotion } from "@/lib/promotions";

const categories = [
  { name: "Motor", detail: "Potencia desde adentro.", icon: "engine" },
  { name: "Frenos", detail: "Confianza en cada parada.", icon: "brake" },
  { name: "Suspensión", detail: "El control que se siente.", icon: "spring" },
  { name: "Filtros", detail: "Protección desde adentro.", icon: "filter" },
  { name: "Lubricantes", detail: "Rendimiento en movimiento.", icon: "oil" },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
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

  useEffect(() => {
    let touchY: number | null = null;
    let touchStartedAtTop = false;

    function handleScroll() {
      if (window.scrollY > 0) setShowTopbar(false);
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || event.deltaY === 0) return;
      setShowTopbar(window.scrollY <= 0 && event.deltaY < 0);
    }

    function handleTouchStart(event: TouchEvent) {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
      touchStartedAtTop = window.scrollY <= 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (touchY === null || event.touches.length !== 1) return;
      const distance = event.touches[0].clientY - touchY;
      if (Math.abs(distance) < 12) return;
      setShowTopbar(touchStartedAtTop && window.scrollY <= 0 && distance > 0);
      touchY = event.touches[0].clientY;
    }

    function handleTouchEnd() {
      touchY = null;
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
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

  function chooseCategory(name: string) {
    setCategory(name);
    setSummary("");
    document.getElementById("consulta")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(
      `Hola, Continental Auto Parts. Busco ${category.toLowerCase()} para mi ${brand}, modelo ${data.get("model")}, año ${data.get("year")}. ¿Me pueden ayudar a confirmar compatibilidad y disponibilidad?`,
    );
    setCopied(false);
    setCopyError(false);
  }

  return (
    <div
      className={page === "home" ? "home-page home-landing" : "home-page"}
      data-topbar-visible={showTopbar}
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
          <>
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
                <h1>
                  Tu auto.
                  <br />
                  Siempre <em>listo.</em>
                </h1>
                <p className="hero-description">
                  Repuestos para Volkswagen, Audi, SEAT y Porsche. Encuentra la
                  pieza que necesitas.
                </p>
                <div className="hero-actions">
                  <a className="button" href="#categorias">
                    Encuentra tu repuesto <Arrow />
                  </a>
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
          </>
        )}
        {page !== "contact" && (
          <>
            <section className="section categories" id="categorias">
              <div className="container">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">CADA PIEZA CUENTA</p>
                    {page === "products" ? (
                      <h1 className="page-title">La pieza que necesitas.</h1>
                    ) : (
                      <h2>La pieza que necesitas.</h2>
                    )}
                  </div>
                  <p>
                    Del mantenimiento diario al siguiente proyecto.
                    <br />
                    Encuentra el punto de partida.
                  </p>
                </div>
                <div className="category-grid">
                  {categories.map((item, index) => (
                    <button
                      className="category-card"
                      key={item.name}
                      onClick={() => chooseCategory(item.name)}
                    >
                      <span className="category-number">0{index + 1}</span>
                      <PartIcon kind={item.icon} />
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
              <p className="eyebrow light">ENCUENTRA TU REPUESTO</p>
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
                Selecciona tu vehículo. Nosotros te orientamos.
              </p>
            </div>
            <form
              className="inquiry-form"
              onSubmit={submitInquiry}
              onChange={() => {
                setSummary("");
                setCopied(false);
                setCopyError(false);
              }}
            >
              <VehicleFields
                brand={brand}
                category={category}
                onBrandChange={setBrand}
                onCategoryChange={setCategory}
                onEdit={() => {
                  setSummary("");
                  setCopied(false);
                  setCopyError(false);
                }}
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
      <footer>
        <div className="container">
          <div className="footer-main">
            <ContinentalLogo />
            <p>
              Tu auto nos mueve.
              <br />
              Compromiso contigo.
            </p>
            <a
              href={page === "home" ? "#inicio" : "#contenido"}
              className="text-link"
            >
              Volver arriba ↑
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Continental Auto Parts SV.</span>
            <span>Volkswagen · Audi · SEAT · Porsche</span>
            <span>Hecho para seguir adelante.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
