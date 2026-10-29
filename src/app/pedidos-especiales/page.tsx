import type { Metadata } from "next";

import { PromotionShell } from "../../components/promotion-shell";
import { SpecialOrderRequestModal } from "../../components/special-order-request-modal";

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
                Pedidos <em>especiales</em>
              </h1>
            </div>

            <div className="special-orders-hero-aside">
              <h2>¿No encuentras el repuesto?</h2>
              <p>
                Nosotros revisamos opciones para piezas de mantenimiento,
                específicas o difíciles de encontrar, aunque no estén
                disponibles en nuestro inventario.
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
                    Indícanos la marca, el modelo, el año y el VIN o número de
                    chasis. También puedes agregar una fotografía o el número de
                    pieza.
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
          className="special-orders-closing"
          aria-labelledby="special-orders-closing-title"
        >
          <div className="container special-orders-closing-inner">
            <h2 id="special-orders-closing-title">
              No hay pedido pequeño{" "}
              <span className="special-orders-closing-line">
                si es importante para ti.
              </span>
            </h2>
            <SpecialOrderRequestModal />
          </div>
        </section>
      </article>
    </PromotionShell>
  );
}
