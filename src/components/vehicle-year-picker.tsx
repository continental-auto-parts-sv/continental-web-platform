"use client";

import { useEffect, useRef, useState } from "react";

export const MAX_VEHICLE_YEAR = new Date().getFullYear() + 1;

type VehicleYearPickerProps = {
  describedBy?: string;
  id?: string;
  invalid?: boolean;
  name?: string;
  onChange: (year: string) => void;
  value: string;
};

export function VehicleYearPicker({
  describedBy,
  id = "vehicle-year",
  invalid = false,
  name = "year",
  onChange,
  value,
}: VehicleYearPickerProps) {
  const field = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDetailsElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const suppressNextFocusOpen = useRef(false);
  const [yearPage, setYearPage] = useState(
    Math.floor(MAX_VEHICLE_YEAR / 12) * 12,
  );

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        !picker.current?.open ||
        field.current?.contains(event.target as Node)
      ) {
        return;
      }

      picker.current.open = false;
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function closePicker() {
    if (picker.current) {
      picker.current.open = false;
    }

    suppressNextFocusOpen.current = true;
    input.current?.focus();
    queueMicrotask(() => {
      suppressNextFocusOpen.current = false;
    });
  }

  function openPicker() {
    if (picker.current) {
      picker.current.open = true;
    }
  }

  return (
    <div className="year-input-wrap" ref={field}>
      <input
        ref={input}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-label="Año"
        id={id}
        inputMode="numeric"
        max={MAX_VEHICLE_YEAR}
        min="1950"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        onClick={openPicker}
        onFocus={() => {
          if (suppressNextFocusOpen.current) {
            return;
          }

          openPicker();
        }}
        placeholder="Ej. 2020"
        required
        type="number"
        value={value}
      />
      <details
        className="year-picker"
        ref={picker}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closePicker();
          }
        }}
      >
        <summary aria-label="Abrir calendario de años">
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
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
              aria-label="Años anteriores"
              disabled={yearPage <= 1950}
              onClick={() => setYearPage(yearPage - 12)}
              type="button"
            >
              ←
            </button>
            <strong>
              {Math.max(1950, yearPage)}–
              {Math.min(MAX_VEHICLE_YEAR, yearPage + 11)}
            </strong>
            <button
              aria-label="Años siguientes"
              disabled={yearPage + 12 > MAX_VEHICLE_YEAR}
              onClick={() => setYearPage(yearPage + 12)}
              type="button"
            >
              →
            </button>
          </div>
          <div className="year-grid">
            {Array.from({ length: 12 }, (_, index) => yearPage + index)
              .filter((year) => year >= 1950 && year <= MAX_VEHICLE_YEAR)
              .map((year) => (
                <button
                  aria-pressed={value === String(year)}
                  key={year}
                  onClick={() => {
                    onChange(String(year));
                    closePicker();
                  }}
                  type="button"
                >
                  {year}
                </button>
              ))}
          </div>
        </div>
      </details>
      <span className="validation-check" aria-hidden="true" />
    </div>
  );
}
