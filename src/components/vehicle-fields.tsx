"use client";

import { useRef, useState } from "react";

import { BrandLogo, brands } from "./brand-marquee";
import { PartIcon } from "./part-icon";

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

const parts = [
  ["Motor", "engine"],
  ["Frenos", "brake"],
  ["Suspensión", "spring"],
  ["Filtros", "filter"],
  ["Lubricantes", "oil"],
  ["Otro repuesto", "engine"],
];

export function VehicleFields({
  brand,
  category,
  onBrandChange,
  onCategoryChange,
  onEdit,
}: {
  brand: string;
  category: string;
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onEdit: () => void;
}) {
  const currentYear = new Date().getFullYear() + 1;
  const [year, setYear] = useState("");
  const [decade, setDecade] = useState(Math.floor(currentYear / 12) * 12);
  const calendar = useRef<HTMLDetailsElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <fieldset className="visual-fieldset">
        <legend>
          <span>01</span> Marca
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
                onChange={() => {
                  onBrandChange(name);
                  onEdit();
                }}
              />
              <BrandLogo name={name} />
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="visual-fieldset">
        <legend>
          <span>02</span> Repuesto
        </legend>
        <div className="part-options">
          {parts.map(([name, icon]) => (
            <label className="choice-card part-choice" key={name}>
              <input
                type="radio"
                name="category"
                value={name}
                required
                checked={category === name}
                onChange={() => {
                  onCategoryChange(name);
                  onEdit();
                }}
              />
              <PartIcon kind={icon} />
              <span>{name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid vehicle-details">
        <label>
          <span className="field-label">
            <span>03</span> Modelo
          </span>
          <input
            key={brand}
            aria-label="Modelo"
            name="model"
            list="vehicle-models"
            placeholder={
              brand
                ? `Ej. ${models[brand]?.[0] ?? "Tu modelo"}`
                : "Escribe tu modelo"
            }
            required
            maxLength={80}
          />
          <datalist id="vehicle-models">
            {(models[brand] ?? []).map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
          <small>Elige una sugerencia o escribe el tuyo.</small>
        </label>
        <div className="year-field">
          <label htmlFor="vehicle-year" className="field-label">
            <span>04</span> Año
          </label>
          <div className="year-input-wrap">
            <input
              ref={yearInput}
              id="vehicle-year"
              aria-label="Año"
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
          </div>
        </div>
      </div>
    </>
  );
}
