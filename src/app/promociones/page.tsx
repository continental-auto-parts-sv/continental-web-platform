import Link from "next/link";
import type { Metadata } from "next";

import { PromotionArtwork } from "@/components/promotion-feature";
import { PromotionShell } from "@/components/promotion-shell";
import { getPromotionContent } from "@/lib/promotion-content";

export const metadata: Metadata = { title: "Promociones" };

export default async function PromotionsPage() {
  const { promotions, unavailable } = await getPromotionContent();

  return (
    <PromotionShell>
      <section className="promotions-intro container">
        <p className="eyebrow">MÁS PARA TU AUTO</p>
        <h1>
          Buenas piezas.
          <br />
          <em>Mejores oportunidades.</em>
        </h1>
        <p>Descubre lo que tenemos preparado para tu próximo mantenimiento.</p>
        {promotions.some((promotion) => promotion.demo) && (
          <span className="demo-notice">
            Vista de prueba · Estas promociones son ejemplos, sin validez
            comercial.
          </span>
        )}
      </section>
      <section
        className="container promotion-cards"
        aria-label="Promociones disponibles"
      >
        {promotions.map((promotion) => (
          <article className="promotion-card" key={promotion._id}>
            <Link
              href={`/promociones/${promotion.slug}`}
              aria-label={`Ver promoción: ${promotion.title}`}
            >
              <PromotionArtwork promotion={promotion} />
            </Link>
            <div className="promotion-card-copy">
              <p className="eyebrow">{promotion.category}</p>
              <h2>{promotion.title}</h2>
              <p>{promotion.description}</p>
              <Link
                className="text-link"
                href={`/promociones/${promotion.slug}`}
              >
                Ver detalles <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
        {promotions.length === 0 && (
          <div className="promotion-empty">
            <h2>
              {unavailable
                ? "No pudimos cargar las promociones."
                : "Pronto, nuevas oportunidades."}
            </h2>
            <p>
              {unavailable
                ? "Intenta de nuevo en unos minutos."
                : "Estamos preparando las próximas promociones para tu auto."}
            </p>
            <Link className="button" href="/#consulta">
              Consultar un repuesto ↗
            </Link>
          </div>
        )}
      </section>
    </PromotionShell>
  );
}
