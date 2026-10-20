import type { Metadata } from "next";
import Link from "next/link";

import { PromotionShell } from "../../components/promotion-shell";

import "./special-orders.css";

export const metadata: Metadata = {
  title: "Pedidos Especiales",
  description:
    "Solicita repuestos especiales para tu vehículo y recibe información de disponibilidad, precio y tiempo estimado de entrega.",
};

type SpecialOrderIconName = "vehicle" | "search" | "details";

function SpecialOrderIcon({ name }: { name: SpecialOrderIconName }) {
  if (name === "vehicle") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m5 11 1.6-4.2A2 2 0 0 1 8.5 5h7a2 2 0 0 1 1.9 1.8L19 11" />
        <rect x="3" y="10" width="18" height="8" rx="2" />
        <path d="M7 14h.01M17 14h.01M5 18v2M19 18v2" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5M10.5 7.5v6M7.5 10.5h6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 3h9l3 3v15H6Z" />
      <path d="M14 3v4h4M9 12l2 2 4-4M9 18h6" />
    </svg>
  );
}

export default function Page() {
  return (
    <PromotionShell>
      <article className="special-orders-page">
        <section
          className="special-orders-hero"
          aria-labelledby="special-orders-title"
        >
          <div className="container special-orders-hero-layout">
            <div className="special-orders-hero-copy">
              <h1 className="page-display-title" id="special-orders-title">
                Pedidos <em>especiales.</em>
              </h1>
            </div>

            <div className="special-orders-hero-aside">
              <h2>
                ¿No encuentras el repuesto? Nosotros te ayudamos a conseguirlo.
              </h2>
              <p>
                Revisamos opciones para piezas de mantenimiento, específicas o
                difíciles de encontrar, aunque no estén disponibles en nuestro
                inventario.
              </p>
              <a className="special-orders-jump" href="#como-funciona">
                Ver cómo funciona <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="special-orders-process"
          id="como-funciona"
          aria-labelledby="special-orders-process-title"
        >
          <div className="container">
            <header className="special-orders-section-heading">
              <h2 id="special-orders-process-title">
                Tú nos cuentas. Nosotros la buscamos.
              </h2>
            </header>

            <div className="special-orders-steps">
              <article className="special-orders-step">
                <span className="special-orders-step-icon">
                  <SpecialOrderIcon name="vehicle" />
                </span>
                <div>
                  <h3>Compártenos los datos</h3>
                  <p>
                    Marca, modelo y año. Si la tienes, agrega una fotografía o
                    el número de pieza.
                  </p>
                </div>
              </article>

              <article className="special-orders-step">
                <span className="special-orders-step-icon">
                  <SpecialOrderIcon name="search" />
                </span>
                <div>
                  <h3>Revisamos las opciones</h3>
                  <p>
                    Si no sabes cómo se llama, descríbela. Te ayudamos a
                    identificar la pieza y buscamos alternativas.
                  </p>
                </div>
              </article>

              <article className="special-orders-step">
                <span className="special-orders-step-icon">
                  <SpecialOrderIcon name="details" />
                </span>
                <div>
                  <h3>Decide con confianza</h3>
                  <p>
                    Antes de pedir, conocerás disponibilidad, precio y tiempo
                    estimado de entrega.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className="special-orders-timing"
          aria-labelledby="special-orders-timing-title"
        >
          <div className="container special-orders-timing-panel">
            <div
              className="special-orders-time"
              aria-label="10 a 15 días hábiles"
            >
              <strong>10–15</strong>
              <span>días hábiles</span>
            </div>
            <div className="special-orders-timing-copy">
              <h2 id="special-orders-timing-title">¿Cuánto tarda en llegar?</h2>
              <p>
                Este es el plazo habitual. Según el origen de la pieza y la
                disponibilidad del fabricante, algunos pedidos pueden tardar
                hasta <strong>30 días hábiles</strong>.
              </p>
              <p>
                Te confirmaremos el tiempo estimado antes de la compra y daremos
                seguimiento hasta la entrega.
              </p>
            </div>
          </div>
        </section>

        <section
          className="special-orders-closing"
          aria-labelledby="special-orders-closing-title"
        >
          <div className="container special-orders-closing-inner">
            <h2 id="special-orders-closing-title">
              Por pequeña o difícil que sea, revisemos cómo conseguirla.
            </h2>
            <Link className="button" href="/contacto">
              Consultar mi pedido especial <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </article>
    </PromotionShell>
  );
}
