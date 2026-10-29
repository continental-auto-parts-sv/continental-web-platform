import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ContactExperience } from "../src/components/contact-experience";

afterEach(cleanup);

describe("contact information", () => {
  it("shows official channels without embedding the quote form", () => {
    render(<ContactExperience />);

    expect(screen.getByRole("heading", { name: "Hablemos." })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /7840-1749/ }).getAttribute("href"),
    ).toBe("https://wa.me/50378401749");
    expect(
      screen
        .getByTitle("Ubicación de Continental Auto Parts")
        .getAttribute("src"),
    ).toContain("13.7144028,-89.2009462");
    expect(
      screen.getByRole("link", { name: /Abrir en Maps/ }).getAttribute("href"),
    ).toContain("Fremarca,+sadecv");
    expect(screen.queryByLabelText("Marca del vehículo")).toBeNull();
  });

  it("renders direct email and phone links", () => {
    render(<ContactExperience />);

    expect(
      screen
        .getByRole("link", { name: "Contacto@fremarca.com" })
        .getAttribute("href"),
    ).toBe("mailto:Contacto@fremarca.com");
    expect(
      screen.getByRole("link", { name: /2235-1667/ }).getAttribute("href"),
    ).toBe("tel:+50322351667");
  });
});
