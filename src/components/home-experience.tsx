"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

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
}: {
  hero: ReactNode;
  promotion?: Promotion;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="topbar">
        <div className="container">
          <span>ESPECIALISTAS EN REPUESTOS EUROPEOS</span>
          <span className="location">
            <span aria-hidden="true">⌖</span> El Salvador
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <ContinentalLogo href="#inicio" />
          <nav
            className={menuOpen ? "navigation open" : "navigation"}
            aria-label="Navegación principal"
          >
            {[
              ["Inicio", "inicio"],
              ["Categorías", "categorias"],
              ["Marcas", "marcas"],
              ["Promociones", "/promociones"],
            ].map(([label, id]) => (
              <Link
                key={id}
                href={id.startsWith("/") ? id : `#${id}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <a className="button small header-cta" href="#consulta">
            Cotizar repuestos <Arrow />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>
      <main id="contenido">
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
        <section className="section categories" id="categorias">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CADA PIEZA CUENTA</p>
                <h2>La pieza que necesitas.</h2>
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
        <section className="inquiry-section" id="consulta">
          <div className="container inquiry-grid">
            <div>
              <p className="eyebrow light">ENCUENTRA TU REPUESTO</p>
              <h2>
                Encontremos
                <br />
                <span>lo que buscas.</span>
              </h2>
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
            <ContinentalLogo href="#inicio" />
            <p>
              Tu auto nos mueve.
              <br />
              Compromiso contigo.
            </p>
            <a href="#inicio" className="text-link">
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
    </>
  );
}
