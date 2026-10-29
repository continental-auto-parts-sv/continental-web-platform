import Link from "next/link";
import { notFound } from "next/navigation";

import { PromotionArtwork } from "@/components/promotion-feature";
import { PromotionShell } from "@/components/promotion-shell";
import { getPromotionContent } from "@/lib/promotion-content";

export async function generateStaticParams() {
  const { promotions } = await getPromotionContent();
  const params = promotions.map(({ slug }) => ({ slug }));

  if (params.length > 0 || process.env.GITHUB_PAGES !== "true") {
    return params;
  }

  return [{ slug: "_empty" }];
}

export default async function PromotionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { promotions } = await getPromotionContent();
  const promotion = promotions.find((item) => item.slug === slug);

  if (!promotion) notFound();

  const formattedEndDate = promotion.endsAt
    ? new Intl.DateTimeFormat("es-SV", {
        dateStyle: "long",
        timeZone: "America/El_Salvador",
      }).format(new Date(promotion.endsAt))
    : null;

  return (
    <PromotionShell>
      <section className="promotion-detail">
        <div className="container">
          <Link className="promotion-detail-back" href="/promociones">
            <span aria-hidden="true">←</span>
            Todas las promociones
          </Link>

          <div className="promotion-detail-grid">
            <div className="promotion-detail-media">
              <PromotionArtwork promotion={promotion} showFooter={false} />
            </div>

            <div className="promotion-detail-copy">
              <p className="eyebrow promotion-detail-eyebrow">
                <span>{promotion.category}</span>
                <span aria-hidden="true">/</span>
                <span>{promotion.demo ? "Ejemplo" : "Promoción"}</span>
              </p>

              <h1>{promotion.title}</h1>
              <p className="promotion-description">{promotion.description}</p>

              {promotion.shopifyUrl && (
                <div className="promotion-detail-actions">
                  <a
                    className="button"
                    href={promotion.shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Comprar en Mercadito
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}

              <aside
                className="promotion-detail-conditions"
                aria-labelledby="promotion-conditions-title"
              >
                <p className="promotion-detail-conditions-label">
                  Detalles de la oferta
                </p>
                <h2 id="promotion-conditions-title">Condiciones</h2>
                <p className="promotion-terms">{promotion.terms}</p>

                {formattedEndDate && (
                  <div className="promotion-detail-validity">
                    <span>Vigencia</span>
                    <time dateTime={promotion.endsAt}>
                      Hasta el {formattedEndDate}
                    </time>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </PromotionShell>
  );
}
