import Link from "next/link";
import type { Metadata } from "next";

import { PromotionArtwork } from "@/components/promotion-feature";
import { PromotionShell } from "@/components/promotion-shell";
import { getPromotionContent } from "@/lib/promotion-content";

export const metadata: Metadata = { title: "Promociones" };

export default async function PromotionsPage() {
  const { promotions, unavailable } = await getPromotionContent();
  const [featuredPromotion, ...morePromotions] = promotions;

  return (
    <PromotionShell>
      <div className="promotions-page">
        <section className="promotions-intro container">
          <div className="promotions-intro-copy">
            <h1>
              Cuida tu auto.
              <br />
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
          {featuredPromotion && (
            <article className="promotion-lead">
              <Link
                className="promotion-lead-link"
                href={`/promociones/${featuredPromotion.slug}`}
                aria-label={`Ver promoción: ${featuredPromotion.title}`}
              >
                <PromotionArtwork
                  photoSrc="/images/promotions/featured-brake-service.webp"
                  promotion={featuredPromotion}
                />
                <div className="promotion-lead-copy">
                  <div>
                    <p className="eyebrow">
                      DESTACADA · {featuredPromotion.category}
                    </p>
                    <h2>{featuredPromotion.title}</h2>
                    <p>{featuredPromotion.description}</p>
                  </div>
                  <span className="promotion-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            </article>
          )}

          {morePromotions.length > 0 && (
            <div className="promotion-cards">
              {morePromotions.map((promotion) => (
                <article className="promotion-card" key={promotion._id}>
                  <Link
                    className="promotion-card-link"
                    href={`/promociones/${promotion.slug}`}
                    aria-label={`Ver promoción: ${promotion.title}`}
                  >
                    <PromotionArtwork promotion={promotion} />
                    <div className="promotion-card-copy">
                      <p className="eyebrow">{promotion.category}</p>
                      <h2>{promotion.title}</h2>
                      <p>{promotion.description}</p>
                      <span className="text-link">
                        Ver detalles <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
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

        {promotions.length > 0 && (
          <section className="promotion-support" aria-label="Asesoría">
            <div className="container promotion-support-inner">
              <div>
                <p className="eyebrow">ANTES DE COMPRAR</p>
                <h2>La promoción correcta empieza por la pieza correcta.</h2>
              </div>
              <p>
                Compártenos marca, modelo y año. Te ayudamos a revisar la
                compatibilidad antes de preparar tu cotización.
              </p>
              <Link className="button" href="/#consulta">
                Consultar mi vehículo <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </PromotionShell>
  );
}
