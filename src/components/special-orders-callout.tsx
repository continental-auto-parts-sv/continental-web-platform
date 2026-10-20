import Link from "next/link";

import "./special-orders-callout.css";

export function SpecialOrdersCallout() {
  return (
    <section className="story-closing">
      <div className="story-closing-card story-copy-reveal">
        <div className="container story-closing-inner">
          <div className="story-closing-copy">
            <h2>¿Necesitas un repuesto especial?</h2>
            <p>
              Si no encuentras la pieza que necesitas, compártenos la marca, el
              modelo, el año, el VIN o número de chasis. Evaluaremos las
              opciones de abastecimiento para tu solicitud de pedido especial.
            </p>
          </div>
          <Link className="story-cta" href="/pedidos-especiales">
            <span>Ver pedidos especiales</span>
            <strong aria-hidden="true">↗</strong>
          </Link>
        </div>
      </div>
    </section>
  );
}
