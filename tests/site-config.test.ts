import { describe, expect, it } from "vitest";

import { siteConfig } from "../src/lib/site";

describe("site navigation", () => {
  it("uses unique internal routes for every approved top-level destination", () => {
    const routes = siteConfig.navigation.map(({ href }) => href);

    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((route) => route.startsWith("/"))).toBe(true);
    expect(routes).toEqual(
      expect.arrayContaining([
        "/promociones",
        "/quienes-somos",
        "/productos",
        "/contacto",
      ]),
    );
  });
});
