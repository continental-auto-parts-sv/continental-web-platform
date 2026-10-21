"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";

import { MAX_VEHICLE_YEAR, VehicleYearPicker } from "./vehicle-year-picker";

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const PHOTO_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"];

type PhotoState = {
  error?: string;
  name?: string;
};

type SpecialOrderField =
  | "name"
  | "phone"
  | "brand"
  | "model"
  | "year"
  | "vin"
  | "part"
  | "description"
  | "photo";

type SpecialOrderErrors = Partial<Record<SpecialOrderField, string>>;

function validatePhoto(file: File | undefined): PhotoState {
  if (!file) {
    return {};
  }

  const normalizedName = file.name.toLowerCase();
  const hasSupportedExtension = PHOTO_EXTENSIONS.some((extension) =>
    normalizedName.endsWith(extension),
  );

  if (!file.type.startsWith("image/") || !hasSupportedExtension) {
    return { error: "La fotografía debe ser JPG, PNG o WebP." };
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return { error: "La fotografía no puede pesar más de 8 MB." };
  }

  return { name: file.name };
}

export function SpecialOrderRequestModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogCardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [photoState, setPhotoState] = useState<PhotoState>({});
  const [year, setYear] = useState("");
  const [formErrors, setFormErrors] = useState<SpecialOrderErrors>({});
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

  function openDialog() {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    firstInputRef.current?.focus({ preventScroll: true });

    if (dialogCardRef.current) {
      dialogCardRef.current.scrollTop = 0;
    }
  }

  function closeDialog() {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function clearFeedback() {
    setFormErrors({});
    setSummary("");
    setCopied(false);
    setCopyError(false);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const nextPhotoState = validatePhoto(event.target.files?.[0]);

    setPhotoState(nextPhotoState);
    setFormErrors(nextPhotoState.error ? { photo: nextPhotoState.error } : {});
    setSummary("");
    setCopied(false);
    setCopyError(false);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const photoInput = form.elements.namedItem("photo") as HTMLInputElement;
    const nextPhotoState = validatePhoto(photoInput.files?.[0]);
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const brand = String(data.get("brand") ?? "").trim();
    const model = String(data.get("model") ?? "").trim();
    const year = String(data.get("year") ?? "").trim();
    const vin = String(data.get("vin") ?? "")
      .trim()
      .toUpperCase();
    const part = String(data.get("part") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const numericYear = Number(year);
    const errors: SpecialOrderErrors = {};

    if (!name) {
      errors.name = "Escribe tu nombre.";
    }

    if (!phone) {
      errors.phone = "Escribe tu número de contacto.";
    } else if (!/^[0-9+() -]{8,20}$/.test(phone)) {
      errors.phone =
        "Usa entre 8 y 20 caracteres: números, espacios, +, ( ) o guiones.";
    }

    if (!brand) {
      errors.brand = "Escribe la marca de tu vehículo.";
    }

    if (!model) {
      errors.model = "Escribe el modelo de tu vehículo.";
    }

    if (!year) {
      errors.year = "Ingresa el año de tu vehículo.";
    } else if (
      !Number.isInteger(numericYear) ||
      numericYear < 1950 ||
      numericYear > MAX_VEHICLE_YEAR
    ) {
      errors.year = `Ingresa un año entre 1950 y ${MAX_VEHICLE_YEAR}.`;
    }

    if (!vin) {
      errors.vin = "Ingresa el VIN o número de chasis.";
    } else if (vin.length < 5 || !/^[A-Z0-9 -]+$/.test(vin)) {
      errors.vin =
        "Usa al menos 5 caracteres: letras, números, espacios o guiones.";
    }

    if (!part) {
      errors.part = "Escribe el repuesto que necesitas.";
    }

    if (!description) {
      errors.description = "Describe el repuesto que necesitas.";
    } else if (description.length < 10) {
      errors.description = "La descripción debe tener al menos 10 caracteres.";
    }

    if (nextPhotoState.error) {
      errors.photo = nextPhotoState.error;
    }

    setPhotoState(nextPhotoState);
    setFormErrors(errors);

    const firstError = Object.keys(errors)[0] as SpecialOrderField | undefined;

    if (firstError) {
      setSummary("");
      requestAnimationFrame(() => {
        const invalidField = form.elements.namedItem(firstError);

        if (invalidField instanceof HTMLElement) {
          invalidField.focus();
        }
      });
      return;
    }

    const photoNote = nextPhotoState.name
      ? ` Fotografía seleccionada: ${nextPhotoState.name}; la adjuntaré manualmente.`
      : "";

    setSummary(
      `Hola, soy ${name}. Quiero consultar un pedido especial para un ${brand} ${model}, año ${year}, VIN o chasis ${vin}. Repuesto: ${part}. Descripción: ${description}. Mi número de contacto es ${phone}.${photoNote}`,
    );
    setCopied(false);
    setCopyError(false);
  }

  return (
    <>
      <button
        className="button special-order-open"
        type="button"
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        Consultar mi pedido especial <span aria-hidden="true">↗</span>
      </button>

      <dialog
        className="special-order-dialog"
        ref={dialogRef}
        aria-labelledby="special-order-dialog-title"
        aria-modal="true"
        onCancel={closeDialog}
        onClick={handleBackdropClick}
      >
        <div className="special-order-dialog-card" ref={dialogCardRef}>
          <header className="special-order-dialog-header">
            <div>
              <h2 id="special-order-dialog-title">
                Cuéntanos qué repuesto necesitas.
              </h2>
              <p>
                Completa los datos para que nuestro equipo pueda revisar las
                opciones disponibles.
              </p>
            </div>
            <button
              className="special-order-dialog-close"
              type="button"
              aria-label="Cerrar formulario de pedido especial"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <form
            className="special-order-form"
            noValidate
            onChange={(event) => {
              if (event.target.getAttribute("name") !== "photo") {
                clearFeedback();
              }
            }}
            onSubmit={handleSubmit}
          >
            <p className="special-order-required-note">
              Todos los campos son obligatorios, excepto la fotografía.
            </p>

            <div className="special-order-form-grid">
              <label data-invalid={formErrors.name ? "true" : undefined}>
                <span>Nombre</span>
                <input
                  aria-label="Nombre"
                  aria-describedby={
                    formErrors.name ? "special-order-name-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.name)}
                  ref={firstInputRef}
                  autoComplete="name"
                  maxLength={120}
                  name="name"
                  placeholder="Tu nombre completo"
                  required
                  type="text"
                />
                {formErrors.name && (
                  <small
                    className="special-order-form-error"
                    id="special-order-name-error"
                    role="alert"
                  >
                    {formErrors.name}
                  </small>
                )}
              </label>

              <label data-invalid={formErrors.phone ? "true" : undefined}>
                <span>Número de contacto</span>
                <input
                  aria-label="Número de contacto"
                  aria-describedby={
                    formErrors.phone ? "special-order-phone-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.phone)}
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
                {formErrors.phone && (
                  <small
                    className="special-order-form-error"
                    id="special-order-phone-error"
                    role="alert"
                  >
                    {formErrors.phone}
                  </small>
                )}
              </label>

              <label data-invalid={formErrors.brand ? "true" : undefined}>
                <span>Marca</span>
                <input
                  aria-label="Marca"
                  aria-describedby={
                    formErrors.brand ? "special-order-brand-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.brand)}
                  autoComplete="off"
                  maxLength={80}
                  name="brand"
                  placeholder="Ej. Volkswagen"
                  required
                  type="text"
                />
                {formErrors.brand && (
                  <small
                    className="special-order-form-error"
                    id="special-order-brand-error"
                    role="alert"
                  >
                    {formErrors.brand}
                  </small>
                )}
              </label>

              <label data-invalid={formErrors.model ? "true" : undefined}>
                <span>Modelo</span>
                <input
                  aria-label="Modelo"
                  aria-describedby={
                    formErrors.model ? "special-order-model-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.model)}
                  autoComplete="off"
                  maxLength={100}
                  name="model"
                  placeholder="Ej. Golf GTI"
                  required
                  type="text"
                />
                {formErrors.model && (
                  <small
                    className="special-order-form-error"
                    id="special-order-model-error"
                    role="alert"
                  >
                    {formErrors.model}
                  </small>
                )}
              </label>

              <div
                className="special-order-year-field year-field form-control"
                data-invalid={formErrors.year ? "true" : undefined}
              >
                <label htmlFor="special-order-year">Año</label>
                <VehicleYearPicker
                  describedBy={
                    formErrors.year ? "special-order-year-error" : undefined
                  }
                  id="special-order-year"
                  invalid={Boolean(formErrors.year)}
                  onChange={(nextYear) => {
                    setYear(nextYear);
                    clearFeedback();
                  }}
                  value={year}
                />
                {formErrors.year && (
                  <small
                    className="special-order-form-error"
                    id="special-order-year-error"
                    role="alert"
                  >
                    {formErrors.year}
                  </small>
                )}
              </div>

              <label data-invalid={formErrors.vin ? "true" : undefined}>
                <span>VIN o chasis</span>
                <input
                  aria-label="VIN o chasis"
                  aria-describedby={
                    formErrors.vin ? "special-order-vin-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.vin)}
                  autoComplete="off"
                  maxLength={40}
                  name="vin"
                  placeholder="Ej. WVWZZZ1KZBW000001"
                  required
                  type="text"
                />
                {formErrors.vin && (
                  <small
                    className="special-order-form-error"
                    id="special-order-vin-error"
                    role="alert"
                  >
                    {formErrors.vin}
                  </small>
                )}
              </label>

              <label
                className="special-order-field-full"
                data-invalid={formErrors.part ? "true" : undefined}
              >
                <span>Repuesto</span>
                <input
                  aria-label="Repuesto"
                  aria-describedby={
                    formErrors.part ? "special-order-part-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.part)}
                  autoComplete="off"
                  maxLength={140}
                  name="part"
                  placeholder="Escribe el nombre del repuesto"
                  required
                  type="text"
                />
                {formErrors.part && (
                  <small
                    className="special-order-form-error"
                    id="special-order-part-error"
                    role="alert"
                  >
                    {formErrors.part}
                  </small>
                )}
              </label>

              <label
                className="special-order-field-full"
                data-invalid={formErrors.description ? "true" : undefined}
              >
                <span>Descripción</span>
                <textarea
                  aria-label="Descripción"
                  aria-describedby={
                    formErrors.description
                      ? "special-order-description-error"
                      : undefined
                  }
                  aria-invalid={Boolean(formErrors.description)}
                  maxLength={1200}
                  minLength={10}
                  name="description"
                  placeholder="Describe la pieza, sus características o cualquier detalle que nos ayude a identificarla."
                  required
                  rows={4}
                />
                {formErrors.description && (
                  <small
                    className="special-order-form-error"
                    id="special-order-description-error"
                    role="alert"
                  >
                    {formErrors.description}
                  </small>
                )}
              </label>

              <label
                className="special-order-upload special-order-field-full"
                data-invalid={formErrors.photo ? "true" : undefined}
              >
                <input
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  aria-describedby={
                    formErrors.photo
                      ? "special-order-photo-guidance special-order-photo-error"
                      : "special-order-photo-guidance"
                  }
                  aria-invalid={Boolean(formErrors.photo)}
                  aria-label="Fotografía del repuesto, opcional"
                  name="photo"
                  onChange={handlePhotoChange}
                  type="file"
                />
                <span className="special-order-upload-icon" aria-hidden="true">
                  ↑
                </span>
                <span className="special-order-upload-copy">
                  <strong>
                    {photoState.name ?? "Fotografía del repuesto"}
                  </strong>
                  <small id="special-order-photo-guidance">
                    Opcional · JPG, PNG o WebP · máximo 8 MB
                  </small>
                </span>
                <span className="special-order-upload-action">
                  Seleccionar imagen
                </span>
              </label>

              {formErrors.photo && (
                <p
                  className="special-order-form-error special-order-photo-error"
                  id="special-order-photo-error"
                  role="alert"
                >
                  {formErrors.photo}
                </p>
              )}
            </div>

            <div className="special-order-form-actions">
              <button
                className="special-order-cancel"
                type="button"
                onClick={closeDialog}
              >
                Cancelar
              </button>
              <button className="button special-order-submit" type="submit">
                Preparar consulta <span aria-hidden="true">↗</span>
              </button>
            </div>

            {summary && (
              <div className="special-order-form-status" role="status">
                <strong>Tu consulta está lista.</strong>
                <p>
                  Revisa el mensaje y continúa para compartirlo con nuestro
                  equipo.
                </p>
                {whatsapp ? (
                  <a
                    className="text-link"
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(summary)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Continuar en WhatsApp <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <>
                    <button
                      className="text-link"
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(summary);
                          setCopied(true);
                          setCopyError(false);
                        } catch {
                          setCopied(false);
                          setCopyError(true);
                        }
                      }}
                    >
                      {copied ? "Consulta copiada ✓" : "Copiar consulta"}
                    </button>
                    {copyError && (
                      <small>
                        No se pudo copiar. Selecciona y copia el texto
                        manualmente.
                      </small>
                    )}
                    <small>
                      El contacto directo estará disponible próximamente.
                    </small>
                  </>
                )}
                {photoState.name && (
                  <small>
                    Recuerda adjuntar la fotografía manualmente al enviar el
                    mensaje.
                  </small>
                )}
              </div>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
}
