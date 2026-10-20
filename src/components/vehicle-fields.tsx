"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import {
  buildQuoteHref,
  getQuoteCategoryLabel,
  type QuoteItem,
} from "../lib/quote-cart";
import { BrandLogo, brands } from "./brand-marquee";

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

export type InquiryField = "brand" | "parts" | "model" | "year" | "vin";

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
  const currentYear = new Date().getFullYear() + 1;
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [decade, setDecade] = useState(Math.floor(currentYear / 12) * 12);
  const calendar = useRef<HTMLDetailsElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);
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
          data-invalid={Boolean(errors.model)}
          data-valid={validationAttempted && Boolean(model) && !errors.model}
        >
          <span className="field-label">
            <span>03</span> Modelo
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
            <span>04</span> Año
          </label>
          <div className="year-input-wrap">
            <input
              ref={yearInput}
              id="vehicle-year"
              aria-label="Año"
              aria-invalid={Boolean(errors.year)}
              aria-describedby={errors.year ? "year-error" : undefined}
              name="year"
              type="number"
              min="1950"
              max={currentYear}
              placeholder="Ej. 2020"
              required
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                onEdit();
              }}
            />
            <details
              className="year-picker"
              ref={calendar}
              onKeyDown={(event) => {
                if (event.key === "Escape" && calendar.current) {
                  calendar.current.open = false;
                  yearInput.current?.focus();
                }
              }}
            >
              <summary aria-label="Abrir calendario de años">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M7 2v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h2M7 18h2m3 0h2" />
                </svg>
              </summary>
              <div
                className="year-calendar"
                role="group"
                aria-label="Seleccionar año"
              >
                <div className="calendar-heading">
                  <button
                    type="button"
                    aria-label="Años anteriores"
                    disabled={decade <= 1950}
                    onClick={() => setDecade(decade - 12)}
                  >
                    ←
                  </button>
                  <strong>
                    {Math.max(1950, decade)}–
                    {Math.min(currentYear, decade + 11)}
                  </strong>
                  <button
                    type="button"
                    aria-label="Años siguientes"
                    disabled={decade + 12 > currentYear}
                    onClick={() => setDecade(decade + 12)}
                  >
                    →
                  </button>
                </div>
                <div className="year-grid">
                  {Array.from({ length: 12 }, (_, index) => decade + index)
                    .filter((value) => value >= 1950 && value <= currentYear)
                    .map((value) => (
                      <button
                        type="button"
                        key={value}
                        aria-pressed={year === String(value)}
                        onClick={() => {
                          setYear(String(value));
                          onEdit();
                          if (calendar.current) calendar.current.open = false;
                          yearInput.current?.focus();
                        }}
                      >
                        {value}
                      </button>
                    ))}
                </div>
              </div>
            </details>
            <span className="validation-check" aria-hidden="true" />
          </div>
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
            <span>05</span> Chasis o VIN <small>(opcional)</small>
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
