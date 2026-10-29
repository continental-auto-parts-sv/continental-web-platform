import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import SpecialOrdersPage from "../src/app/pedidos-especiales/page";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("special orders page", () => {
  it("summarizes the request process and opens its dedicated form", () => {
    render(<SpecialOrdersPage />);

    expect(
      screen.getByRole("heading", { name: "Pedidos especiales." }),
    ).toBeTruthy();
    expect(screen.getByText("Compártenos los datos")).toBeTruthy();
    expect(screen.getByText(/VIN o número de chasis/)).toBeTruthy();
    expect(screen.getByText("Revisamos las opciones")).toBeTruthy();
    expect(screen.getByText("Decide con confianza")).toBeTruthy();
    expect(screen.queryByText("¿Cuánto tarda en llegar?")).toBeNull();
    expect(
      screen.getByRole("heading", {
        name: "No hay pedido pequeño si es importante para ti.",
      }),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Consultar mi pedido especial" }),
    );

    const dialog = screen.getByRole("dialog");

    expect(dialog.hasAttribute("open")).toBe(true);
    expect(screen.queryByText("Pedido especial")).toBeNull();
    expect(screen.getByLabelText("Marca")).toBeTruthy();
    expect(screen.getByLabelText("Repuesto")).toBeTruthy();
    expect(screen.getByLabelText("Descripción")).toBeTruthy();
    expect(
      screen.getByLabelText("Fotografías del repuesto, opcionales"),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("VIN o chasis").getAttribute("placeholder"),
    ).toBe("Ej. WVWZZZ1KZBW000001");
    expect(screen.getByLabelText("Modelo")).toBeTruthy();
    expect(screen.getByLabelText("Año")).toBeTruthy();
    expect(screen.getByLabelText("Teléfono de contacto")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Teléfono" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Correo" })).toBeTruthy();
    expect(screen.getByLabelText("Nombre")).toBeTruthy();

    const yearInput = screen.getByLabelText("Año");
    const yearPicker = screen
      .getByLabelText("Abrir calendario de años")
      .closest("details");

    fireEvent.focus(yearInput);

    expect(yearPicker?.hasAttribute("open")).toBe(true);
    fireEvent.pointerDown(screen.getByLabelText("Nombre"));

    expect(yearPicker?.hasAttribute("open")).toBe(false);
    fireEvent.click(screen.getByLabelText("Abrir calendario de años"));

    expect(yearPicker?.hasAttribute("open")).toBe(true);
    fireEvent.click(
      screen.getByRole("button", {
        name: String(new Date().getFullYear() + 1),
      }),
    );

    expect((yearInput as HTMLInputElement).value).toBe(
      String(new Date().getFullYear() + 1),
    );
    expect(yearPicker?.hasAttribute("open")).toBe(false);
  });

  it("prepares a special-order inquiry independently from the quote form", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "50370000000");
    render(<SpecialOrdersPage />);

    fireEvent.click(
      screen.getByRole("button", { name: "Consultar mi pedido especial" }),
    );
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana López" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Correo" }));
    fireEvent.change(screen.getByLabelText("Correo electrónico de contacto"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Marca"), {
      target: { value: "Volkswagen" },
    });
    fireEvent.change(screen.getByLabelText("Modelo"), {
      target: { value: "Golf GTI" },
    });
    fireEvent.change(screen.getByLabelText("Año"), {
      target: { value: "2020" },
    });
    fireEvent.change(screen.getByLabelText("VIN o chasis"), {
      target: { value: "wauzzz1kzaw000001" },
    });
    fireEvent.change(screen.getByLabelText("Repuesto"), {
      target: { value: "Módulo ABS" },
    });
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "Necesito el módulo completo con su bomba." },
    });
    const frontPhoto = new File(["front"], "frente.jpg", {
      type: "image/jpeg",
    });
    const sidePhoto = new File(["side"], "lateral.png", {
      type: "image/png",
    });

    fireEvent.change(
      screen.getByLabelText("Fotografías del repuesto, opcionales"),
      {
        target: { files: [frontPhoto, sidePhoto] },
      },
    );

    expect(screen.getByText("2 fotografías seleccionadas")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Preparar consulta" }));

    const whatsappLink = screen.getByRole("link", {
      name: /Continuar en WhatsApp/,
    });
    const url = new URL(whatsappLink.getAttribute("href")!);
    const message = url.searchParams.get("text");

    expect(url.pathname).toBe("/50370000000");
    expect(message).toContain("Ana López");
    expect(message).toContain("Volkswagen Golf GTI, año 2020");
    expect(message).toContain("VIN o chasis WAUZZZ1KZAW000001");
    expect(message).toContain("Repuesto: Módulo ABS");
    expect(message).toContain("Mi correo de contacto es ana@example.com.");
    expect(message).toContain("frente.jpg, lateral.png");
  });

  it("shows application validation instead of browser validation", async () => {
    render(<SpecialOrdersPage />);

    fireEvent.click(
      screen.getByRole("button", { name: "Consultar mi pedido especial" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Preparar consulta" }));

    const nameInput = screen.getByLabelText("Nombre");

    expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Escribe tu nombre.")).toBeTruthy();
    expect(screen.getByText("Escribe tu número de contacto.")).toBeTruthy();
    expect(screen.getByText("Escribe la marca de tu vehículo.")).toBeTruthy();
    expect(screen.getByText("Escribe el modelo de tu vehículo.")).toBeTruthy();
    expect(screen.getByText("Ingresa el año de tu vehículo.")).toBeTruthy();
    expect(screen.getByText("Ingresa el VIN o número de chasis.")).toBeTruthy();
    expect(screen.getByText("Escribe el repuesto que necesitas.")).toBeTruthy();
    expect(
      screen.getByText("Describe el repuesto que necesitas."),
    ).toBeTruthy();

    await waitFor(() => {
      expect(document.activeElement).toBe(nameInput);
    });
  });
});
