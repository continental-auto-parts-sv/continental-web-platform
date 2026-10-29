import "server-only";

import {
  activePromotions,
  demoPromotions,
  type PromotionContent,
} from "./promotions";

const query = `{
  "promotions": *[_type == "promotion" && active == true
    && (!defined(startsAt) || dateTime(startsAt) <= now())
    && (!defined(endsAt) || dateTime(endsAt) > now())]
    | order(_createdAt desc) {
      _id, "slug": slug.current, title, description, badge,
      category, terms, shopifyUrl, active, startsAt, endsAt,
      coverImage {
        ...,
        asset-> {
          _id,
          metadata {
            dimensions,
            lqip
          }
        }
      }
    },
  "featuredId": *[_id == "promotionSettings"][0].featuredPromotion._ref
}`;

export async function getPromotionContent(): Promise<PromotionContent> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!projectId) {
    return { promotions: demoPromotions, featuredId: demoPromotions[0]._id };
  }

  try {
    if (!/^[a-z0-9-]+$/.test(projectId) || !/^[a-zA-Z0-9_-]+$/.test(dataset)) {
      throw new Error("Invalid Sanity configuration");
    }

    const url = new URL(
      `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`,
    );
    url.searchParams.set("query", query);
    url.searchParams.set("perspective", "published");

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      headers: process.env.SANITY_API_TOKEN
        ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` }
        : {},
    });

    if (!response.ok) throw new Error(`Sanity response: ${response.status}`);

    const { result } = (await response.json()) as { result: PromotionContent };
    if (!Array.isArray(result?.promotions))
      throw new Error("Invalid promotion content");

    return {
      promotions: activePromotions(result.promotions),
      featuredId: result.featuredId ?? null,
    };
  } catch {
    // Never replace live offers with fictional discounts on a CMS failure.
    console.error("Promotions could not be loaded from Sanity.");
    return { promotions: [], featuredId: null, unavailable: true };
  }
}
