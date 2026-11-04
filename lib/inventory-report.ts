import type { InventoryItem } from "@/lib/types";

/** Minúsculas y sin tildes: "bogota" encuentra "Bogotá". */
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[^\x00-\x7F]/g, "").toLowerCase().trim();

/** Filtra ítems por texto en nombre, referencia, marca, descripción o localización. */
export function filterItems<T extends InventoryItem>(items: T[], query: string): T[] {
  const q = normalize(query);
  if (!q) return items;
  return items.filter((r) =>
    [r.name, r.reference, r.brand, r.description, r.location].some((v) =>
      normalize(v).includes(q)
    )
  );
}

/** Valor del ítem = cantidad × costo (el costo se asume por unidad). */
export const itemValue = (i: Pick<InventoryItem, "quantity" | "cost">) =>
  i.quantity * Number(i.cost);

export const totals = (items: InventoryItem[]) => ({
  items: items.length,
  units: items.reduce((s, i) => s + i.quantity, 0),
  value: items.reduce((s, i) => s + itemValue(i), 0),
});

export type LocationGroup = {
  location: string;
  items: InventoryItem[];
  units: number;
  value: number;
};

/** Agrupa por localización (orden alfabético; "Sin localización" al final). */
export function groupByLocation(items: InventoryItem[]): LocationGroup[] {
  const map = new Map<string, InventoryItem[]>();
  for (const item of items) {
    const key = item.location.trim() || "Sin localización";
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === "Sin localización") return 1;
      if (b === "Sin localización") return -1;
      return a.localeCompare(b, "es");
    })
    .map(([location, list]) => {
      const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
      const t = totals(sorted);
      return { location, items: sorted, units: t.units, value: t.value };
    });
}
