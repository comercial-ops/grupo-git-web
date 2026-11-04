import type { InventoryItem } from "@/lib/types";
import { itemValue, totals } from "@/lib/inventory-report";

/**
 * Genera y descarga un .xlsx con los ítems recibidos (los que se ven en
 * pantalla, o sea respeta el filtro de búsqueda) y una fila de totales.
 * La librería se carga solo al hacer clic, para no pesar en el resto del sitio.
 */
export async function downloadInventoryExcel(items: InventoryItem[]) {
  const { default: writeExcelFile } = await import("write-excel-file/universal");

  const head = (value: string, align?: "right") => ({
    value,
    fontWeight: "bold" as const,
    backgroundColor: "#E4ECE7",
    ...(align ? { align } : {}),
  });
  const money = "#,##0";

  const t = totals(items);

  const data = [
    [
      head("Nombre"),
      head("Referencia"),
      head("Marca"),
      head("Descripción"),
      head("Cantidad", "right"),
      head("Localización"),
      head("Costo unitario (COP)", "right"),
      head("Valor total (COP)", "right"),
    ],
    ...items.map((i) => [
      { value: i.name },
      { value: i.reference },
      { value: i.brand },
      { value: i.description },
      { value: i.quantity, type: Number, format: "0" },
      { value: i.location },
      { value: Number(i.cost), type: Number, format: money },
      { value: itemValue(i), type: Number, format: money },
    ]),
    [
      { value: "TOTAL", fontWeight: "bold" as const },
      null,
      null,
      { value: `${t.items} ítem(s)` },
      { value: t.units, type: Number, format: "0", fontWeight: "bold" as const },
      null,
      null,
      { value: t.value, type: Number, format: money, fontWeight: "bold" as const },
    ],
  ];

  const blob = await writeExcelFile(data, {
    columns: [
      { width: 30 },
      { width: 18 },
      { width: 16 },
      { width: 40 },
      { width: 10 },
      { width: 24 },
      { width: 20 },
      { width: 18 },
    ],
  }).toBlob();

  // Fecha en hora de Colombia (formato AAAA-MM-DD).
  const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Bogota" }).format(new Date());
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventario-grupo-git-${day}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
