import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

describe("homepage inquiries", () => {
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
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi consulta" }),
    );
    expect(screen.getByRole("status").textContent).toContain(
      "frenos para mi Audi, modelo A3, año 2020",
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
