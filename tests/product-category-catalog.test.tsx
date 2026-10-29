import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductCategoryCard } from "../src/components/products-experience";
import lightCategoryCatalogJson from "../src/data/light-product-categories.json";
import { parseProductCategoryCatalog } from "../src/lib/product-category-catalog";

afterEach(() => {
  cleanup();
});

describe("product category catalog", () => {
  it("loads the Trodo light-vehicle taxonomy without products", () => {
    const catalog = parseProductCategoryCatalog(lightCategoryCatalogJson);
    const categoryById = new Map(
      catalog.categories.map((category) => [category.id, category]),
    );
    const subcategoryCount = catalog.categories.reduce(
      (total, category) => total + category.children.length,
      0,
    );

    expect(catalog.categories).toHaveLength(17);
    expect(subcategoryCount).toBe(269);
    expect(categoryById.get("sistema-de-frenos")?.children).toHaveLength(21);
    expect(categoryById.get("aceites-y-fluidos")?.children).toHaveLength(13);
    expect(categoryById.get("accesorios-y-equipo")?.children).toHaveLength(27);
    expect(categoryById.get("herramientas")?.children).toHaveLength(0);
    expect(categoryById.get("sistema-de-frenos")?.artwork).toBe("brake");
    expect(categoryById.get("filtros")?.artwork).toBe("filter-v2");
    expect(categoryById.get("suspension")?.artwork).toBe("suspension");
    expect(categoryById.get("piezas-de-motor")?.artwork).toBe("engine");
    expect(categoryById.get("sistema-electrico")?.artwork).toBe(
      "electrical-system",
    );
    expect(categoryById.get("transmision-y-embrague")?.artwork).toBe(
      "transmission",
    );
    expect(categoryById.get("aceites-y-fluidos")?.artwork).toBe("lubricant");
    expect(categoryById.get("accesorios-y-equipo")?.artwork).toBe(
      "accessories",
    );
    expect(categoryById.get("herramientas")?.quoteEnabled).toBe(false);
    expect(
      catalog.categories.filter((category) => category.artwork === undefined),
    ).toHaveLength(9);
  });

  it("normalizes recursive JSON categories at any depth", () => {
    const catalog = parseProductCategoryCatalog({
      schemaVersion: 1,
      lineId: "livianos",
      categories: [
        {
          id: "motor",
          name: "Motor",
          description: "Componentes de motor.",
          children: [
            {
              id: "distribucion",
              name: "Distribución",
              description: "Sistemas de distribución.",
              children: [
                {
                  id: "tensores",
                  name: "Tensores",
                  description: "Tensores para distribución.",
                  href: "/productos/tensores",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(catalog.categories[0].children[0].children[0]).toMatchObject({
      id: "tensores",
      href: "/productos/tensores",
    });
    expect(catalog.categories[0].href).toBe("/cotizar-repuestos");
  });

  it("uses the same card component to select a recursive JSON level", () => {
    const catalog = parseProductCategoryCatalog({
      schemaVersion: 1,
      lineId: "livianos",
      categories: [
        {
          id: "motor",
          name: "Motor",
          description: "Componentes de motor.",
          children: [
            {
              id: "distribucion",
              name: "Distribución",
              description: "Sistemas de distribución.",
              children: [
                {
                  id: "tensores",
                  name: "Tensores",
                  description: "Tensores para distribución.",
                  href: "/productos/tensores",
                },
              ],
            },
          ],
        },
      ],
    });

    const handleSelect = vi.fn();

    render(
      <ProductCategoryCard
        category={catalog.categories[0]}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByRole("heading", { name: "Motor" })).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: /Cotizar repuesto/i }),
    ).toBeNull();
    expect(screen.queryByText(/Ver subcategorías/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Motor/ }));

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith(catalog.categories[0]);
  });

  it("shows the quote action only for a leaf category", () => {
    const catalog = parseProductCategoryCatalog({
      schemaVersion: 1,
      lineId: "livianos",
      categories: [
        {
          id: "tensores",
          name: "Tensores",
          description: "Tensores para distribución.",
          href: "/productos/tensores",
        },
      ],
    });

    render(<ProductCategoryCard category={catalog.categories[0]} />);

    const quoteLink = screen.getByRole("link", {
      name: /Cotizar repuesto/i,
    });

    expect(quoteLink.getAttribute("href")).toBe("/productos/tensores");
    expect(screen.queryByText(/Ver subcategorías/i)).toBeNull();
  });

  it("renders a leaf category without a quote action when disabled", () => {
    const catalog = parseProductCategoryCatalog({
      schemaVersion: 1,
      lineId: "livianos",
      categories: [
        {
          id: "herramientas",
          name: "Herramientas",
          quoteEnabled: false,
        },
      ],
    });

    render(<ProductCategoryCard category={catalog.categories[0]} />);

    expect(screen.getByRole("heading", { name: "Herramientas" })).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: /Cotizar repuesto/i }),
    ).toBeNull();
  });
});
