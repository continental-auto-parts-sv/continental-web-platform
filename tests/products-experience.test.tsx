import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProductsExperience } from "../src/components/products-experience";

afterEach(() => {
  cleanup();
});

describe("products catalog", () => {
  it("explains the future store integration and exposes its temporary link", () => {
    render(<ProductsExperience />);

    expect(
      screen.getByRole("heading", {
        name: "Compra nuestros productos en línea.",
      }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Visitar la tienda" })
        .getAttribute("href"),
    ).toBe("https://www.shopify.com/");
  });

  it("lists every light and heavy category", () => {
    render(<ProductsExperience />);

    [
      "Motor",
      "Frenos",
      "Suspensión",
      "Filtros",
      "Lubricantes",
      "Sistema eléctrico",
      "Transmisión",
      "Accesorios",
      "Frenos pesados",
      "Suspensión pesada",
      "Embrague",
      "Dirección",
    ].forEach((category) => {
      expect(screen.getAllByRole("heading", { name: category }).length).toBe(
        category === "Filtros" ||
          category === "Lubricantes" ||
          category === "Sistema eléctrico" ||
          category === "Transmisión"
          ? 2
          : 1,
      );
    });
  });

  it("expands a carousel into the complete category grid", () => {
    render(<ProductsExperience />);

    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });
    const showAll = screen.getAllByRole("button", {
      name: /Ver todos/,
    })[0];

    expect(lightCategories.getAttribute("aria-roledescription")).toBe(
      "carrusel",
    );
    expect(showAll.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(showAll);

    expect(lightCategories.getAttribute("aria-roledescription")).toBeNull();
    expect(showAll.getAttribute("aria-expanded")).toBe("true");
    expect(showAll.textContent).toContain("Ver menos");
  });

  it("loads filter artwork directly inside both product lines", () => {
    const { container } = render(<ProductsExperience />);
    const filterImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[src*="filter-v2"]'),
    );

    expect(filterImages).toHaveLength(4);
    filterImages.forEach((image) => {
      expect(image.getAttribute("src")).toMatch(
        /^\/images\/categories\/filter-v2-(dark|light)\.webp$/,
      );
      expect(image.getAttribute("loading")).toBe("eager");
    });
  });

  it("uses dedicated electrical-system artwork in both vehicle lines", () => {
    const { container } = render(<ProductsExperience />);
    const electricalImages = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        'img[src*="electrical-system"]',
      ),
    );

    const sources = electricalImages.map((image) => image.getAttribute("src"));

    expect(electricalImages).toHaveLength(4);
    expect(
      sources.filter((source) => source?.includes("electrical-system-dark")),
    ).toHaveLength(2);
    expect(
      sources.filter((source) => source?.includes("electrical-system-light")),
    ).toHaveLength(2);
  });

  it("uses dedicated transmission artwork in both vehicle lines", () => {
    const { container } = render(<ProductsExperience />);
    const transmissionImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[src*="transmission-"]'),
    );

    const sources = transmissionImages.map((image) =>
      image.getAttribute("src"),
    );

    expect(transmissionImages).toHaveLength(4);
    expect(
      sources.filter((source) => source?.includes("transmission-dark")),
    ).toHaveLength(2);
    expect(
      sources.filter((source) => source?.includes("transmission-light")),
    ).toHaveLength(2);
  });

  it("uses dedicated artwork for light-vehicle accessories", () => {
    const { container } = render(<ProductsExperience />);
    const accessoryImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[src*="accessories-"]'),
    );

    expect(accessoryImages).toHaveLength(2);
    expect(accessoryImages[0].getAttribute("src")).toContain(
      "accessories-dark.webp",
    );
    expect(accessoryImages[1].getAttribute("src")).toContain(
      "accessories-light.webp",
    );
  });

  it("uses dedicated artwork for the heavy-vehicle clutch", () => {
    const { container } = render(<ProductsExperience />);
    const clutchImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[src*="clutch-heavy-"]'),
    );

    expect(clutchImages).toHaveLength(2);
    expect(clutchImages[0].getAttribute("src")).toContain(
      "clutch-heavy-dark.webp",
    );
    expect(clutchImages[1].getAttribute("src")).toContain(
      "clutch-heavy-light.webp",
    );
  });

  it("uses dedicated artwork for heavy-vehicle steering", () => {
    const { container } = render(<ProductsExperience />);
    const steeringImages = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        'img[src*="steering-heavy-"]',
      ),
    );

    expect(steeringImages).toHaveLength(2);
    expect(steeringImages[0].getAttribute("src")).toContain(
      "steering-heavy-dark.webp",
    );
    expect(steeringImages[1].getAttribute("src")).toContain(
      "steering-heavy-light.webp",
    );
  });
});
