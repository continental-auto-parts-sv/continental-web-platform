import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductsExperience } from "../src/components/products-experience";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function openLightBrakeSystem() {
  const lightCategories = screen.getByRole("region", {
    name: "Categorías de Línea de Livianos",
  });

  fireEvent.click(
    within(lightCategories).getByRole("button", {
      name: "Sistema de frenos",
    }),
  );
}

describe("products catalog", () => {
  it("explains the future store integration and exposes its temporary link", () => {
    render(<ProductsExperience />);

    expect(
      screen.getByRole("heading", {
        name: "Aprovecha nuestras promociones.",
      }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Visitar la tienda" })
        .getAttribute("href"),
    ).toBe("https://www.shopify.com/");
  });

  it("reuses the styled special-orders callout", () => {
    render(<ProductsExperience />);

    expect(
      screen.getByRole("heading", {
        name: "¿Necesitas un repuesto especial?",
      }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /Ver pedidos especiales/ })
        .getAttribute("href"),
    ).toBe("/pedidos-especiales");
  });

  it("lists the complete Trodo taxonomy and commercial categories", () => {
    render(<ProductsExperience />);

    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });

    expect(within(lightCategories).getAllByRole("heading")).toHaveLength(18);
    expect(
      within(lightCategories).getByRole("heading", {
        name: "Sistema de frenos",
      }),
    ).toBeTruthy();
    expect(
      within(lightCategories).getByRole("heading", {
        name: "Aceites y fluidos",
      }),
    ).toBeTruthy();
    expect(
      within(lightCategories).getByRole("heading", {
        name: "Accesorios y equipo",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Herramientas" })).toBeTruthy();
    expect(
      within(lightCategories).getByRole("heading", { name: "Otro" }),
    ).toBeTruthy();
    const commercialCategories = screen.getByRole("region", {
      name: "Categorías de Línea Comercial",
    });

    expect(within(commercialCategories).getAllByRole("heading")).toHaveLength(
      9,
    );
    expect(
      within(commercialCategories).getByRole("heading", { name: "Motor" }),
    ).toBeTruthy();
    expect(
      within(commercialCategories).getByRole("heading", {
        name: "Transmisión y caja",
      }),
    ).toBeTruthy();
    expect(
      within(commercialCategories).getByRole("heading", {
        name: "Sistema hidráulico",
      }),
    ).toBeTruthy();
    expect(
      within(commercialCategories).getByRole("heading", { name: "Otro" }),
    ).toBeTruthy();
    expect(
      within(commercialCategories).queryByRole("heading", {
        name: "Embrague",
      }),
    ).toBeNull();
    expect(
      within(commercialCategories).queryByText(
        "Potencia y rendimiento para trabajo continuo.",
      ),
    ).toBeNull();
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

  it("keeps the category reading order when expanding the carousel", () => {
    render(<ProductsExperience />);

    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });
    const categoryHeadings = within(lightCategories).getAllByRole("heading");
    const categoryNames = categoryHeadings.map((heading) =>
      heading.textContent?.trim(),
    );
    const firstCard = categoryHeadings[0].closest<HTMLElement>(
      ".products-category-card",
    );
    const fifthCard = categoryHeadings[4].closest<HTMLElement>(
      ".products-category-card",
    );
    const sixthCard = categoryHeadings[5].closest<HTMLElement>(
      ".products-category-card",
    );
    const eleventhCard = categoryHeadings[10].closest<HTMLElement>(
      ".products-category-card",
    );
    const twelfthCard = categoryHeadings[11].closest<HTMLElement>(
      ".products-category-card",
    );
    const finalCard = categoryHeadings
      .at(-1)
      ?.closest<HTMLElement>(".products-category-card");

    expect(firstCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "1",
    );
    expect(fifthCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "1",
    );
    expect(sixthCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "2",
    );
    expect(eleventhCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "1",
    );
    expect(twelfthCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "2",
    );
    expect(finalCard?.style.getPropertyValue("--category-row-desktop")).toBe(
      "2",
    );

    fireEvent.click(
      screen.getAllByRole("button", {
        name: /Ver todos/,
      })[0],
    );

    expect(
      within(lightCategories)
        .getAllByRole("heading")
        .map((heading) => heading.textContent?.trim()),
    ).toEqual(categoryNames);
  });

  it("searches every catalog level and restores level zero when cleared", () => {
    render(<ProductsExperience />);

    const search = screen.getByRole("searchbox", {
      name: "Buscar categorías",
    });
    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });

    fireEvent.change(search, {
      target: { value: "liquido de direccion asistida" },
    });

    const suggestions = screen.getByRole("list", {
      name: "Sugerencias de categorías",
    });

    expect(
      within(suggestions).getByRole("button", {
        name: /Líquido de dirección asistida, en Aceites y fluidos/,
      }),
    ).toBeTruthy();
    expect(within(lightCategories).getAllByRole("heading")).toHaveLength(1);
    expect(
      within(lightCategories).getByRole("heading", {
        name: "Líquido de dirección asistida",
      }),
    ).toBeTruthy();

    fireEvent.change(search, { target: { value: "" } });

    expect(within(lightCategories).getAllByRole("heading")).toHaveLength(18);
    expect(
      screen.queryByRole("list", { name: "Sugerencias de categorías" }),
    ).toBeNull();
    expect(screen.queryByText("17 resultados")).toBeNull();
    expect(screen.queryByRole("button", { name: "Todas" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Con subcategorías" }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Consulta directa" }),
    ).toBeNull();
  });

  it("navigates search suggestions with the arrow keys", () => {
    render(<ProductsExperience />);

    const search = screen.getByRole("searchbox", {
      name: "Buscar categorías",
    });

    fireEvent.change(search, { target: { value: "freno" } });

    const suggestions = screen.getByRole("list", {
      name: "Sugerencias de categorías",
    });
    const suggestionButtons = within(suggestions).getAllByRole("button");

    expect(suggestionButtons.length).toBeGreaterThan(1);

    fireEvent.keyDown(search, { key: "ArrowDown" });
    expect(document.activeElement).toBe(suggestionButtons[0]);

    fireEvent.keyDown(suggestionButtons[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(suggestionButtons[1]);

    fireEvent.keyDown(suggestionButtons[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(suggestionButtons[0]);

    search.focus();
    fireEvent.keyDown(search, { key: "ArrowUp" });
    expect(document.activeElement).toBe(
      suggestionButtons[suggestionButtons.length - 1],
    );

    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Escape",
    });
    expect(document.activeElement).toBe(search);
  });

  it("uses a removable category tag to scope catalog searches", () => {
    render(<ProductsExperience />);

    openLightBrakeSystem();

    const subcategoryGrid = screen.getByRole("region", {
      name: "Subcategorías de Sistema de frenos",
    });

    expect(within(subcategoryGrid).getAllByRole("button")).toHaveLength(22);
    expect(
      within(subcategoryGrid).getByRole("button", {
        name: /Discos de freno/,
      }),
    ).toBeTruthy();
    expect(
      within(subcategoryGrid).getByRole("button", {
        name: "Otro. Cotizar repuesto",
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();

    expect(
      screen.queryByRole("navigation", {
        name: "Ruta de categorías de Línea de Livianos",
      }),
    ).toBeNull();

    const removeFilter = screen.getByRole("button", {
      name: "Quitar filtro Sistema de frenos",
    });
    const search = screen.getByRole("searchbox", {
      name: "Buscar categorías",
    });

    fireEvent.change(search, { target: { value: "filtro de aire" } });
    expect(screen.getByRole("status").textContent).toContain(
      "No encontramos coincidencias",
    );

    fireEvent.change(search, { target: { value: "discos" } });
    expect(
      within(subcategoryGrid).getByRole("heading", {
        name: "Discos de freno",
      }),
    ).toBeTruthy();

    fireEvent.click(removeFilter);

    expect(
      screen.getByRole("region", {
        name: "Categorías de Línea de Livianos",
      }),
    ).toBeTruthy();
    expect(within(subcategoryGrid).getAllByRole("heading")).toHaveLength(18);
  });

  it("uses motor artwork in the commercial product line", () => {
    const { container } = render(<ProductsExperience />);
    const commercialCategories = container.querySelector(
      '[aria-label="Categorías de Línea Comercial"]',
    );
    const motorImages = Array.from(
      commercialCategories?.querySelectorAll<HTMLImageElement>(
        'img[src*="engine-"]',
      ) ?? [],
    );

    expect(motorImages).toHaveLength(2);
    const sources = motorImages.map((image) => image.getAttribute("src"));

    expect(
      sources.filter((source) => source?.includes("engine-dark")),
    ).toHaveLength(1);
    expect(
      sources.filter((source) => source?.includes("engine-light")),
    ).toHaveLength(1);
  });

  it("uses dedicated electrical-system artwork in the commercial line", () => {
    const { container } = render(<ProductsExperience />);
    const commercialCategories = container.querySelector(
      '[aria-label="Categorías de Línea Comercial"]',
    );
    const electricalImages = Array.from(
      commercialCategories?.querySelectorAll<HTMLImageElement>(
        'img[src*="electrical-system"]',
      ) ?? [],
    );

    const sources = electricalImages.map((image) => image.getAttribute("src"));

    expect(electricalImages).toHaveLength(2);
    expect(
      sources.filter((source) => source?.includes("electrical-system-dark")),
    ).toHaveLength(1);
    expect(
      sources.filter((source) => source?.includes("electrical-system-light")),
    ).toHaveLength(1);
  });

  it("uses dedicated transmission artwork in the commercial line", () => {
    const { container } = render(<ProductsExperience />);
    const commercialCategories = container.querySelector(
      '[aria-label="Categorías de Línea Comercial"]',
    );
    const transmissionImages = Array.from(
      commercialCategories?.querySelectorAll<HTMLImageElement>(
        'img[src*="transmission-"]',
      ) ?? [],
    );

    const sources = transmissionImages.map((image) =>
      image.getAttribute("src"),
    );

    expect(transmissionImages).toHaveLength(2);
    expect(
      sources.filter((source) => source?.includes("transmission-dark")),
    ).toHaveLength(1);
    expect(
      sources.filter((source) => source?.includes("transmission-light")),
    ).toHaveLength(1);
  });

  it("reuses matching artwork and leaves unmatched categories blank", () => {
    const { container } = render(<ProductsExperience />);
    const lightCategories = container.querySelector(
      '[aria-label="Categorías de Línea de Livianos"]',
    );

    expect(
      lightCategories?.querySelectorAll(".products-category-art-empty"),
    ).toHaveLength(10);
    expect(
      lightCategories?.querySelectorAll(".products-category-art img"),
    ).toHaveLength(16);
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

  it("opens a dedicated form for commercial categories", async () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);

    const commercialCategories = screen.getByRole("region", {
      name: "Categorías de Línea Comercial",
    });

    fireEvent.click(
      within(commercialCategories).getByRole("button", {
        name: "Motor. Cotizar repuesto",
      }),
    );

    const dialog = await screen.findByRole("dialog");

    expect(dialog.hasAttribute("open")).toBe(true);
    expect(
      screen.getByRole("heading", {
        name: "Cotización de Línea Comercial.",
      }),
    ).toBeTruthy();
    expect((screen.getByLabelText("Categoría") as HTMLInputElement).value).toBe(
      "Motor",
    );
    expect(screen.queryByLabelText("Repuesto")).toBeNull();
    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText("Teléfono de contacto")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Teléfono" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Correo" })).toBeTruthy();
    expect(screen.getByLabelText("Marca")).toBeTruthy();
    expect(screen.getByLabelText("Modelo")).toBeTruthy();
    expect(screen.getByLabelText("Año")).toBeTruthy();
    expect(screen.getByLabelText("VIN o chasis")).toBeTruthy();
    expect(
      screen.getByLabelText("Descripción").getAttribute("placeholder"),
    ).toBe(
      "Escribe el nombre del repuesto o una descripción que nos ayude a identificarlo.",
    );
    expect(
      screen.getByLabelText("Fotografías del repuesto, opcionales"),
    ).toBeTruthy();
    expect(screen.getByRole("img", { name: "Línea Comercial" })).toBeTruthy();
    expect(storage.get("continental-quote-items")).toBeUndefined();
  });

  it("adds the light-line Otro category without a visible quote action", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);

    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });
    const otherCategory = within(lightCategories).getByRole("button", {
      name: "Otro",
    });

    expect(otherCategory.textContent).toBe("Otro");
    fireEvent.click(otherCategory);

    expect(storage.get("continental-quote-items")).toContain(
      '"key":"livianos:otro"',
    );
    expect(
      within(lightCategories).getByRole("button", {
        name: "Otro. Agregado a cotización",
      }),
    ).toBeTruthy();
  });

  it("adds final categories to a persistent quote checkout", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);
    openLightBrakeSystem();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    );

    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /Cotizar repuesto/ })
        .getAttribute("href"),
    ).toContain("/cotizar-repuestos?cotizacion=");
    expect(storage.get("continental-quote-items")).toContain("Discos de freno");
    expect(storage.get("continental-quote-items")).toContain(
      '"categoryPath":["Sistema de frenos"]',
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Agregado a cotización",
      }),
    );

    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
    expect(storage.get("continental-quote-items")).toBe("[]");
  });

  it("creates a flyer toward the navbar bag when adding a category", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 140,
      height: 120,
      left: 20,
      right: 180,
      top: 20,
      width: 160,
      x: 20,
      y: 20,
      toJSON: () => ({}),
    });

    const { container } = render(<ProductsExperience />);

    openLightBrakeSystem();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    );

    expect(container.querySelector(".products-quote-flyer")).toBeTruthy();
    expect(storage.get("continental-quote-items")).toContain("Discos de freno");
  });

  it("keeps Otro selections distinct across subcategories", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);
    openLightBrakeSystem();
    let subcategoryGrid = screen.getByRole("region", {
      name: "Subcategorías de Sistema de frenos",
    });

    fireEvent.click(
      within(subcategoryGrid).getByRole("button", {
        name: "Otro. Cotizar repuesto",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Quitar filtro Sistema de frenos",
      }),
    );

    const lightCategories = screen.getByRole("region", {
      name: "Categorías de Línea de Livianos",
    });

    fireEvent.click(
      within(lightCategories).getByRole("button", { name: "Filtros" }),
    );
    subcategoryGrid = screen.getByRole("region", {
      name: "Subcategorías de Filtros",
    });
    fireEvent.click(
      within(subcategoryGrid).getByRole("button", {
        name: "Otro. Cotizar repuesto",
      }),
    );

    expect(screen.getByText("2 repuestos agregados")).toBeTruthy();
    expect(storage.get("continental-quote-items")).toContain(
      '"key":"livianos:sistema-de-frenos:otro"',
    );
    expect(storage.get("continental-quote-items")).toContain(
      '"key":"livianos:filtros:otro"',
    );
  });

  it("hides the navbar quote overview three seconds after adding an item", () => {
    const storage = new Map<string, string>();

    vi.useFakeTimers();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);
    openLightBrakeSystem();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    );

    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    act(() => vi.advanceTimersByTime(1));

    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
  });

  it("keeps the quote overview open while hovered", () => {
    const storage = new Map<string, string>();

    vi.useFakeTimers();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);
    openLightBrakeSystem();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    );

    const overview = screen.getByText("1 repuesto agregado").closest("aside");

    expect(overview).toBeTruthy();
    fireEvent.pointerEnter(overview!);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    fireEvent.pointerLeave(overview!);
    act(() => vi.advanceTimersByTime(999));
    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
  });

  it("closes the quote overview after a brief pointer grace period", () => {
    const storage = new Map<string, string>();

    storage.set(
      "continental-quote-items",
      JSON.stringify([
        {
          categoryPath: ["Sistema de frenos"],
          key: "livianos:discos-de-freno",
          id: "discos-de-freno",
          name: "Discos de freno",
          lineId: "livianos",
          lineName: "Línea de Livianos",
        },
      ]),
    );
    vi.useFakeTimers();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);

    expect(screen.queryByText("1 repuesto agregado")).toBeNull();

    const quoteButton = screen.getByRole("link", {
      name: "Cotizar repuesto, 1 agregado",
    });

    fireEvent.pointerEnter(quoteButton);
    const overview = screen.getByText("1 repuesto agregado").closest("aside");

    expect(overview).toBeTruthy();
    expect(overview?.textContent).toContain("Categoría: Sistema de frenos");
    expect(overview?.textContent).not.toContain("repuesto seleccionado");
    expect(overview?.textContent).not.toContain("Continuar");

    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    fireEvent.pointerLeave(quoteButton.closest(".header-quote")!);
    act(() => vi.advanceTimersByTime(299));
    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
  });

  it("keeps the quote overview open when entered during the pointer grace period", () => {
    const storage = new Map<string, string>();

    storage.set(
      "continental-quote-items",
      JSON.stringify([
        {
          categoryPath: ["Sistema de frenos"],
          key: "livianos:discos-de-freno",
          id: "discos-de-freno",
          name: "Discos de freno",
          lineId: "livianos",
          lineName: "Línea de Livianos",
        },
      ]),
    );
    vi.useFakeTimers();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);

    const quoteButton = screen.getByRole("link", {
      name: "Cotizar repuesto, 1 agregado",
    });

    fireEvent.pointerEnter(quoteButton);
    const overview = screen.getByText("1 repuesto agregado").closest("aside");
    const quoteArea = quoteButton.closest(".header-quote")!;

    fireEvent.pointerLeave(quoteArea);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerEnter(overview!);
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByText("1 repuesto agregado")).toBeTruthy();

    fireEvent.pointerLeave(quoteArea);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
  });

  it("pluralizes the navbar quote action for multiple items", () => {
    const storage = new Map<string, string>();

    storage.set(
      "continental-quote-items",
      JSON.stringify([
        {
          key: "livianos:discos-de-freno",
          id: "discos-de-freno",
          name: "Discos de freno",
          lineId: "livianos",
          lineName: "Línea de Livianos",
        },
        {
          key: "livianos:pastillas-de-freno",
          id: "pastillas-de-freno",
          name: "Pastillas de freno",
          lineId: "livianos",
          lineName: "Línea de Livianos",
        },
      ]),
    );
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);

    expect(
      screen.getByRole("link", {
        name: "Cotizar repuestos, 2 agregados",
      }),
    ).toBeTruthy();
  });

  it("removes a quoted item from the navbar overview", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    render(<ProductsExperience />);
    openLightBrakeSystem();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Quitar Discos de freno de la cotización",
      }),
    );

    expect(screen.queryByText("1 repuesto agregado")).toBeNull();
    expect(storage.get("continental-quote-items")).toBe("[]");
    expect(
      screen.getByRole("button", {
        name: "Discos de freno. Cotizar repuesto",
      }),
    ).toBeTruthy();
  });

  it("uses a row-first grid for category lists of up to twelve items", () => {
    const { container } = render(<ProductsExperience />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Limpiaparabrisas y lavaparabrisas",
      }),
    );

    const categoryGrid = container.querySelector(
      ".products-line-livianos .products-category-grid",
    );

    expect(categoryGrid?.classList.contains("is-compact")).toBe(true);
    expect(
      categoryGrid?.querySelectorAll(".products-category-card"),
    ).toHaveLength(9);
  });
});
