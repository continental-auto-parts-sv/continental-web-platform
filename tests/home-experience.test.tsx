import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HomeExperience } from "../src/components/home-experience";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
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
