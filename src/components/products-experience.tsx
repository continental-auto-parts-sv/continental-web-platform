"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import lightCategoryCatalogJson from "../data/light-product-categories.json";
import {
  parseProductCategoryCatalog,
  type ProductCategory,
} from "../lib/product-category-catalog";
import {
  addQuoteItem,
  type QuoteItem,
  useQuoteItems,
  writeQuoteItems,
} from "../lib/quote-cart";
import { DevSettings, useDevSettingsState } from "./dev-settings";
import { PartIcon } from "./part-icon";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SpecialOrdersCallout } from "./special-orders-callout";
import { StoreCta } from "./store-cta";

import "./home-design.css";
import "./products-experience.css";

type ProductLine = {
  id: "livianos" | "comercial";
  title: string;
  description: string;
  categories: ProductCategory[];
  brands: Array<{
    name: string;
    src: string;
    shape?: "square" | "wide";
  }>;
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

type CategoryEntry = {
  category: ProductCategory;
  path: ProductCategory[];
};

function flattenCategoryEntries(
  categories: ProductCategory[],
  parentPath: ProductCategory[] = [],
): CategoryEntry[] {
  return categories.flatMap((category) => {
    const path = [...parentPath, category];

    return [
      { category, path },
      ...flattenCategoryEntries(category.children, path),
    ];
  });
}

const lightCategoryCatalog = parseProductCategoryCatalog(
  lightCategoryCatalogJson,
);

const commercialCategoryCatalog = parseProductCategoryCatalog({
  schemaVersion: 1,
  lineId: "comercial",
  categories: [
    {
      id: "motor",
      name: "Motor",
      description: "",
      artwork: "engine",
    },
    {
      id: "transmision-y-caja",
      name: "Transmisión y caja",
      description: "",
      artwork: "transmission",
    },
    {
      id: "sistema-de-frenos",
      name: "Sistema de frenos",
      description: "",
      artwork: "brake",
    },
    {
      id: "suspension-y-direccion",
      name: "Suspensión y dirección",
      description: "",
      artwork: "steering-heavy",
    },
    {
      id: "tren-de-rodaje-y-ejes",
      name: "Tren de rodaje y ejes",
      description: "",
      artwork: "suspension",
    },
    {
      id: "sistema-hidraulico",
      name: "Sistema hidráulico",
      description: "",
    },
    {
      id: "sistema-electrico-y-electronico",
      name: "Sistema eléctrico y electrónico",
      description: "",
      artwork: "electrical-system",
    },
    {
      id: "lubricantes-y-fluidos",
      name: "Lubricantes y fluidos",
      description: "",
      artwork: "lubricant",
    },
  ],
});

const productLines: ProductLine[] = [
  {
    id: "livianos",
    title: "Línea de Livianos",
    description: "Repuestos para automóviles, SUV y vehículos de uso diario.",
    categories: lightCategoryCatalog.categories,
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
    id: "comercial",
    title: "Línea Comercial",
    description: "Repuestos para camiones, buses y transporte pesado.",
    categories: commercialCategoryCatalog.categories,
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

function CategoryArtwork({ category }: { category: ProductCategory }) {
  if (!category.artwork) {
    if (!category.icon) {
      return (
        <span
          className="products-category-art products-category-art-empty"
          aria-hidden="true"
        />
      );
    }

    return (
      <span className="products-category-icon">
        <PartIcon kind={category.icon} />
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

export function ProductCategoryCard({
  category,
  isQuoted = false,
  onSelect,
  onQuote,
}: {
  category: ProductCategory;
  isQuoted?: boolean;
  onSelect?: (category: ProductCategory) => void;
  onQuote?: (category: ProductCategory) => void;
}) {
  const isLeafCategory = category.children.length === 0;
  const cardClassName = `products-category-card${
    category.artwork || category.icon ? "" : " products-category-card-empty-art"
  }${isLeafCategory ? " products-category-card-leaf" : ""}${
    category.id === "limpiaparabrisas-y-lavaparabrisas"
      ? " products-category-card-long-title"
      : ""
  }`;

  if (isLeafCategory && !category.quoteEnabled) {
    return (
      <article className={`${cardClassName} products-category-card-static`}>
        <CategoryArtwork category={category} />
        <div>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </div>
      </article>
    );
  }

  if (isLeafCategory) {
    const content = (
      <>
        <CategoryArtwork category={category} />
        <span className="products-category-copy products-category-copy-leaf">
          <span
            className="products-category-title"
            role="heading"
            aria-level={3}
          >
            {category.name}
          </span>
          {category.description && (
            <span className="products-category-description">
              {category.description}
            </span>
          )}
          <span className="products-category-action">
            {isQuoted ? "Agregado a cotización" : "Cotizar repuesto"}
            <span aria-hidden="true">{isQuoted ? "✓" : "+"}</span>
          </span>
        </span>
      </>
    );

    if (onQuote) {
      return (
        <button
          className={`${cardClassName} products-category-card-quote-button`}
          type="button"
          aria-label={`${category.name}. ${
            isQuoted ? "Agregado a cotización" : "Cotizar repuesto"
          }`}
          aria-pressed={isQuoted}
          data-quoted={isQuoted}
          onClick={() => onQuote(category)}
        >
          {content}
        </button>
      );
    }

    return (
      <Link className={cardClassName} href={category.href}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${cardClassName} products-category-card-button`}
      type="button"
      onClick={() => onSelect?.(category)}
    >
      <CategoryArtwork category={category} />
      <span className="products-category-copy">
        <span className="products-category-title" role="heading" aria-level={3}>
          {category.name}
        </span>
        {category.description && (
          <span className="products-category-description">
            {category.description}
          </span>
        )}
      </span>
    </button>
  );
}

function ProductLineSection({
  line,
  onQuote,
  quoteItems,
}: {
  line: ProductLine;
  onQuote: (item: QuoteItem) => void;
  quoteItems: QuoteItem[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [categoryPath, setCategoryPath] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLUListElement>(null);
  const currentCategory = categoryPath.at(-1);
  const displayedCategories = currentCategory?.children ?? line.categories;
  const normalizedQuery = normalizeSearchValue(searchQuery.trim());
  const currentEntries = displayedCategories.map((category) => ({
    category,
    path: [...categoryPath, category],
  }));
  const searchableEntries = currentCategory
    ? flattenCategoryEntries(currentCategory.children, categoryPath)
    : flattenCategoryEntries(line.categories);
  const visibleEntries = normalizedQuery
    ? searchableEntries.filter(({ category }) =>
        normalizeSearchValue(category.name).includes(normalizedQuery),
      )
    : currentEntries;
  const suggestedEntries = normalizedQuery ? visibleEntries.slice(0, 6) : [];
  const usesCompactGrid = visibleEntries.length <= 12;
  const categoryLabel = currentCategory
    ? `Subcategorías de ${currentCategory.name}`
    : `Categorías de ${line.title}`;
  const quoteCategory = (
    category: ProductCategory,
    path: ProductCategory[],
  ) => {
    const parentCategoryPath = path
      .slice(0, -1)
      .map((pathCategory) => pathCategory.name);

    onQuote({
      artwork: category.artwork,
      categoryPath:
        parentCategoryPath.length > 0 ? parentCategoryPath : [category.name],
      key: `${line.id}:${category.id}`,
      id: category.id,
      name: category.name,
      lineId: line.id,
      lineName: line.title,
    });
  };

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
  }, [currentCategory?.id, isExpanded, searchQuery]);

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

  const navigateToCategory = (path: ProductCategory[]) => {
    setCategoryPath(path);
    setIsExpanded(false);
    setSearchQuery("");
    carouselRef.current?.scrollTo?.({ left: 0, behavior: "auto" });
  };

  const navigateToLevel = (level: number) => {
    setCategoryPath((currentPath) => currentPath.slice(0, level));
    setIsExpanded(false);
    setSearchQuery("");
    carouselRef.current?.scrollTo?.({ left: 0, behavior: "auto" });
  };

  const getSuggestionButtons = () =>
    Array.from(
      suggestionListRef.current?.querySelectorAll<HTMLButtonElement>(
        "button[data-suggestion-option]",
      ) ?? [],
    );

  const focusSuggestion = (index: number) => {
    const suggestionButtons = getSuggestionButtons();

    if (suggestionButtons.length === 0) {
      return;
    }

    const wrappedIndex =
      (index + suggestionButtons.length) % suggestionButtons.length;

    suggestionButtons[wrappedIndex]?.focus();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    const suggestionButtons = getSuggestionButtons();

    if (suggestionButtons.length === 0) {
      return;
    }

    event.preventDefault();
    focusSuggestion(
      event.key === "ArrowDown" ? 0 : suggestionButtons.length - 1,
    );
  };

  const handleSuggestionKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    const suggestionButtons = getSuggestionButtons();
    const currentIndex = suggestionButtons.indexOf(
      event.target as HTMLButtonElement,
    );

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();
    focusSuggestion(currentIndex + (event.key === "ArrowDown" ? 1 : -1));
  };

  return (
    <section
      className={`products-line products-line-${line.id}`}
      id={line.id}
      aria-labelledby={`${line.id}-title`}
    >
      <div className="container products-line-card">
        <header className="products-line-heading">
          <span className="products-line-icon" aria-hidden>
            {line.id === "livianos" ? (
              <>
                <Image
                  className="products-line-logo products-line-logo-light"
                  src="/images/brands/cap-linea-liviana.png"
                  alt=""
                  width={515}
                  height={515}
                  sizes="(max-width: 760px) 52px, 72px"
                  unoptimized
                />
                <Image
                  className="products-line-logo products-line-logo-dark"
                  src="/images/brands/cap-linea-liviana-dark.png"
                  alt=""
                  width={515}
                  height={515}
                  sizes="(max-width: 760px) 52px, 72px"
                  unoptimized
                />
              </>
            ) : (
              <>
                <Image
                  className="products-line-logo products-line-logo-commercial products-line-logo-light"
                  src="/images/brands/cap-linea-comercial.png"
                  alt=""
                  width={1537}
                  height={516}
                  sizes="(max-width: 760px) 104px, 142px"
                  unoptimized
                />
                <Image
                  className="products-line-logo products-line-logo-commercial products-line-logo-dark"
                  src="/images/brands/cap-linea-comercial-dark.png"
                  alt=""
                  width={1537}
                  height={516}
                  sizes="(max-width: 760px) 104px, 142px"
                  unoptimized
                />
              </>
            )}
          </span>
          <div>
            <h2 id={`${line.id}-title`}>{line.title}</h2>
            <p>{line.description}</p>
          </div>
          <div className="products-line-actions">
            {!usesCompactGrid && !isExpanded && (
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
            {!usesCompactGrid && (
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
            )}
          </div>
        </header>

        {line.id === "livianos" && (
          <div className="products-category-tools">
            <div className="products-category-search">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              {currentCategory && (
                <span className="products-category-filter-tag">
                  <span>{currentCategory.name}</span>
                  <button
                    type="button"
                    aria-label={`Quitar filtro ${currentCategory.name}`}
                    onClick={() => navigateToLevel(0)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </span>
              )}
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                autoComplete="off"
                aria-label="Buscar categorías"
                aria-autocomplete="list"
                aria-controls="livianos-category-suggestions"
                placeholder={
                  currentCategory
                    ? `Buscar dentro de ${currentCategory.name}`
                    : "Buscar en todo el catálogo"
                }
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsExpanded(false);
                }}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            {suggestedEntries.length > 0 && (
              <ul
                className="products-category-suggestions"
                id="livianos-category-suggestions"
                aria-label="Sugerencias de categorías"
                ref={suggestionListRef}
                onKeyDown={handleSuggestionKeyDown}
              >
                {suggestedEntries.map(({ category, path }) => {
                  const parentLabel = path
                    .slice(0, -1)
                    .map((pathCategory) => pathCategory.name)
                    .join(" / ");
                  const content = (
                    <>
                      <span>{category.name}</span>
                      <small>{parentLabel || "Categoría principal"}</small>
                    </>
                  );
                  const key = path
                    .map((pathCategory) => pathCategory.id)
                    .join("/");
                  const suggestionLabel = parentLabel
                    ? `${category.name}, en ${parentLabel}`
                    : category.name;

                  return (
                    <li key={key}>
                      {category.children.length > 0 ? (
                        <button
                          type="button"
                          data-suggestion-option
                          aria-label={suggestionLabel}
                          onClick={() => navigateToCategory(path)}
                        >
                          {content}
                        </button>
                      ) : category.quoteEnabled ? (
                        <button
                          type="button"
                          data-suggestion-option
                          aria-label={`${suggestionLabel}. Agregar a cotización`}
                          onClick={() => quoteCategory(category, path)}
                        >
                          {content}
                        </button>
                      ) : (
                        <span>{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div
          className={`products-category-grid${
            isExpanded ? " is-expanded" : ""
          }${usesCompactGrid ? " is-compact" : ""}`}
          id={`${line.id}-categories`}
          ref={carouselRef}
          role="region"
          aria-label={categoryLabel}
          aria-roledescription={isExpanded ? undefined : "carrusel"}
        >
          {visibleEntries.map(({ category, path }) => (
            <ProductCategoryCard
              category={category}
              isQuoted={quoteItems.some(
                (item) => item.key === `${line.id}:${category.id}`,
              )}
              key={path.map((pathCategory) => pathCategory.id).join("/")}
              onSelect={() => navigateToCategory(path)}
              onQuote={
                category.children.length === 0 && category.quoteEnabled
                  ? (selectedCategory) => quoteCategory(selectedCategory, path)
                  : undefined
              }
            />
          ))}
          {visibleEntries.length === 0 && (
            <div className="products-category-empty" role="status">
              <strong>No encontramos coincidencias.</strong>
              <span>Prueba con otra palabra.</span>
            </div>
          )}
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
  const quoteItems = useQuoteItems();
  const {
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
  } = useDevSettingsState();

  const toggleQuoteItem = (item: QuoteItem) => {
    const isAlreadyQuoted = quoteItems.some(
      (quoteItem) => quoteItem.key === item.key,
    );

    writeQuoteItems(
      isAlreadyQuoted
        ? quoteItems.filter((quoteItem) => quoteItem.key !== item.key)
        : addQuoteItem(quoteItems, item),
    );
  };

  return (
    <div
      className="home-page products-page"
      data-category-title-font={categoryTitleFont}
      data-page-scale={pageScale}
      data-reduced-motion={reducedMotion}
      data-reduced-transparency={reducedTransparency}
      data-increased-contrast={increasedContrast}
    >
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
                  <a
                    className="products-line-jump products-line-jump-livianos"
                    href="#livianos"
                  >
                    Ver Línea Livianos
                  </a>
                  <a
                    className="products-line-jump products-line-jump-comercial"
                    href="#comercial"
                  >
                    Ver Línea Comercial
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </section>

        <div className="products-catalog">
          <ProductLineSection
            line={productLines[0]}
            quoteItems={quoteItems}
            onQuote={toggleQuoteItem}
          />
          <ProductLineSection
            line={productLines[1]}
            quoteItems={quoteItems}
            onQuote={toggleQuoteItem}
          />
        </div>

        {/*<section*/}
        {/*  className="products-final-cta"*/}
        {/*  aria-labelledby="products-cta-title"*/}
        {/*>*/}
        {/*  <div className="container products-final-cta-inner">*/}
        {/*    <div>*/}
        {/*      <h2 id="products-cta-title">¿No encuentras tu repuesto?</h2>*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <p>*/}
        {/*        Cuéntanos qué repuesto necesitas y los datos de tu vehículo. Con*/}
        {/*        la marca, el modelo, el año o el VIN, te ayudamos a encontrar la*/}
        {/*        opción adecuada.*/}
        {/*      </p>*/}
        {/*      <Link className="button" href="/contacto">*/}
        {/*        Hablemos de tu vehículo <span aria-hidden="true">↗</span>*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        <SpecialOrdersCallout />

        <StoreCta products />
      </main>
      <DevSettings
        heroLayout={heroLayout}
        pageScale={pageScale}
        accessibilityPreview={accessibilityPreview}
        categoryTitleFont={categoryTitleFont}
        onHeroLayoutChange={setHeroLayout}
        onPageScaleChange={setPageScale}
        onAccessibilityPreviewChange={setAccessibilityPreview}
        onCategoryTitleFontChange={setCategoryTitleFont}
        showHeroControls={false}
        showCategoryFontControls
      />
      <SiteFooter topHref="#contenido" />
    </div>
  );
}
