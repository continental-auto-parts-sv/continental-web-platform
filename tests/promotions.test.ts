import { afterEach, describe, expect, it, vi } from "vitest";

import {
  activePromotions,
  demoPromotions,
  featuredPromotion,
} from "../src/lib/promotions";
import { getPromotionContent } from "../src/lib/promotion-content";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("promotion visibility", () => {
  it("excludes inactive, future and expired offers, including date boundaries", () => {
    const now = Date.parse("2026-09-28T12:00:00Z");
    const base = demoPromotions[0];
    const visible = {
      ...base,
      _id: "visible",
      startsAt: "2026-09-28T12:00:00Z",
    };
    expect(
      activePromotions(
        [
          visible,
          { ...base, active: false },
          { ...base, startsAt: "2026-09-29T00:00:00Z" },
          { ...base, endsAt: "2026-09-28T12:00:00Z" },
        ],
        now,
      ),
    ).toEqual([visible]);
  });

  it("shows only the referenced active offer and never substitutes another one", () => {
    expect(
      featuredPromotion({ promotions: demoPromotions, featuredId: "demo-oil" })
        ?._id,
    ).toBe("demo-oil");
    expect(
      featuredPromotion({ promotions: demoPromotions, featuredId: null }),
    ).toBeUndefined();
    expect(
      featuredPromotion({
        promotions: [
          { ...demoPromotions[0], active: false },
          demoPromotions[1],
        ],
        featuredId: "demo-brakes",
      }),
    ).toBeUndefined();
  });

  it("uses examples only before a Sanity project is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    expect((await getPromotionContent()).promotions).toEqual(demoPromotions);
  });

  it("queries published CMS content and preserves a deliberately empty list", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "project123");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: { promotions: [], featuredId: null } }),
    });
    vi.stubGlobal("fetch", fetch);
    expect(await getPromotionContent()).toEqual({
      promotions: [],
      featuredId: null,
    });
    const url = fetch.mock.calls[0][0] as URL;
    expect(url.searchParams.get("perspective")).toBe("published");
    expect(url.hostname).toBe("project123.api.sanity.io");
  });

  it("does not show fictional offers when the configured CMS is unavailable", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "project123");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await getPromotionContent()).toEqual({
      promotions: [],
      featuredId: null,
      unavailable: true,
    });
  });
});
