export type Promotion = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  badge: string;
  category: string;
  icon: string;
  terms: string;
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
    title: "Frenos a punto. Sigue con confianza.",
    description:
      "Renueva discos y pastillas con un 15% de descuento en el kit de frenos.",
    badge: "15% OFF",
    category: "Frenos",
    icon: "brake",
    terms:
      "Promoción de prueba, sin validez comercial. El contenido definitivo, la compatibilidad y las condiciones se publicarán al activar las promociones reales.",
    active: true,
    demo: true,
  },
  {
    _id: "demo-oil",
    slug: "mantenimiento-esencial",
    title: "Un nuevo comienzo para tu motor.",
    description:
      "Aceite y filtro juntos: un 10% de descuento para tu próximo mantenimiento.",
    badge: "10% OFF",
    category: "Lubricantes",
    icon: "oil",
    terms:
      "Promoción de prueba, sin validez comercial. Consulta la especificación de aceite y el filtro adecuados para tu vehículo.",
    active: true,
    demo: true,
  },
  {
    _id: "demo-filters",
    slug: "respira-mejor",
    title: "Aire limpio. Mejor rendimiento.",
    description:
      "Combina filtro de aire y de cabina con un 20% de descuento en el segundo filtro.",
    badge: "20% OFF",
    category: "Filtros",
    icon: "filter",
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
