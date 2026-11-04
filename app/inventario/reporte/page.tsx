import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { filterItems } from "@/lib/inventory-report";
import type { InventoryItem } from "@/lib/types";
import ReportView from "./ReportView";

export const dynamic = "force-dynamic";

export default async function ReporteInventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login?next=/inventario/reporte");

  const all = await safeQuery<InventoryItem>(
    supabase.from("inventory_items").select("*").order("name", { ascending: true })
  );

  const generatedAt = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date());

  return <ReportView items={filterItems(all, q)} query={q} generatedAt={generatedAt} />;
}
