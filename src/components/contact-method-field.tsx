"use client";

import { useState } from "react";

import "./contact-method-field.css";

export type ContactMethod = "email" | "phone";

export function parseContactMethod(value: FormDataEntryValue | null) {
  return value === "email" ? "email" : "phone";
}

export function validateContact(method: ContactMethod, value: string) {
  if (!value) {
    return method === "email"
      ? "Escribe tu correo electrónico."
      : "Escribe tu número de contacto.";
  }

  if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Escribe un correo electrónico válido.";
  }

  if (method === "phone" && !/^[0-9+() -]{8,20}$/.test(value)) {
    return "Usa entre 8 y 20 caracteres: números, espacios, +, ( ) o guiones.";
  }

  return undefined;
}

export function ContactMethodField({
  error,
  idPrefix,
  onEdit,
  step,
  variant,
}: {
  error?: string;
  idPrefix: string;
  onEdit: () => void;
  step?: string;
  variant: "inquiry" | "special-order";
}) {
  const [method, setMethod] = useState<ContactMethod>("phone");
  const [values, setValues] = useState<Record<ContactMethod, string>>({
    email: "",
    phone: "",
  });
  const errorId = error ? `${idPrefix}-contact-error` : undefined;
  const inputId = `${idPrefix}-contact`;
  const isEmail = method === "email";

  return (
    <fieldset
      className={`contact-method-field contact-method-field-${variant}`}
      data-invalid={error ? "true" : undefined}
    >
      <div className="contact-method-input">
        <label className="contact-method-label" htmlFor={inputId}>
          {step && <span className="contact-method-step">{step}</span>}
          {isEmail ? "Correo electrónico" : "Teléfono"}
        </label>
        <span className="contact-method-input-wrap">
          <input
            aria-describedby={errorId}
            aria-invalid={Boolean(error)}
            aria-label={
              isEmail
                ? "Correo electrónico de contacto"
                : "Teléfono de contacto"
            }
            autoComplete={isEmail ? "email" : "tel"}
            id={inputId}
            inputMode={isEmail ? "email" : "tel"}
            maxLength={isEmail ? 254 : 20}
            minLength={isEmail ? undefined : 8}
            name="contact"
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                [method]: event.target.value,
              }));
              onEdit();
            }}
            pattern={isEmail ? undefined : "[0-9+() -]{8,20}"}
            placeholder={isEmail ? "nombre@correo.com" : "+503 0000 0000"}
            required
            type={isEmail ? "email" : "tel"}
            value={values[method]}
          />
          <span className="contact-method-toggle">
            <label>
              <input
                aria-label="Teléfono"
                checked={method === "phone"}
                name="contactMethod"
                onChange={() => {
                  setMethod("phone");
                  onEdit();
                }}
                type="radio"
                value="phone"
              />
              <span title="Teléfono">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M7.4 3.5 10 8.2 7.8 10a15 15 0 0 0 6.2 6.2l1.8-2.2 4.7 2.6-.7 3.1a2 2 0 0 1-2 1.5C9.5 20.4 3.6 14.5 2.8 6.2a2 2 0 0 1 1.5-2Z" />
                </svg>
              </span>
            </label>
            <label>
              <input
                aria-label="Correo"
                checked={method === "email"}
                name="contactMethod"
                onChange={() => {
                  setMethod("email");
                  onEdit();
                }}
                type="radio"
                value="email"
              />
              <span title="Correo">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
            </label>
          </span>
        </span>
      </div>

      {error && (
        <small
          className={
            variant === "special-order"
              ? "contact-method-error special-order-form-error"
              : "contact-method-error form-field-error"
          }
          id={errorId}
          role="alert"
        >
          {error}
        </small>
      )}
    </fieldset>
  );
}
