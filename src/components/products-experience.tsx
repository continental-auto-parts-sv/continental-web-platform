"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PartIcon } from "./part-icon";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

import "./home-design.css";
import "./products-experience.css";

type ProductCategory = {
  name: string;
  description: string;
  artwork?: string;
  icon?: string;
};

type ProductLine = {
  id: "livianos" | "pesados";
  title: string;
  description: string;
  categories: ProductCategory[];
  brands: Array<{
    name: string;
    src: string;
    shape?: "square" | "wide";
  }>;
};

const productLines: ProductLine[] = [
  {
    id: "livianos",
    title: "Línea de Livianos",
    description: "Repuestos para automóviles, SUV y vehículos de uso diario.",
    categories: [
      {
        name: "Motor",
        description: "Componentes para el corazón de tu vehículo.",
        artwork: "engine",
      },
      {
        name: "Frenos",
        description: "Control y confianza en cada parada.",
        artwork: "brake",
      },
      {
        name: "Suspensión",
        description: "Estabilidad y comodidad en el camino.",
        artwork: "suspension",
      },
      {
        name: "Filtros",
        description: "Protección para cada sistema.",
        artwork: "filter-v2",
      },
      {
        name: "Lubricantes",
        description: "Rendimiento que sigue en movimiento.",
        artwork: "lubricant",
      },
      {
        name: "Sistema eléctrico",
        description: "Energía y funcionamiento confiable.",
        icon: "other",
      },
      {
        name: "Transmisión",
        description: "Entrega de potencia suave y precisa.",
        icon: "other",
      },
      {
        name: "Accesorios",
        description: "Soluciones para completar tu vehículo.",
        icon: "other",
      },
    ],
    brands: [
      {
        name: "Bosch",
        src: "/images/product-brands/light/bosch.png",
      },
      {
        name: "TRW",
        src: "/images/product-brands/light/trw.png",
      },
      {
        name: "Febi Bilstein",
        src: "/images/product-brands/light/febi-bilstein.png",
        shape: "square",
      },
      {
        name: "ZF",
        src: "/images/product-brands/light/zf.png",
        shape: "square",
      },
      {
        name: "JP Group",
        src: "/images/product-brands/light/jp-group.webp",
      },
      {
        name: "EMPI",
        src: "/images/product-brands/light/empi.png",
        shape: "square",
      },
    ],
  },
  {
    id: "pesados",
    title: "Línea de Pesados",
    description: "Repuestos para camiones, buses y transporte pesado.",
    categories: [
      {
        name: "Frenos pesados",
        description: "Respuesta segura para trabajo exigente.",
        artwork: "brake",
      },
      {
        name: "Suspensión pesada",
        description: "Control para cada carga y recorrido.",
        artwork: "suspension",
      },
      {
        name: "Filtros",
        description: "Protección para motores de trabajo continuo.",
        artwork: "filter-v2",
      },
      {
        name: "Embrague",
        description: "Acople confiable para cada jornada.",
        icon: "other",
      },
      {
        name: "Transmisión",
        description: "Potencia constante para trabajo exigente.",
        icon: "other",
      },
      {
        name: "Sistema eléctrico",
        description: "Energía y funcionamiento confiable.",
        icon: "other",
      },
      {
        name: "Lubricantes",
        description: "Protección para recorridos prolongados.",
        artwork: "lubricant",
      },
      {
        name: "Dirección",
        description: "Control preciso para vehículos de carga.",
        icon: "other",
      },
    ],
    brands: [
      {
        name: "WABCO",
        src: "/images/product-brands/heavy/wabco.png",
      },
      {
        name: "Mercedes-Benz",
        src: "/images/product-brands/heavy/mercedes-benz.png",
        shape: "square",
      },
      {
        name: "TRW",
        src: "/images/product-brands/heavy/trw.png",
      },
      {
        name: "Bosch",
        src: "/images/product-brands/heavy/bosch.png",
      },
      {
        name: "Febi Bilstein",
        src: "/images/product-brands/heavy/febi-bilstein.png",
        shape: "square",
      },
      {
        name: "Kolbenschmidt",
        src: "/images/product-brands/heavy/kolbenschmidt.webp",
      },
      {
        name: "Valeo",
        src: "/images/product-brands/heavy/valeo.webp",
      },
      {
        name: "Blue Print",
        src: "/images/product-brands/heavy/blue-print.png",
        shape: "square",
      },
    ],
  },
];

// Lucide car-front and truck icons (ISC license).
function VehicleIcon({ type }: { type: ProductLine["id"] }) {
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

function CategoryArtwork({ category }: { category: ProductCategory }) {
  if (!category.artwork) {
    return (
      <span className="products-category-icon">
        <PartIcon kind={category.icon ?? "other"} />
      </span>
    );
  }

  const shouldBypassOptimizer = category.artwork === "filter-v2";

  return (
    <span className="products-category-art" aria-hidden="true">
      <Image
        className="products-category-image products-category-image-dark"
        src={`/images/categories/${category.artwork}-dark.webp`}
        alt=""
        width={1024}
        height={1024}
        sizes="(max-width: 760px) 45vw, 190px"
        loading={shouldBypassOptimizer ? "eager" : "lazy"}
        unoptimized={shouldBypassOptimizer}
      />
      <Image
        className="products-category-image products-category-image-light"
        src={`/images/categories/${category.artwork}-light.webp`}
        alt=""
        width={1024}
        height={1024}
        sizes="(max-width: 760px) 45vw, 190px"
        loading={shouldBypassOptimizer ? "eager" : "lazy"}
        unoptimized={shouldBypassOptimizer}
      />
    </span>
  );
}

function ProductLineSection({ line }: { line: ProductLine }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || isExpanded) {
      return;
    }

    carousel.scrollTo?.({ left: 0, behavior: "auto" });

    const updateControls = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      setCanScrollBack(carousel.scrollLeft > 2);
      setCanScrollForward(carousel.scrollLeft < maxScroll - 2);
    };

    updateControls();
    carousel.addEventListener("scroll", updateControls, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateControls);

    resizeObserver?.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateControls);
      resizeObserver?.disconnect();
    };
  }, [isExpanded]);

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.82,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const toggleExpanded = () => {
    carouselRef.current?.scrollTo?.({ left: 0, behavior: "auto" });
    setIsExpanded((current) => !current);
  };

  return (
    <section
      className={`products-line products-line-${line.id}`}
      id={line.id}
      aria-labelledby={`${line.id}-title`}
    >
      <div className="container products-line-card">
        <header className="products-line-heading">
          <span className="products-line-icon">
            <VehicleIcon type={line.id} />
          </span>
          <div>
            <h2 id={`${line.id}-title`}>{line.title}</h2>
            <p>{line.description}</p>
          </div>
          <div className="products-line-actions">
            {!isExpanded && (
              <div
                className="products-carousel-controls"
                aria-label={`Navegar categorías de ${line.title}`}
              >
                <button
                  type="button"
                  aria-label="Ver categorías anteriores"
                  disabled={!canScrollBack}
                  onClick={() => scrollCarousel(-1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  aria-label="Ver categorías siguientes"
                  disabled={!canScrollForward}
                  onClick={() => scrollCarousel(1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            <button
              className="products-line-link"
              type="button"
              aria-expanded={isExpanded}
              aria-controls={`${line.id}-categories`}
              onClick={toggleExpanded}
            >
              {isExpanded ? "Ver menos" : "Ver todos"}
              <span aria-hidden="true">{isExpanded ? "↑" : "↓"}</span>
            </button>
          </div>
        </header>

        <div
          className={`products-category-grid${isExpanded ? " is-expanded" : ""}`}
          id={`${line.id}-categories`}
          ref={carouselRef}
          role="region"
          aria-label={`Categorías de ${line.title}`}
          aria-roledescription={isExpanded ? undefined : "carrusel"}
        >
          {line.categories.map((category) => (
            <Link
              className="products-category-card"
              href="/contacto"
              key={category.name}
            >
              <CategoryArtwork category={category} />
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <span className="products-category-action">
                Consultar <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="products-brand-rail">
          <div className="products-brand-heading">
            <p>Nuestras marcas</p>
          </div>
          <ul>
            {line.brands.map((brand) => (
              <li key={brand.name}>
                <Image
                  className={`products-brand-logo products-brand-logo-${brand.shape ?? "wide"}`}
                  src={brand.src}
                  alt={brand.name}
                  width={360}
                  height={180}
                  loading="eager"
                  sizes="(max-width: 520px) 35vw, (max-width: 900px) 22vw, 140px"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ProductsExperience() {
  return (
    <div className="home-page products-page">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="products-hero" aria-labelledby="products-title">
          <div className="container products-hero-card">
            <header className="products-hero-title">
              <div>
                <h1 className="page-display-title" id="products-title">
                  Productos
                </h1>
              </div>
            </header>
            <div className="products-hero-copy">
              <div className="products-hero-message">
                <h2>
                  El repuesto ideal,
                  <br />
                  <em>para cada camino.</em>
                </h2>
              </div>
              <div className="products-hero-support">
                <p>
                  Explora nuestras líneas de repuestos para vehículos livianos y
                  transporte pesado. Selecciona una categoría o habla con
                  nuestro equipo para identificar la pieza correcta.
                </p>
                <nav aria-label="Ir a una línea de productos">
                  <a href="#livianos">Ver Livianos</a>
                  <a href="#pesados">Ver Pesados</a>
                </nav>
              </div>
            </div>
          </div>
        </section>

        <div className="products-catalog">
          <ProductLineSection line={productLines[0]} />
          <ProductLineSection line={productLines[1]} />
        </div>

        <section
          className="products-final-cta"
          aria-labelledby="products-cta-title"
        >
          <div className="container products-final-cta-inner">
            <div>
              <p>Asesoría especializada</p>
              <h2 id="products-cta-title">¿No encuentras tu repuesto?</h2>
            </div>
            <div>
              <p>
                Comparte la marca, el modelo, el año y, si lo tienes, el chasis
                o VIN. Te ayudaremos a preparar tu consulta.
              </p>
              <Link className="button" href="/contacto">
                Hablemos de tu vehículo <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter topHref="#contenido" />
    </div>
  );
}
