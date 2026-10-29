"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import {
  buildQuoteHref,
  getQuoteCategoryLabel,
  type QuoteItem,
} from "../lib/quote-cart";
import { BrandLogo, brands } from "./brand-marquee";
import { ContactMethodField } from "./contact-method-field";
import { VehicleYearPicker } from "./vehicle-year-picker";

const models: Record<string, string[]> = {
  Volkswagen: [
    "Golf",
    "Jetta",
    "Polo",
    "Tiguan",
    "Touareg",
    "Passat",
    "Amarok",
  ],
  Audi: ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "TT"],
  SEAT: ["Ibiza", "León", "Arona", "Ateca", "Tarraco", "Toledo"],
  Porsche: ["911", "718", "Cayenne", "Macan", "Panamera", "Taycan"],
};

export type InquiryField =
  "brand" | "parts" | "name" | "model" | "year" | "vin" | "contact";

export type InquiryErrors = Partial<Record<InquiryField, string>>;

export function VehicleFields({
  brand,
  errors,
  quoteItems,
  validationAttempted,
  onBrandChange,
  onEdit,
  onRemoveQuoteItem,
}: {
  brand: string;
  errors: InquiryErrors;
  quoteItems: QuoteItem[];
  validationAttempted: boolean;
  onBrandChange: (brand: string) => void;
  onEdit: () => void;
  onRemoveQuoteItem: (key: string) => void;
}) {
  const [contactName, setContactName] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const vinHelpDialog = useRef<HTMLDialogElement>(null);

  function openVinHelp() {
    const dialog = vinHelpDialog.current;

    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeVinHelp() {
    const dialog = vinHelpDialog.current;

    if (!dialog) return;

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  return (
    <>
      <fieldset
        className="visual-fieldset"
        data-invalid={Boolean(errors.brand)}
        data-valid={validationAttempted && Boolean(brand) && !errors.brand}
        aria-describedby={errors.brand ? "brand-error" : undefined}
      >
        <legend>
          <span>01</span> Marca
          <span className="validation-check" aria-hidden="true" />
        </legend>
        <div className="brand-options">
          {brands.map((name) => (
            <label className="choice-card" key={name}>
              <input
                type="radio"
                name="brand"
                value={name}
                required
                checked={brand === name}
                onClick={() => {
                  if (brand === name) {
                    onBrandChange("");
                    setModel("");
                    onEdit();
                  }
                }}
                onChange={() => {
                  onBrandChange(name);
                  setModel("");
                  onEdit();
                }}
              />
              <BrandLogo name={name} />
            </label>
          ))}
        </div>
        {errors.brand && (
          <p className="form-field-error" id="brand-error">
            {errors.brand}
          </p>
        )}
      </fieldset>
      <fieldset
        className="visual-fieldset quote-items-fieldset"
        data-inquiry-field="parts"
        data-invalid={Boolean(errors.parts)}
        data-valid={
          validationAttempted && quoteItems.length > 0 && !errors.parts
        }
        aria-describedby={errors.parts ? "parts-error" : undefined}
        tabIndex={-1}
      >
        <legend>
          <span>02</span> Repuestos para cotizar
          <span className="validation-check" aria-hidden="true" />
        </legend>
        {quoteItems.length > 0 ? (
          <ul className="quote-items-list">
            {quoteItems.map((item) => (
              <li key={item.key}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.lineName}</small>
                  {getQuoteCategoryLabel(item) && (
                    <small>Categoría: {getQuoteCategoryLabel(item)}</small>
                  )}
                </span>
                <button
                  type="button"
                  aria-label={`Quitar ${item.name}`}
                  onClick={() => {
                    onRemoveQuoteItem(item.key);
                    onEdit();
                  }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="quote-items-empty">
            <p>Aún no has agregado repuestos a tu cotización.</p>
            <Link href="/productos">Explorar productos</Link>
          </div>
        )}
        {quoteItems.length > 0 && (
          <Link
            className="quote-items-add"
            href={buildQuoteHref("/productos", quoteItems)}
          >
            + Agregar otro repuesto
          </Link>
        )}
        {errors.parts && (
          <p className="form-field-error" id="parts-error">
            {errors.parts}
          </p>
        )}
      </fieldset>
      <div className="form-grid vehicle-details">
        <label
          className="form-control"
          data-invalid={Boolean(errors.name)}
          data-valid={
            validationAttempted && Boolean(contactName) && !errors.name
          }
        >
          <span className="field-label">
            <span>03</span> Nombre
          </span>
          <span className="form-input-wrap">
            <input
              aria-describedby={errors.name ? "inquiry-name-error" : undefined}
              aria-invalid={Boolean(errors.name)}
              aria-label="Nombre"
              autoComplete="name"
              maxLength={120}
              name="name"
              onChange={(event) => {
                setContactName(event.target.value);
                onEdit();
              }}
              placeholder="Tu nombre completo"
              required
              type="text"
              value={contactName}
            />
            <span className="validation-check" aria-hidden="true" />
          </span>
          {errors.name && (
            <small className="form-field-error" id="inquiry-name-error">
              {errors.name}
            </small>
          )}
        </label>
        <ContactMethodField
          error={errors.contact}
          idPrefix="inquiry"
          onEdit={onEdit}
          step="04"
          variant="inquiry"
        />
        <label
          className="form-control"
          data-invalid={Boolean(errors.model)}
          data-valid={validationAttempted && Boolean(model) && !errors.model}
        >
          <span className="field-label">
            <span>05</span> Modelo
          </span>
          <span className="form-input-wrap">
            <input
              aria-label="Modelo"
              aria-invalid={Boolean(errors.model)}
              aria-describedby={errors.model ? "model-error" : undefined}
              name="model"
              list="vehicle-models"
              placeholder={
                brand
                  ? `Ej. ${models[brand]?.[0] ?? "Tu modelo"}`
                  : "Escribe tu modelo"
              }
              required
              maxLength={80}
              value={model}
              onChange={(event) => setModel(event.target.value)}
            />
            <span className="validation-check" aria-hidden="true" />
          </span>
          <datalist id="vehicle-models">
            {(models[brand] ?? []).map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
          {errors.model && (
            <small className="form-field-error" id="model-error">
              {errors.model}
            </small>
          )}
        </label>
        <div
          className="year-field form-control"
          data-invalid={Boolean(errors.year)}
          data-valid={validationAttempted && Boolean(year) && !errors.year}
        >
          <label htmlFor="vehicle-year" className="field-label">
            <span>06</span> Año
          </label>
          <VehicleYearPicker
            describedBy={errors.year ? "year-error" : undefined}
            invalid={Boolean(errors.year)}
            onChange={(nextYear) => {
              setYear(nextYear);
              onEdit();
            }}
            value={year}
          />
          {errors.year && (
            <small className="form-field-error" id="year-error">
              {errors.year}
            </small>
          )}
        </div>
        <label
          className="vehicle-identity-field form-control"
          data-invalid={Boolean(errors.vin)}
          data-valid={validationAttempted && Boolean(vin) && !errors.vin}
        >
          <span className="field-label">
            <span>07</span> Chasis o VIN <small>(opcional)</small>
          </span>
          <span className="vin-input-wrap">
            <input
              aria-label="Chasis o VIN"
              aria-invalid={Boolean(errors.vin)}
              aria-describedby={errors.vin ? "vin-error" : undefined}
              name="vin"
              type="text"
              placeholder="Ej. WVWZZZ1KZBW000001"
              maxLength={50}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              value={vin}
              onChange={(event) => setVin(event.target.value)}
            />
            <span className="validation-check" aria-hidden="true" />
            <button
              className="vin-info-button"
              type="button"
              aria-label="Más información sobre el chasis o VIN"
              aria-haspopup="dialog"
              onClick={openVinHelp}
            >
              i
            </button>
          </span>
          {errors.vin && (
            <small className="form-field-error" id="vin-error">
              {errors.vin}
            </small>
          )}
        </label>
      </div>
      <dialog
        className="vin-help-dialog"
        ref={vinHelpDialog}
        aria-labelledby="vin-help-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeVinHelp();
          }
        }}
      >
        <div className="vin-help-card">
          <button
            className="vin-help-close"
            type="button"
            aria-label="Cerrar información"
            onClick={closeVinHelp}
          >
            ×
          </button>
          <span className="vin-help-icon" aria-hidden="true">
            i
          </span>
          <h2 id="vin-help-title">¿Dónde encuentro el chasis o VIN?</h2>
          <p>
            Lo encuentras en la tarjeta de circulación o en la placa VIN del
            vehículo.
          </p>
          <button
            className="button vin-help-confirm"
            type="button"
            onClick={closeVinHelp}
          >
            Entendido
          </button>
        </div>
      </dialog>
    </>
  );
}
