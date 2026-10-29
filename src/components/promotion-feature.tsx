import Image from "next/image";
import Link from "next/link";

import type { Promotion } from "@/lib/promotions";
import { urlForImage } from "../sanity/image";

export function PromotionArtwork({
  promotion,
  showFooter = true,
}: {
  promotion: Promotion;
  showFooter?: boolean;
}) {
  const coverImage = promotion.coverImage;
  const footerLabel = promotion.demo ? "PROMOCIÓN DE PRUEBA" : "VER MÁS";

  const coverImageUrl = coverImage
    ? urlForImage(coverImage)
        .width(1200)
        .height(900)
        .fit("crop")
        .auto("format")
        .url()
    : promotion.coverImageSrc;

  return (
    <div className="promotion-art promotion-art-photo">
      {coverImageUrl && (
        <Image
          alt={coverImage?.alt || ""}
          className="promotion-art-image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          src={coverImageUrl}
        />
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
        <PromotionArtwork promotion={promotion} />
        <div className="feature-copy">
          <p className="eyebrow">PROMOCIÓN</p>
          <h2>{promotion.title}</h2>
          <p>{promotion.description}</p>
        </div>
      </Link>
    </section>
  );
}
