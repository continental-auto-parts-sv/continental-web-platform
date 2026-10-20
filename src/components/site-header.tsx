"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ContinentalLogo } from "./continental-logo";
import { ThemeToggle } from "./theme-toggle";
import {
  buildQuoteHref,
  getQuoteCategoryLabel,
  useQuoteItemsState,
  writeQuoteItems,
} from "../lib/quote-cart";
import { siteConfig } from "../lib/site";

import "./site-header.css";

const quoteOverviewAddedDurationMs = 3000;
const quoteOverviewHoverCloseMs = 1000;
const quoteOverviewPointerGraceMs = 300;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [quoteOverviewOpen, setQuoteOverviewOpen] = useState(false);
  const [hasGlass, setHasGlass] = useState(false);
  const { items: quoteItems, ready: quoteItemsReady } = useQuoteItemsState();
  const pathname = usePathname();
  const aboutToggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const previousQuoteKeysRef = useRef<Set<string> | null>(null);
  const quoteOverviewWasEnteredRef = useRef(false);
  const quoteOverviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const toggleRef = useRef<HTMLButtonElement>(null);

  const clearQuoteOverviewTimer = useCallback(() => {
    if (!quoteOverviewTimerRef.current) return;

    clearTimeout(quoteOverviewTimerRef.current);
    quoteOverviewTimerRef.current = null;
  }, []);

  const scheduleQuoteOverviewClose = useCallback(
    (delay: number) => {
      clearQuoteOverviewTimer();

      quoteOverviewTimerRef.current = setTimeout(() => {
        setQuoteOverviewOpen(false);
        quoteOverviewTimerRef.current = null;
      }, delay);
    },
    [clearQuoteOverviewTimer],
  );

  const openQuoteOverview = useCallback(() => {
    if (quoteItems.length === 0) return;

    quoteOverviewWasEnteredRef.current = false;
    clearQuoteOverviewTimer();
    setQuoteOverviewOpen(true);
  }, [clearQuoteOverviewTimer, quoteItems.length]);

  const leaveQuoteOverviewArea = useCallback(() => {
    if (quoteOverviewWasEnteredRef.current) {
      scheduleQuoteOverviewClose(quoteOverviewHoverCloseMs);
      return;
    }

    scheduleQuoteOverviewClose(quoteOverviewPointerGraceMs);
  }, [scheduleQuoteOverviewClose]);

  useEffect(() => {
    function updateHeaderMaterial() {
      setHasGlass(window.scrollY > 8);
    }

    updateHeaderMaterial();
    window.addEventListener("scroll", updateHeaderMaterial, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderMaterial);
  }, []);

  useEffect(() => {
    if (!menuOpen && !aboutMenuOpen) return;

    function dismiss(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setAboutMenuOpen(false);
        setQuoteOverviewOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAboutMenuOpen(false);
        setQuoteOverviewOpen(false);

        if (aboutMenuOpen) {
          aboutToggleRef.current?.focus();
        } else {
          toggleRef.current?.focus();
        }
      }
    }

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [aboutMenuOpen, menuOpen]);

  useEffect(() => {
    if (!quoteItemsReady) return;

    const currentKeys = new Set(quoteItems.map((item) => item.key));
    const previousKeys = previousQuoteKeysRef.current;

    previousQuoteKeysRef.current = currentKeys;

    if (!previousKeys) return;

    const itemWasAdded = quoteItems.some((item) => !previousKeys.has(item.key));

    if (!itemWasAdded) return;

    clearQuoteOverviewTimer();
    setQuoteOverviewOpen(true);
    scheduleQuoteOverviewClose(quoteOverviewAddedDurationMs);
  }, [
    clearQuoteOverviewTimer,
    quoteItems,
    quoteItemsReady,
    scheduleQuoteOverviewClose,
  ]);

  useEffect(
    () => () => {
      if (quoteOverviewTimerRef.current) {
        clearTimeout(quoteOverviewTimerRef.current);
      }
    },
    [],
  );

  const quoteActionLabel =
    quoteItems.length === 1 ? "Cotizar repuesto" : "Cotizar repuestos";

  return (
    <header
      className="header site-header"
      ref={headerRef}
      data-glass={hasGlass}
    >
      <div className="container header-inner">
        <ContinentalLogo />
        <nav
          id="site-navigation"
          className={menuOpen ? "navigation open" : "navigation"}
          aria-label="Navegación principal"
        >
          {siteConfig.navigation.map(({ label, href }) => {
            const isAbout = href === "/quienes-somos";
            const isCareersPage =
              pathname === "/quienes-somos/trabaja-con-nosotros";
            const isCurrent =
              pathname === href || pathname?.startsWith(href + "/");

            return (
              <div
                className={
                  isAbout
                    ? "navigation-entry navigation-entry-with-submenu"
                    : "navigation-entry"
                }
                data-submenu-open={
                  isAbout && aboutMenuOpen ? "true" : undefined
                }
                key={href}
              >
                {isAbout ? (
                  <>
                    <button
                      className="navigation-about-trigger"
                      type="button"
                      ref={aboutToggleRef}
                      aria-controls="about-navigation-submenu"
                      aria-expanded={aboutMenuOpen}
                      onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                    >
                      Nosotros
                      <span className="navigation-chevron" aria-hidden="true">
                        ↓
                      </span>
                    </button>
                    <div
                      className="navigation-submenu"
                      id="about-navigation-submenu"
                      aria-label="Más sobre nosotros"
                    >
                      <Link
                        href="/quienes-somos"
                        aria-current={
                          isCurrent && !isCareersPage ? "page" : undefined
                        }
                        onClick={() => {
                          setMenuOpen(false);
                          setAboutMenuOpen(false);
                        }}
                      >
                        Quiénes somos
                      </Link>
                      <Link
                        href="/quienes-somos/trabaja-con-nosotros"
                        aria-current={isCareersPage ? "page" : undefined}
                        onClick={() => {
                          setMenuOpen(false);
                          setAboutMenuOpen(false);
                        }}
                      >
                        Trabaja con nosotros
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        <div className="header-actions">
          <div
            className="header-quote"
            onPointerEnter={openQuoteOverview}
            onPointerLeave={leaveQuoteOverviewArea}
            onFocus={() => {
              if (quoteItems.length === 0) return;

              clearQuoteOverviewTimer();
              setQuoteOverviewOpen(true);
            }}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              ) {
                scheduleQuoteOverviewClose(quoteOverviewHoverCloseMs);
              }
            }}
          >
            <Link
              className="button small header-cta"
              href={buildQuoteHref("/contacto", quoteItems)}
              aria-label={
                quoteItems.length > 0
                  ? `${quoteActionLabel}, ${quoteItems.length} ${
                      quoteItems.length === 1 ? "agregado" : "agregados"
                    }`
                  : quoteActionLabel
              }
              onClick={() => setQuoteOverviewOpen(false)}
            >
              <span className="header-cta-label">{quoteActionLabel}</span>
              <span className="header-cta-arrow" aria-hidden="true">
                ↗
              </span>
              <svg
                className="header-quote-mobile-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M6.5 8.5h11l-.8 11h-9.4l-.8-11Z" />
                <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
              </svg>
              {quoteItems.length > 0 && (
                <span className="header-quote-count" aria-hidden="true">
                  {quoteItems.length}
                </span>
              )}
            </Link>
            {quoteOverviewOpen && quoteItems.length > 0 && (
              <aside
                className="header-quote-overview"
                aria-live="polite"
                onPointerEnter={() => {
                  quoteOverviewWasEnteredRef.current = true;
                  clearQuoteOverviewTimer();
                }}
              >
                <div className="header-quote-overview-heading">
                  <strong>
                    {quoteItems.length === 1
                      ? "1 repuesto agregado"
                      : `${quoteItems.length} repuestos agregados`}
                  </strong>
                  <p>Tu selección está lista para cotizar.</p>
                </div>
                <ul>
                  {quoteItems
                    .slice(-3)
                    .reverse()
                    .map((item) => (
                      <li key={item.key}>
                        <span className="header-quote-item-art" aria-hidden>
                          {item.artwork && (
                            <>
                              <Image
                                className="header-quote-item-image header-quote-item-image-dark"
                                src={`/images/categories/${item.artwork}-dark.webp`}
                                alt=""
                                width={96}
                                height={96}
                                sizes="44px"
                              />
                              <Image
                                className="header-quote-item-image header-quote-item-image-light"
                                src={`/images/categories/${item.artwork}-light.webp`}
                                alt=""
                                width={96}
                                height={96}
                                sizes="44px"
                              />
                            </>
                          )}
                        </span>
                        <span className="header-quote-item-copy">
                          <b>{item.name}</b>
                          <small>{item.lineName}</small>
                          {getQuoteCategoryLabel(item) && (
                            <small>
                              Categoría: {getQuoteCategoryLabel(item)}
                            </small>
                          )}
                        </span>
                        <button
                          className="header-quote-item-remove"
                          type="button"
                          aria-label={`Quitar ${item.name} de la cotización`}
                          onClick={() => {
                            writeQuoteItems(
                              quoteItems.filter(
                                (quoteItem) => quoteItem.key !== item.key,
                              ),
                            );
                          }}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </aside>
            )}
          </div>
          <ThemeToggle />
        </div>
        <button
          className="menu-toggle"
          type="button"
          ref={toggleRef}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAboutMenuOpen(false);
          }}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>
    </header>
  );
}
