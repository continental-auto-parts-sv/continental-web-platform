import { siteConfig } from "../lib/site";

import "./store-cta.css";

export function StoreCta({ products = false }: { products?: boolean }) {
  return (
    <section
      id="tienda-en-linea"
      className="store-cta"
      aria-labelledby={products ? "products-store-title" : "store-title"}
    >
      <div className="container store-cta-inner">
        <h2 id={products ? "products-store-title" : "store-title"}>
          {products
            ? "Compra nuestros productos en línea."
            : "Compra tus repuestos en línea."}
        </h2>
        <a
          className="store-cta-link"
          href={siteConfig.shopUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visitar la tienda
        </a>
      </div>
    </section>
  );
}
