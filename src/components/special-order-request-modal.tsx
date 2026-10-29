"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";

import { MAX_VEHICLE_YEAR, VehicleYearPicker } from "./vehicle-year-picker";
import {
  ContactMethodField,
  parseContactMethod,
  validateContact,
} from "./contact-method-field";

import "../app/pedidos-especiales/special-orders.css";

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const PHOTO_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"];

type PhotoState = {
  error?: string;
  names?: string[];
};

type SpecialOrderField =
  | "name"
  | "contact"
  | "brand"
  | "model"
  | "year"
  | "vin"
  | "part"
  | "description"
  | "photo";

type SpecialOrderErrors = Partial<Record<SpecialOrderField, string>>;

function validatePhotos(files: File[]): PhotoState {
  if (files.length === 0) {
    return {};
  }

  const hasUnsupportedPhoto = files.some((file) => {
    const normalizedName = file.name.toLowerCase();
    const hasSupportedExtension = PHOTO_EXTENSIONS.some((extension) =>
      normalizedName.endsWith(extension),
    );

    return !file.type.startsWith("image/") || !hasSupportedExtension;
  });

  if (hasUnsupportedPhoto) {
    return { error: "Todas las fotografías deben ser JPG, PNG o WebP." };
  }

  const hasOversizedPhoto = files.some((file) => file.size > MAX_PHOTO_SIZE);

  if (hasOversizedPhoto) {
    return { error: "Cada fotografía puede pesar como máximo 8 MB." };
  }

  return { names: files.map((file) => file.name) };
}

export function SpecialOrderRequestModal({
  autoOpen = false,
  initialPart = "",
  mode = "special-order",
  onClose,
}: {
  autoOpen?: boolean;
  initialPart?: string;
  mode?: "commercial" | "special-order";
  onClose?: () => void;
}) {
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
  const isCommercialRequest = mode === "commercial";

  useEffect(() => {
    if (!autoOpen) {
      return;
    }

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
  }, [autoOpen]);

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

    onClose?.();
  }

  function clearFeedback() {
    setFormErrors({});
    setSummary("");
    setCopied(false);
    setCopyError(false);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const nextPhotoState = validatePhotos(Array.from(event.target.files ?? []));

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
    const nextPhotoState = validatePhotos(Array.from(photoInput.files ?? []));
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contactMethod = parseContactMethod(data.get("contactMethod"));
    const contact = String(data.get("contact") ?? "").trim();
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

    const contactError = validateContact(contactMethod, contact);

    if (contactError) {
      errors.contact = contactError;
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
      errors.part = isCommercialRequest
        ? "Selecciona la categoría que necesitas."
        : "Escribe el repuesto que necesitas.";
    }

    if (!description) {
      errors.description = isCommercialRequest
        ? "Escribe el nombre del repuesto o una descripción."
        : "Describe el repuesto que necesitas.";
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

    const photoNames = nextPhotoState.names ?? [];
    const photoNote =
      photoNames.length > 0
        ? ` Fotografías seleccionadas: ${photoNames.join(", ")}; las adjuntaré manualmente.`
        : "";

    const requestIntroduction = isCommercialRequest
      ? "Quiero cotizar un repuesto de Línea Comercial"
      : "Quiero consultar un pedido especial";
    const requestDetails = isCommercialRequest
      ? `Categoría: ${part}. Repuesto o descripción: ${description}.`
      : `Repuesto: ${part}. Descripción: ${description}.`;
    const contactPreference =
      contactMethod === "email"
        ? `Mi correo de contacto es ${contact}.`
        : `Mi número de contacto es ${contact}.`;

    setSummary(
      `Hola, soy ${name}. ${requestIntroduction} para un ${brand} ${model}, año ${year}, VIN o chasis ${vin}. ${requestDetails} ${contactPreference}${photoNote}`,
    );
    setCopied(false);
    setCopyError(false);
  }

  return (
    <>
      {!autoOpen && (
        <button
          className="button special-order-open"
          type="button"
          aria-haspopup="dialog"
          onClick={openDialog}
        >
          Consultar mi pedido especial <span aria-hidden="true">↗</span>
        </button>
      )}

      <dialog
        className="special-order-dialog"
        ref={dialogRef}
        aria-labelledby="special-order-dialog-title"
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClick={handleBackdropClick}
      >
        <div className="special-order-dialog-card" ref={dialogCardRef}>
          <header className="special-order-dialog-header">
            <div>
              {isCommercialRequest && (
                <div
                  className="special-order-commercial-brand"
                  role="img"
                  aria-label="Línea Comercial"
                >
                  <Image
                    className="special-order-commercial-logo special-order-commercial-logo-light"
                    src="/images/brands/cap-linea-comercial.png"
                    alt=""
                    width={1537}
                    height={516}
                    sizes="(max-width: 640px) 210px, 280px"
                  />
                  <Image
                    className="special-order-commercial-logo special-order-commercial-logo-dark"
                    src="/images/brands/cap-linea-comercial-dark.png"
                    alt=""
                    width={1537}
                    height={516}
                    sizes="(max-width: 640px) 210px, 280px"
                  />
                </div>
              )}
              <h2 id="special-order-dialog-title">
                {isCommercialRequest
                  ? "Cotización de Línea Comercial."
                  : "Cuéntanos qué repuesto necesitas."}
              </h2>
              <p>
                {isCommercialRequest
                  ? "Completa los datos para que nuestro equipo pueda cotizar la categoría seleccionada."
                  : "Completa los datos para que nuestro equipo pueda revisar las opciones disponibles."}
              </p>
            </div>
            <button
              className="special-order-dialog-close"
              type="button"
              aria-label={
                isCommercialRequest
                  ? "Cerrar formulario de Línea Comercial"
                  : "Cerrar formulario de pedido especial"
              }
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

              <ContactMethodField
                error={formErrors.contact}
                idPrefix="special-order"
                onEdit={clearFeedback}
                variant="special-order"
              />

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
                <span>{isCommercialRequest ? "Categoría" : "Repuesto"}</span>
                <input
                  aria-label={isCommercialRequest ? "Categoría" : "Repuesto"}
                  aria-describedby={
                    formErrors.part ? "special-order-part-error" : undefined
                  }
                  aria-invalid={Boolean(formErrors.part)}
                  autoComplete="off"
                  maxLength={140}
                  name="part"
                  defaultValue={initialPart}
                  placeholder={
                    isCommercialRequest
                      ? "Categoría seleccionada"
                      : "Escribe el nombre del repuesto"
                  }
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
                  placeholder={
                    isCommercialRequest
                      ? "Escribe el nombre del repuesto o una descripción que nos ayude a identificarlo."
                      : "Describe la pieza, sus características o cualquier detalle que nos ayude a identificarla."
                  }
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
                  aria-label="Fotografías del repuesto, opcionales"
                  multiple
                  name="photo"
                  onChange={handlePhotoChange}
                  type="file"
                />
                <span className="special-order-upload-icon" aria-hidden="true">
                  ↑
                </span>
                <span className="special-order-upload-copy">
                  <strong>
                    {photoState.names?.length === 1
                      ? photoState.names[0]
                      : photoState.names?.length
                        ? `${photoState.names.length} fotografías seleccionadas`
                        : "Fotografías del repuesto"}
                  </strong>
                  <small id="special-order-photo-guidance">
                    Opcional · varios ángulos · JPG, PNG o WebP · máximo 8 MB
                    cada una
                  </small>
                </span>
                <span className="special-order-upload-action">
                  Seleccionar imágenes
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
                {photoState.names && photoState.names.length > 0 && (
                  <small>
                    Recuerda adjuntar las fotografías manualmente al enviar el
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
