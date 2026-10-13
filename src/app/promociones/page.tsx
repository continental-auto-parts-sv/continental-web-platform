import Link from "next/link";
import type { Metadata } from "next";

import { PromotionArtwork } from "@/components/promotion-feature";
import { PromotionShell } from "@/components/promotion-shell";
import { getPromotionContent } from "@/lib/promotion-content";

export const metadata: Metadata = { title: "Promociones" };

export default async function PromotionsPage() {
  const { promotions, featuredId, unavailable } = await getPromotionContent();
  const orderedPromotions = [...promotions].sort(
    (first, second) =>
      Number(second._id === featuredId) - Number(first._id === featuredId),
  );

  return (
    <PromotionShell>
      <div className="promotions-page">
        <section className="promotions-intro container">
          <div className="promotions-intro-copy">
            <h1 className="page-display-title">
              <em>Aprovecha</em> el momento.
            </h1>
          </div>
          <div className="promotions-intro-aside">
            <p>
              Selecciones pensadas para mantener tu europeo listo, con piezas
              correctas y orientación especializada.
            </p>
            <a className="text-link" href="#promociones-disponibles">
              Ver promociones <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="container promotion-showcase"
          id="promociones-disponibles"
          aria-label="Promociones disponibles"
        >
          {orderedPromotions.length > 0 && (
            <div className="promotion-showcase-header">
              <h2>Promociones activas</h2>
            </div>
          )}

          {orderedPromotions.length > 0 && (
            <div className="promotion-cards">
              {orderedPromotions.map((promotion) => {
                const isFeatured = promotion._id === featuredId;

                return (
                  <article
                    className={`promotion-card${
                      isFeatured ? " promotion-card-featured" : ""
                    }`}
                    key={promotion._id}
                  >
                    <Link
                      className="promotion-card-link"
                      href={`/promociones/${promotion.slug}`}
                      aria-label={`Ver promoción: ${promotion.title}`}
                    >
                      <PromotionArtwork
                        photoSrc={
                          isFeatured
                            ? "/images/promotions/featured-brake-service.webp"
                            : undefined
                        }
                        promotion={promotion}
                      />
                      <div className="promotion-card-copy">
                        <p className="eyebrow">
                          <span>{promotion.category}</span>
                        </p>
                        <h3>{promotion.title}</h3>
                        <p>{promotion.description}</p>
                        <span className="text-link">
                          Ver detalles <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

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
      </div>
    </PromotionShell>
  );
}
