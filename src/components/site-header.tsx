"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ContinentalLogo } from "./continental-logo";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "../lib/site";

import "./site-header.css";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasGlass, setHasGlass] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function updateHeaderMaterial() {
      setHasGlass(window.scrollY > 8);
    }

    updateHeaderMaterial();
    window.addEventListener("scroll", updateHeaderMaterial, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderMaterial);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function dismiss(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

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
          {siteConfig.navigation.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || pathname?.startsWith(href + "/")
                  ? "page"
                  : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="button small header-cta" href="/contacto">
            Cotizar repuestos <span aria-hidden="true">↗</span>
          </Link>
          <ThemeToggle />
        </div>
        <button
          className="menu-toggle"
          type="button"
          ref={toggleRef}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>
    </header>
  );
}
