import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { HomeExperience } from "../src/components/home-experience";

function stubQuoteStorage(name: string) {
  const storage = new Map<string, string>([
    [
      "continental-quote-items",
      JSON.stringify([
        {
          categoryPath: ["Sistema de frenos"],
          key: `livianos:${name.toLowerCase()}`,
          id: name.toLowerCase(),
          name,
          lineId: "livianos",
          lineName: "Línea de Livianos",
        },
      ]),
    ],
  ]);

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });

  return storage;
}

function fillPhoneContact(value = "7000 0000") {
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Ana López" },
  });
  fireEvent.change(screen.getByLabelText("Teléfono de contacto"), {
    target: { value },
  });
}

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty("color-scheme");
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("theme control", () => {
  it("switches theme and persists the choice", () => {
    const storage = new Map<string, string>();

    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    render(<HomeExperience hero={<div />} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Activar modo oscuro" }),
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem("continental-theme")).toBe("dark");
    expect(
      screen
        .getByRole("button", { name: "Activar modo claro" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
});

describe("footer legal navigation", () => {
  it("links to the privacy and legal documents", () => {
    render(<HomeExperience hero={<div />} />);

    expect(
      screen.getByRole("link", { name: "Privacidad" }).getAttribute("href"),
    ).toBe("/privacidad");
    expect(
      screen.getByRole("link", { name: "Aviso legal" }).getAttribute("href"),
    ).toBe("/aviso-legal");
  });

  it("links to the official social profiles", () => {
    render(<HomeExperience hero={<div />} />);

    const socialProfiles = [
      ["Facebook", "https://www.facebook.com/continentalautopartssv"],
      ["Instagram", "https://www.instagram.com/continentalautopartssv/?hl=es"],
      ["WhatsApp", "https://wa.me/50378401749"],
    ] as const;

    socialProfiles.forEach(([name, href]) => {
      const link = screen.getByRole("link", { name });

      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });
});

describe("about navigation", () => {
  it("opens both about links from the Nosotros control", () => {
    render(<HomeExperience hero={<div />} />);

    const trigger = screen.getByRole("button", { name: "Nosotros" });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Nosotros" })).toBeNull();

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen
        .getAllByRole("link", { name: "Quiénes somos" })
        .some((link) => link.getAttribute("href") === "/quienes-somos"),
    ).toBe(true);
    expect(
      screen
        .getByRole("link", { name: "Trabaja con nosotros" })
        .getAttribute("href"),
    ).toBe("/quienes-somos/trabaja-con-nosotros");
  });
});

describe("homepage product lines", () => {
  it("links the compact overview to both product catalog sections", () => {
    render(<HomeExperience hero={<div />} />);

    expect(
      screen
        .getByRole("link", { name: "Explorar Línea de Livianos" })
        .getAttribute("href"),
    ).toBe("/productos#livianos");
    expect(
      screen
        .getByRole("link", { name: "Explorar Línea de Pesados" })
        .getAttribute("href"),
    ).toBe("/productos#comercial");
  });

  it("replaces the homepage inquiry with the payment methods placeholder", () => {
    render(<HomeExperience hero={<div />} />);

    expect(
      screen.getByRole("heading", { name: "Formas de pago." }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Preparar mi consulta" }),
    ).toBeNull();
  });
});

describe("homepage store handoff", () => {
  it("links the online store callout to its configured destination", () => {
    render(<HomeExperience hero={<div />} />);

    expect(
      screen.getByRole("heading", {
        name: "Aprovecha nuestras promociones.",
      }),
    ).toBeTruthy();

    const storeBrand = screen.getByLabelText("Mercadito Continental");
    const storeBrandSources = Array.from(
      storeBrand.querySelectorAll("img"),
      (image) => decodeURIComponent(image.getAttribute("src") ?? ""),
    );

    expect(storeBrandSources).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/images/brands/mercadito-continental.png"),
        expect.stringContaining(
          "/images/brands/mercadito-continental-dark.png",
        ),
      ]),
    );

    const storeLink = screen.getByRole("link", {
      name: "Visitar la tienda",
    });

    expect(storeLink.getAttribute("href")).toBe("https://www.shopify.com/");
    expect(storeLink.getAttribute("target")).toBe("_blank");
    expect(storeLink.getAttribute("rel")).toContain("noopener");
  });
});

describe("homepage vehicle brands", () => {
  it("shows the official MINI logo without linking to the quote form", () => {
    render(<HomeExperience hero={<div />} />);

    const miniLogos = screen.getAllByRole("img", { name: "MINI" });

    expect(screen.queryByRole("link", { name: "MINI" })).toBeNull();
    expect(
      miniLogos.some((logo) =>
        decodeURIComponent(logo.getAttribute("src") ?? "").includes(
          "/images/brands/mini.png",
        ),
      ),
    ).toBe(true);
  });
});

describe("development controls", () => {
  it("persists page scale and accessibility previews", () => {
    const storage = new Map<string, string>();

    vi.stubEnv("NODE_ENV", "development");
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });

    const { container } = render(<HomeExperience hero={<div />} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ajustes de desarrollo" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "120%" }));
    fireEvent.click(
      screen.getByRole("button", { name: /Movimiento reducido/ }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Transparencia reducida/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Contraste alto/ }));
    expect(container.firstElementChild?.getAttribute("data-page-scale")).toBe(
      "120",
    );
    expect(
      container.firstElementChild?.getAttribute("data-reduced-motion"),
    ).toBe("true");
    expect(
      container.firstElementChild?.getAttribute("data-reduced-transparency"),
    ).toBe("true");
    expect(
      container.firstElementChild?.getAttribute("data-increased-contrast"),
    ).toBe("true");
    expect(localStorage.getItem("continental-dev-page-scale")).toBe("120");
    expect(localStorage.getItem("continental-dev-accessibility")).toBe("7");
  });
});

describe("contact inquiries", () => {
  it("shows custom field errors and focuses the first invalid control", async () => {
    render(<HomeExperience hero={<div />} page="quote" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );

    expect(screen.queryByText("Revisa los campos marcados.")).toBeNull();
    expect(
      screen.getByText("Selecciona la marca de tu vehículo."),
    ).toBeTruthy();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("radio", { name: "Volkswagen" }),
      );
    });
    expect(screen.getByLabelText("Modelo").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("opens chassis and VIN guidance from the input information button", () => {
    render(<HomeExperience hero={<div />} page="quote" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Más información sobre el chasis o VIN",
      }),
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(dialog.textContent).toContain(
      "Lo encuentras en la tarjeta de circulación o en la placa VIN del vehículo.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Entendido" }));
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("builds the inquiry and clears stale results after edits", () => {
    stubQuoteStorage("Frenos");
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<HomeExperience hero={<div />} page="quote" />);
    expect(screen.getByText("Frenos")).toBeTruthy();
    expect(screen.getByText("Categoría: Sistema de frenos")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Audi" }));
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "A3" },
    });
    fireEvent.change(screen.getByLabelText("Año"), {
      target: { value: "2020" },
    });
    fireEvent.change(screen.getByLabelText("Chasis o VIN"), {
      target: { value: "wauzzz8v1ja000001" },
    });
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana López" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Correo" }));
    fireEvent.change(screen.getByLabelText("Correo electrónico de contacto"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Frenos (categoría: Sistema de frenos). Son para mi Audi, modelo A3, año 2020",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "chasis o VIN WAUZZZ8V1JA000001",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Hola, soy Ana López.",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Mi correo de contacto es ana@example.com.",
    );
    expect(
      screen.queryByRole("link", { name: /Continuar en WhatsApp/ }),
    ).toBeNull();
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "A4" },
    });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("provides an encoded WhatsApp handoff only when configured", () => {
    stubQuoteStorage("Motor");
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "50370000000");
    render(<HomeExperience hero={<div />} page="quote" />);
    fireEvent.click(screen.getByRole("radio", { name: "SEAT" }));
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "León" },
    });
    fireEvent.change(screen.getByLabelText("Año"), {
      target: { value: "2021" },
    });
    fillPhoneContact();
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );
    const link = screen.getByRole("link", { name: /Continuar en WhatsApp/ });
    const url = new URL(link.getAttribute("href")!);
    expect(url.pathname).toBe("/50370000000");
    expect(url.searchParams.get("text")).toContain("modelo León, año 2021");
  });
});

describe("visual vehicle selector", () => {
  it("allows the active brand and quoted parts to be cleared", () => {
    const storage = stubQuoteStorage("Frenos");

    render(<HomeExperience hero={<div />} page="quote" />);
    const audi = screen.getByRole("radio", { name: "Audi" });

    fireEvent.click(audi);
    expect((audi as HTMLInputElement).checked).toBe(true);
    fireEvent.click(audi);
    expect((audi as HTMLInputElement).checked).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Quitar Frenos" }));
    expect(screen.queryByText("Frenos")).toBeNull();
    expect(storage.get("continental-quote-items")).toBe("[]");
  });

  it("changes model suggestions with the brand and clears an incompatible model", () => {
    render(<HomeExperience hero={<div />} page="quote" />);
    fireEvent.click(screen.getByRole("radio", { name: "Audi" }));
    const model = screen.getByLabelText("Modelo") as HTMLInputElement;
    expect(
      Array.from(model.list?.options ?? []).map((option) => option.value),
    ).toContain("A3");
    fireEvent.change(model, { target: { value: "A3" } });
    fireEvent.click(screen.getByRole("radio", { name: "Porsche" }));
    const changed = screen.getByLabelText("Modelo") as HTMLInputElement;
    expect(changed.value).toBe("");
    expect(
      Array.from(changed.list?.options ?? []).map((option) => option.value),
    ).toContain("Cayenne");
  });

  it("builds an inquiry from a calendar year and clears it after a year change", () => {
    stubQuoteStorage("Frenos");
    render(<HomeExperience hero={<div />} page="quote" />);
    fireEvent.click(screen.getByRole("radio", { name: "Audi" }));
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "A3" },
    });
    fireEvent.click(screen.getByLabelText("Abrir calendario de años"));
    fireEvent.click(screen.getByRole("button", { name: "2020" }));
    expect((screen.getByLabelText("Año") as HTMLInputElement).value).toBe(
      "2020",
    );
    fillPhoneContact();
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );
    expect(screen.getByRole("status").textContent).toContain("año 2020");
    fireEvent.click(screen.getByLabelText("Abrir calendario de años"));
    fireEvent.click(screen.getByRole("button", { name: "2021" }));
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("utility strip overscroll", () => {
  it("stays hidden on arrival and reveals after intentional wheel overscroll", () => {
    vi.stubGlobal("scrollY", 200);
    const { container } = render(<HomeExperience hero={<div />} />);
    const strip = container.querySelector(".topbar")!;
    expect(strip.getAttribute("aria-hidden")).toBe("true");

    fireEvent.wheel(window, { deltaY: -40 });
    expect(strip.getAttribute("aria-hidden")).toBe("true");
    vi.stubGlobal("scrollY", 0);
    fireEvent.scroll(window);
    expect(strip.getAttribute("aria-hidden")).toBe("true");

    fireEvent.wheel(window, { deltaY: -40 });
    expect(strip.getAttribute("aria-hidden")).toBe("true");
    fireEvent.wheel(window, { deltaY: -60 });
    expect(strip.getAttribute("aria-hidden")).toBe("false");
    fireEvent.wheel(window, { deltaY: 40 });
    expect(strip.getAttribute("aria-hidden")).toBe("true");
  });

  it("requires a deliberate touch pull at the top and hides after scrolling", () => {
    vi.stubGlobal("scrollY", 0);
    const { container } = render(<HomeExperience hero={<div />} />);
    const strip = container.querySelector(".topbar")!;

    fireEvent.touchStart(window, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(window, { touches: [{ clientY: 130 }] });
    expect(strip.getAttribute("aria-hidden")).toBe("true");
    fireEvent.touchMove(window, { touches: [{ clientY: 160 }] });
    expect(strip.getAttribute("aria-hidden")).toBe("false");
    fireEvent.touchEnd(window);
    vi.stubGlobal("scrollY", 50);
    fireEvent.scroll(window);
    expect(strip.getAttribute("aria-hidden")).toBe("true");
  });
});
