export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  artwork?: string;
  icon?: string;
  href: string;
  quoteEnabled: boolean;
  children: ProductCategory[];
};

export type ProductCategoryCatalog = {
  schemaVersion: 1;
  lineId: string;
  categories: ProductCategory[];
};

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function stringOrEmpty(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseCategory(value: unknown): ProductCategory | null {
  if (!isJsonRecord(value)) {
    return null;
  }

  const id = optionalString(value.id);
  const name = optionalString(value.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    description: stringOrEmpty(value.description),
    artwork: optionalString(value.artwork),
    icon: optionalString(value.icon),
    href: optionalString(value.href) ?? "/cotizar-repuestos",
    quoteEnabled: value.quoteEnabled !== false,
    children: parseCategories(value.children),
  };
}

function parseCategories(value: unknown): ProductCategory[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((category) => {
    const parsedCategory = parseCategory(category);

    return parsedCategory ? [parsedCategory] : [];
  });
}

export function parseProductCategoryCatalog(
  value: unknown,
): ProductCategoryCatalog {
  if (!isJsonRecord(value)) {
    throw new Error("El catálogo de categorías debe ser un objeto JSON.");
  }

  if (value.schemaVersion !== 1) {
    throw new Error("La versión del catálogo de categorías no es compatible.");
  }

  const lineId = optionalString(value.lineId);

  if (!lineId) {
    throw new Error("El catálogo de categorías necesita un lineId.");
  }

  return {
    schemaVersion: 1,
    lineId,
    categories: parseCategories(value.categories),
  };
}
