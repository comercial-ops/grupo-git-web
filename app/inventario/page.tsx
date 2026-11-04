import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import type { InventoryItem } from "@/lib/types";
import InventoryTable, { type InventoryRow } from "./InventoryTable";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const supabase = await createClient();

  const items = await safeQuery<InventoryItem>(
    supabase.from("inventory_items").select("*").order("created_at", { ascending: false })
  );

  // Bucket privado: se generan links firmados temporales (1 hora) para cada foto.
  const paths = items.map((i) => i.photo_path).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    try {
      const { data } = await supabase.storage
        .from("inventory-photos")
        .createSignedUrls(paths, 3600);
      data?.forEach((entry) => {
        if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
      });
    } catch {
      // Sin links de foto, la tabla igual se muestra.
    }
  }

  const rows: InventoryRow[] = items.map((item) => ({
    ...item,
    photoUrl: item.photo_path ? (signed.get(item.photo_path) ?? null) : null,
  }));

  return (
    <div className="container-page py-12">
      <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
        Interno
      </h1>
      <p className="mt-1 text-3xl font-bold text-brand-950">Inventario</p>
      <p className="mt-2 max-w-2xl text-sm text-brand-700/80">
        Equipos en bodega y su localización. Esta lista es independiente de la
        tienda: aquí solo están los equipos que realmente tienes. Toca el
        nombre para ver la foto.
      </p>
      <div className="mt-8">
        <InventoryTable rows={rows} />
      </div>
    </div>
  );
}
