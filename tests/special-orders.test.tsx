import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import SpecialOrdersPage from "../src/app/pedidos-especiales/page";

afterEach(cleanup);

describe("special orders page", () => {
  it("summarizes the request process and links to contact", () => {
    render(<SpecialOrdersPage />);

    expect(
      screen.getByRole("heading", { name: "Pedidos especiales." }),
    ).toBeTruthy();
    expect(screen.getByText("Compártenos los datos")).toBeTruthy();
    expect(screen.getByText("Revisamos las opciones")).toBeTruthy();
    expect(screen.getByText("Decide con confianza")).toBeTruthy();
    expect(screen.getByLabelText("10 a 15 días hábiles")).toBeTruthy();
    expect(screen.getByText("30 días hábiles")).toBeTruthy();

    expect(
      screen
        .getByRole("link", { name: "Consultar mi pedido especial" })
        .getAttribute("href"),
    ).toBe("/contacto");
  });
});
