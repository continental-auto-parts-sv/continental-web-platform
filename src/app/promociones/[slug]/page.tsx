import Link from "next/link";
import { notFound } from "next/navigation";

import { PromotionArtwork } from "@/components/promotion-feature";
import { PromotionShell } from "@/components/promotion-shell";
import { getPromotionContent } from "@/lib/promotion-content";

export default async function PromotionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { promotions } = await getPromotionContent();
  const promotion = promotions.find((item) => item.slug === slug);

  if (!promotion) notFound();

  return (
    <PromotionShell>
      <section className="container promotion-detail">
        <Link className="text-link" href="/promociones">
          ← Todas las promociones
        </Link>
        <div className="promotion-detail-grid">
          <PromotionArtwork promotion={promotion} />
          <div>
            <p className="eyebrow">
              {promotion.category} / {promotion.demo ? "EJEMPLO" : "PROMOCIÓN"}
            </p>
            <h1>{promotion.title}</h1>
            <p className="promotion-description">{promotion.description}</p>
            <h2>Condiciones</h2>
            <p className="promotion-terms">{promotion.terms}</p>
            {promotion.endsAt && (
              <p>
                Válida hasta{" "}
                {new Intl.DateTimeFormat("es-SV", {
                  dateStyle: "long",
                  timeZone: "America/El_Salvador",
                }).format(new Date(promotion.endsAt))}
                .
              </p>
            )}
            <Link className="button" href="/contacto">
              Consultar compatibilidad ↗
            </Link>
          </div>
        </div>
      </section>
    </PromotionShell>
  );
}
