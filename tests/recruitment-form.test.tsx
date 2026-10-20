import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RecruitmentForm } from "../src/components/recruitment-form";

afterEach(cleanup);

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Ana" },
  });
  fireEvent.change(screen.getByLabelText("Apellido"), {
    target: { value: "López" },
  });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "ana@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Teléfono"), {
    target: { value: "+503 7000 0000" },
  });
  fireEvent.change(screen.getByLabelText("Área de interés"), {
    target: { value: "ventas" },
  });
  fireEvent.change(
    screen.getByLabelText("¿Por qué quieres trabajar con nosotros?"),
    {
      target: {
        value:
          "Tengo experiencia en atención al cliente y me interesa crecer con el equipo.",
      },
    },
  );
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("recruitment form", () => {
  it("rejects files that are not PDFs", () => {
    render(<RecruitmentForm />);

    const resume = screen.getByLabelText("Adjunta tu currículum");
    const image = new File(["not-a-pdf"], "resume.png", {
      type: "image/png",
    });

    fireEvent.change(resume, { target: { files: [image] } });

    expect(screen.getByRole("alert").textContent).toBe(
      "El currículum debe ser un archivo PDF.",
    );
  });

  it("rejects PDFs larger than 5 MB", () => {
    render(<RecruitmentForm />);

    const resume = screen.getByLabelText("Adjunta tu currículum");
    const largePdf = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "cv.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(resume, { target: { files: [largePdf] } });

    expect(screen.getByRole("alert").textContent).toBe(
      "El PDF no puede pesar más de 5 MB.",
    );
  });

  it("prepares a valid application without sending it", () => {
    render(<RecruitmentForm />);
    fillRequiredFields();

    const resume = screen.getByLabelText("Adjunta tu currículum");
    const pdf = new File(["resume"], "ana-lopez.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(resume, { target: { files: [pdf] } });
    fireEvent.click(
      screen.getByRole("button", { name: "Preparar mi solicitud" }),
    );

    expect(screen.getByRole("status").textContent).toContain(
      "Tu solicitud está completa.",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "no los hemos enviado ni almacenado",
    );
  });
});
