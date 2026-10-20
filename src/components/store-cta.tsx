import Image from "next/image";

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
        <span className="store-cta-brand" aria-label="Mercadito Continental">
          <Image
            className="store-cta-logo store-cta-logo-light"
            src="/images/brands/mercadito-continental.png"
            alt=""
            width={1518}
            height={356}
            sizes="(max-width: 720px) 82vw, 340px"
          />
          <Image
            className="store-cta-logo store-cta-logo-dark"
            src="/images/brands/mercadito-continental-dark.png"
            alt=""
            width={1518}
            height={356}
            sizes="(max-width: 720px) 82vw, 340px"
          />
        </span>
        <h2 id={products ? "products-store-title" : "store-title"}>
          Aprovecha nuestras promociones.
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
