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
    ).toBe("/productos#pesados");
  });
});

describe("homepage vehicle brands", () => {
  it("includes the official MINI logo in the brands overview", () => {
    render(<HomeExperience hero={<div />} />);

    const miniLink = screen.getByRole("link", { name: "MINI" });
    const miniLogo = miniLink.querySelector("img");

    expect(miniLink.getAttribute("href")).toBe("#consulta");
    expect(decodeURIComponent(miniLogo?.getAttribute("src") ?? "")).toContain(
      "/images/brands/mini.png",
    );
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

describe("homepage inquiries", () => {
  it("shows custom field errors and focuses the first invalid control", async () => {
    render(<HomeExperience hero={<div />} />);

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
    render(<HomeExperience hero={<div />} />);

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

  it("prefills a category, builds the inquiry, and clears stale results after edits", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    Element.prototype.scrollIntoView = vi.fn();
    render(<HomeExperience hero={<div />} />);
    fireEvent.click(screen.getByRole("button", { name: /02 Frenos/ }));
    expect(
      (screen.getByRole("radio", { name: "Frenos" }) as HTMLInputElement)
        .checked,
    ).toBe(true);
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
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );
    expect(screen.getByRole("status").textContent).toContain(
      "frenos para mi Audi, modelo A3, año 2020",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "chasis o VIN WAUZZZ8V1JA000001",
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
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "50370000000");
    render(<HomeExperience hero={<div />} />);
    fireEvent.click(screen.getByRole("radio", { name: "SEAT" }));
    fireEvent.click(screen.getByRole("radio", { name: "Motor" }));
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "León" },
    });
    fireEvent.change(screen.getByLabelText("Año"), {
      target: { value: "2021" },
    });
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
  it("allows active brand and part selections to be cleared", () => {
    render(<HomeExperience hero={<div />} />);
    const audi = screen.getByRole("radio", { name: "Audi" });
    const brakes = screen.getByRole("radio", { name: "Frenos" });

    fireEvent.click(audi);
    expect((audi as HTMLInputElement).checked).toBe(true);
    fireEvent.click(audi);
    expect((audi as HTMLInputElement).checked).toBe(false);

    fireEvent.click(brakes);
    expect((brakes as HTMLInputElement).checked).toBe(true);
    fireEvent.click(brakes);
    expect((brakes as HTMLInputElement).checked).toBe(false);
  });

  it("changes model suggestions with the brand and clears an incompatible model", () => {
    render(<HomeExperience hero={<div />} />);
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
    render(<HomeExperience hero={<div />} />);
    fireEvent.click(screen.getByRole("radio", { name: "Audi" }));
    fireEvent.click(screen.getByRole("radio", { name: "Frenos" }));
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "A3" },
    });
    fireEvent.click(screen.getByLabelText("Abrir calendario de años"));
    fireEvent.click(screen.getByRole("button", { name: "2020" }));
    expect((screen.getByLabelText("Año") as HTMLInputElement).value).toBe(
      "2020",
    );
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
