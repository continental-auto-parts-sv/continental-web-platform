"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type FileState = {
  error?: string;
  name?: string;
};

function validateResume(file: File | undefined): FileState {
  if (!file) {
    return { error: "Adjunta tu currículum en formato PDF." };
  }

  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");

  if (file.type !== "application/pdf" || !hasPdfExtension) {
    return { error: "El currículum debe ser un archivo PDF." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "El PDF no puede pesar más de 5 MB." };
  }

  return { name: file.name };
}

export function RecruitmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileState, setFileState] = useState<FileState>({});
  const [isPrepared, setIsPrepared] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextState = validateResume(event.target.files?.[0]);

    setFileState(nextState);
    setIsPrepared(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("resume") as HTMLInputElement;
    const nextState = validateResume(input.files?.[0]);

    setFileState(nextState);

    if (nextState.error) {
      input.focus();
      setIsPrepared(false);
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      setIsPrepared(false);
      return;
    }

    setIsPrepared(true);
  }

  return (
    <form
      className="careers-form"
      ref={formRef}
      onChange={() => setIsPrepared(false)}
      onSubmit={handleSubmit}
    >
      <div className="careers-form-heading">
        <div>
          <span>Solicitud de empleo</span>
          <h2>Queremos conocerte.</h2>
        </div>
        <small>Todos los campos son obligatorios.</small>
      </div>

      <div className="careers-form-grid">
        <label>
          <span>Nombre</span>
          <input
            autoComplete="given-name"
            maxLength={60}
            name="firstName"
            placeholder="Tu nombre"
            required
            type="text"
          />
        </label>

        <label>
          <span>Apellido</span>
          <input
            autoComplete="family-name"
            maxLength={60}
            name="lastName"
            placeholder="Tu apellido"
            required
            type="text"
          />
        </label>

        <label>
          <span>Correo electrónico</span>
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            placeholder="nombre@correo.com"
            required
            type="email"
          />
        </label>

        <label>
          <span>Teléfono</span>
          <input
            autoComplete="tel"
            inputMode="tel"
            maxLength={20}
            minLength={8}
            name="phone"
            pattern="[0-9+() -]{8,20}"
            placeholder="+503 0000 0000"
            required
            type="tel"
          />
        </label>

        <label className="careers-field-full">
          <span>Área de interés</span>
          <select defaultValue="" name="area" required>
            <option disabled value="">
              Seleccione
            </option>
            <option value="auxiliar-bodega">Auxiliar de bodega</option>
            <option value="auxiliar-bodega-automotriz">
              Auxiliar de bodega automotriz
            </option>
            <option value="cajera">Cajera</option>
            <option value="encargada-limpieza">Encargada de limpieza</option>
            <option value="motociclista">Motociclista</option>
            <option value="otros">Otros</option>
            <option value="promotora-ventas">Promotora de ventas</option>
            <option value="sub-gerente">Sub Gerente</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </label>

        <label className="careers-field-full">
          <span>¿Por qué quieres trabajar con nosotros?</span>
          <textarea
            aria-label="¿Por qué quieres trabajar con nosotros?"
            maxLength={800}
            minLength={40}
            name="motivation"
            placeholder="Cuéntanos brevemente sobre tu experiencia y motivación."
            required
            rows={6}
          />
          <small>Entre 40 y 800 caracteres.</small>
        </label>

        <label
          className="careers-upload careers-field-full"
          data-invalid={fileState.error ? "true" : undefined}
        >
          <input
            accept="application/pdf,.pdf"
            aria-label="Adjunta tu currículum"
            aria-describedby="resume-guidance resume-error"
            aria-invalid={fileState.error ? "true" : undefined}
            aria-required="true"
            name="resume"
            onChange={handleFileChange}
            type="file"
          />
          <span className="careers-upload-icon" aria-hidden="true">
            ↑
          </span>
          <span className="careers-upload-copy">
            <strong>{fileState.name ?? "Adjunta tu currículum"}</strong>
            <small id="resume-guidance">PDF · máximo 5 MB</small>
          </span>
          <span className="careers-upload-action">Seleccionar archivo</span>
        </label>

        {fileState.error && (
          <p className="careers-form-error" id="resume-error" role="alert">
            {fileState.error}
          </p>
        )}
      </div>

      <label className="careers-consent">
        <input name="consent" required type="checkbox" />
        <span>
          Confirmo que la información es correcta y autorizo su uso para
          procesos de selección de Continental Auto Parts.
        </span>
      </label>

      <button className="button careers-submit" type="submit">
        Preparar mi solicitud <span aria-hidden="true">↗</span>
      </button>

      <p className="careers-integration-note">
        En esta etapa tus datos no se envían ni se almacenan. El envío se
        habilitará cuando integremos el servicio de correo.
      </p>

      {isPrepared && (
        <div className="careers-form-status" role="status">
          <strong>Tu solicitud está completa.</strong>
          <p>
            El formulario pasó todas las validaciones. Conservamos tus datos en
            pantalla, pero todavía no los hemos enviado ni almacenado.
          </p>
        </div>
      )}
    </form>
  );
}
