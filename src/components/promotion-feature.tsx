import Link from "next/link";

import type { Promotion } from "@/lib/promotions";
import { PartIcon } from "./part-icon";

export function PromotionArtwork({ promotion }: { promotion: Promotion }) {
  return (
    <div className={`promotion-art promotion-art-${promotion.icon}`}>
      <span className="promotion-art-label">
        CONTINENTAL / {promotion.category.toUpperCase()}
      </span>
      <div className="promotion-part">
        <PartIcon kind={promotion.icon} />
      </div>
      <span className="promotion-badge">{promotion.badge}</span>
      <span className="promotion-art-footer">
        {promotion.demo ? "PROMOCIÓN DE PRUEBA" : "SELECCIÓN CONTINENTAL"}{" "}
        <span>↗</span>
      </span>
    </div>
  );
}

export function PromotionFeature({ promotion }: { promotion: Promotion }) {
  return (
    <section className="feature-section" aria-label="Promoción destacada">
      <div className="container feature-grid">
        <Link
          href={`/promociones/${promotion.slug}`}
          aria-label={`Ver promoción: ${promotion.title}`}
        >
          <PromotionArtwork promotion={promotion} />
        </Link>
        <div className="feature-copy">
          <p className="eyebrow">LA PROMOCIÓN DESTACADA</p>
          <h2>{promotion.title}</h2>
          <p>{promotion.description}</p>
          {promotion.demo && (
            <p className="demo-label">Ejemplo · Sin validez comercial</p>
          )}
          <Link className="text-link" href={`/promociones/${promotion.slug}`}>
            Ver promoción <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
