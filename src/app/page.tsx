import Image from "next/image";

import { HomeExperience } from "@/components/home-experience";

import { getPromotionContent } from "@/lib/promotion-content";
import { featuredPromotion } from "@/lib/promotions";

export default async function HomePage() {
  const content = await getPromotionContent();
  return (
    <HomeExperience
      promotion={featuredPromotion(content)}
      hero={
        <Image
          src="/images/audi-hero.webp"
          alt="Automóvil europeo plateado en un espacio de arquitectura contemporánea"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
      }
    />
  );
}
