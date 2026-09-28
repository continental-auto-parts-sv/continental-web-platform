import { HeroSlideshow } from "@/components/hero-slideshow";

import { HomeExperience } from "@/components/home-experience";

import { getPromotionContent } from "@/lib/promotion-content";
import { featuredPromotion } from "@/lib/promotions";

export default async function HomePage() {
  const content = await getPromotionContent();
  return (
    <HomeExperience
      promotion={featuredPromotion(content)}
      hero={<HeroSlideshow />}
    />
  );
}
