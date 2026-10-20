import { useEffect, useState } from "react";

export const quoteCartStorageKey = "continental-quote-items";
export const quoteCartQueryKey = "cotizacion";

export type QuoteItem = {
  artwork?: string;
  categoryPath?: string[];
  key: string;
  id: string;
  name: string;
  lineId: string;
  lineName: string;
};

const emptyQuoteItems: QuoteItem[] = [];
const quoteListeners = new Set<() => void>();

function readLocalStorageValue() {
  if (typeof window === "undefined") return null;

  try {
    const storage = window.localStorage;

    return typeof storage?.getItem === "function"
      ? storage.getItem(quoteCartStorageKey)
      : null;
  } catch {
    return null;
  }
}

function readQueryValue() {
  if (typeof window === "undefined") return null;

  return new URLSearchParams(window.location.search).get(quoteCartQueryKey);
}

export function buildQuoteHref(path: string, items: QuoteItem[]) {
  if (items.length === 0) return path;

  const parameters = new URLSearchParams();

  parameters.set(quoteCartQueryKey, JSON.stringify(items));

  return `${path}?${parameters.toString()}`;
}

function isQuoteItem(value: unknown): value is QuoteItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.key === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.lineId === "string" &&
    typeof item.lineName === "string" &&
    (typeof item.categoryPath === "undefined" ||
      (Array.isArray(item.categoryPath) &&
        item.categoryPath.every(
          (category) => typeof category === "string" && category.length > 0,
        ))) &&
    (typeof item.artwork === "undefined" || typeof item.artwork === "string")
  );
}

export function getQuoteCategoryLabel(item: QuoteItem) {
  return item.categoryPath?.join(" / ") ?? "";
}

export function parseQuoteItems(value: string | null): QuoteItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? parsed.filter(isQuoteItem) : [];
  } catch {
    return [];
  }
}

export function readQuoteItems(): QuoteItem[] {
  if (typeof window === "undefined") return emptyQuoteItems;

  const storedValue = readQueryValue() ?? readLocalStorageValue();

  return parseQuoteItems(storedValue);
}

export function writeQuoteItems(items: QuoteItem[]) {
  if (typeof window === "undefined") return;

  const storedValue = JSON.stringify(items);
  let savedLocally = false;

  try {
    if (typeof window.localStorage?.setItem === "function") {
      window.localStorage.setItem(quoteCartStorageKey, storedValue);
      savedLocally = true;
    }
  } catch {
    savedLocally = false;
  }

  const currentUrl = new URL(window.location.href);
  const shouldUpdateUrl =
    !savedLocally || currentUrl.searchParams.has(quoteCartQueryKey);

  if (shouldUpdateUrl && typeof window.history?.replaceState === "function") {
    if (items.length > 0) {
      currentUrl.searchParams.set(quoteCartQueryKey, storedValue);
    } else {
      currentUrl.searchParams.delete(quoteCartQueryKey);
    }

    window.history.replaceState(
      null,
      "",
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );
  }

  quoteListeners.forEach((listener) => listener());
}

export function addQuoteItem(items: QuoteItem[], item: QuoteItem) {
  return items.some((currentItem) => currentItem.key === item.key)
    ? items
    : [...items, item];
}

function subscribeToQuoteItems(listener: () => void) {
  quoteListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === quoteCartStorageKey) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    quoteListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useQuoteItems() {
  return useQuoteItemsState().items;
}

export function useQuoteItemsState() {
  const [state, setState] = useState({
    items: emptyQuoteItems,
    ready: false,
  });

  useEffect(() => {
    const updateItems = () =>
      setState({
        items: readQuoteItems(),
        ready: true,
      });

    updateItems();

    return subscribeToQuoteItems(updateItems);
  }, []);

  return state;
}
