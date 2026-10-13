import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProductsExperience } from "../src/components/products-experience";

afterEach(() => {
  cleanup();
});

describe("products catalog", () => {
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
});
