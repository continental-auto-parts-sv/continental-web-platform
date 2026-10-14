import Image from "next/image";
import Link from "next/link";

import type { Promotion } from "@/lib/promotions";
import { PartIcon } from "./part-icon";

export function PromotionArtwork({
  promotion,
  photoSrc,
  showLabel = true,
  showFooter = true,
}: {
  promotion: Promotion;
  photoSrc?: string;
  showLabel?: boolean;
  showFooter?: boolean;
}) {
  let footerLabel = promotion.demo
    ? "PROMOCIÓN DE PRUEBA"
    : "SELECCIÓN CONTINENTAL";

  if (photoSrc) {
    footerLabel = "VER MÁS";
  }

  return (
    <div
      className={`promotion-art promotion-art-${promotion.icon}${
        photoSrc ? " promotion-art-photo" : ""
      }`}
    >
      {photoSrc && (
        <Image
          alt=""
          className="promotion-art-image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          src={photoSrc}
        />
      )}
      {!photoSrc && showLabel && (
        <span className="promotion-art-label">
          CONTINENTAL / {promotion.category.toUpperCase()}
        </span>
      )}
      {!photoSrc && (
        <div className="promotion-part">
          <PartIcon kind={promotion.icon} />
        </div>
      )}
      <span className="promotion-badge">{promotion.badge}</span>
      {showFooter && (
        <span className="promotion-art-footer">
          {footerLabel} <span aria-hidden="true">↗</span>
        </span>
      )}
    </div>
  );
}

export function PromotionFeature({ promotion }: { promotion: Promotion }) {
  return (
    <section className="feature-section" aria-label="Promoción destacada">
      <Link
        className="container feature-grid feature-link"
        href={`/promociones/${promotion.slug}`}
        aria-label={`Ver promoción: ${promotion.title}`}
      >
        <PromotionArtwork
          photoSrc="/images/promotions/featured-brake-service.webp"
          promotion={promotion}
        />
        <div className="feature-copy">
          <p className="eyebrow">PROMOCIÓN</p>
          <h2>{promotion.title}</h2>
          <p>{promotion.description}</p>
        </div>
      </Link>
    </section>
  );
}
