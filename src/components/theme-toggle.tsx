"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const storageKey = "continental-theme";
const themeChangeEvent = "continental-theme-change";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getSavedTheme() {
  try {
    return window.localStorage?.getItem?.(storageKey) ?? null;
  } catch {
    return null;
  }
}

function saveTheme(theme: Theme) {
  try {
    window.localStorage?.setItem?.(storageKey, theme);
  } catch {
    // The theme still applies for this session when storage is unavailable.
  }
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";

  if (document.documentElement.dataset.theme === "dark") return "dark";
  if (document.documentElement.dataset.theme === "light") return "light";

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToTheme(onThemeChange: () => void) {
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");

  function followSystemTheme(event: MediaQueryListEvent) {
    if (getSavedTheme()) return;

    applyTheme(event.matches ? "dark" : "light");
    onThemeChange();
  }

  window.addEventListener(themeChangeEvent, onThemeChange);
  media?.addEventListener?.("change", followSystemTheme);

  return () => {
    window.removeEventListener(themeChangeEvent, onThemeChange);
    media?.removeEventListener?.("change", followSystemTheme);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light",
  );

  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextThemeLabel = nextTheme === "dark" ? "oscuro" : "claro";
  const label = `Activar modo ${nextThemeLabel}`;

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
      onClick={() => {
        applyTheme(nextTheme);
        saveTheme(nextTheme);
        window.dispatchEvent(new Event(themeChangeEvent));
      }}
    >
      <svg
        className="theme-icon theme-icon-moon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
      </svg>
      <svg
        className="theme-icon theme-icon-sun"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
