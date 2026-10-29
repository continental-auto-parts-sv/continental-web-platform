import type { SanityImageSource } from "@sanity/image-url";

export type Promotion = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  badge: string;
  category: string;
  coverImage?: SanityImageSource & { alt?: string };
  coverImageSrc?: string;
  terms: string;
  shopifyUrl?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  demo?: boolean;
};

export type PromotionContent = {
  promotions: Promotion[];
  featuredId: string | null;
  unavailable?: boolean;
};

export const demoPromotions: Promotion[] = [
  {
    _id: "demo-brakes",
    slug: "frenos-a-punto",
    title: "Kit de frenos",
    description:
      "Obtén 15% de descuento en el kit de discos y pastillas para renovar tus frenos.",
    badge: "15% OFF",
    category: "Frenos",
    coverImageSrc: "/images/categories/brake-dark.webp",
    terms:
      "Promoción de prueba, sin validez comercial. El contenido definitivo, la compatibilidad y las condiciones se publicarán al activar las promociones reales.",
    active: true,
    demo: true,
  },
  {
    _id: "demo-oil",
    slug: "mantenimiento-esencial",
    title: "Mantenimiento esencial",
    description:
      "Obtén 10% de descuento al comprar juntos el aceite y el filtro para tu próximo mantenimiento.",
    badge: "10% OFF",
    category: "Lubricantes",
    coverImageSrc: "/images/categories/lubricant-dark.webp",
    terms:
      "Promoción de prueba, sin validez comercial. Consulta la especificación de aceite y el filtro adecuados para tu vehículo.",
    active: true,
    demo: true,
  },
  {
    _id: "demo-filters",
    slug: "respira-mejor",
    title: "Filtros de aire",
    description:
      "Combina el filtro de aire y el de cabina y recibe 20% de descuento en el segundo filtro.",
    badge: "20% OFF",
    category: "Filtros",
    coverImageSrc: "/images/categories/filter-v2-dark.webp",
    terms:
      "Promoción de prueba, sin validez comercial. Descuento ilustrativo sobre el filtro de menor valor.",
    active: true,
    demo: true,
  },
];

export function activePromotions(promotions: Promotion[], now = Date.now()) {
  return promotions.filter(
    (promotion) =>
      promotion.active &&
      (!promotion.startsAt || Date.parse(promotion.startsAt) <= now) &&
      (!promotion.endsAt || Date.parse(promotion.endsAt) > now),
  );
}

export function featuredPromotion(content: PromotionContent) {
  return activePromotions(content.promotions).find(
    (promotion) => promotion._id === content.featuredId,
  );
}
