import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/lib/types";
import ItemForm from "../ItemForm";

export default async function EditarItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/admin/login?next=/inventario/${id}`);

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const item = data as InventoryItem;

  let photoUrl: string | null = null;
  if (item.photo_path) {
    const { data: signed } = await supabase.storage
      .from("inventory-photos")
      .createSignedUrl(item.photo_path, 3600);
    photoUrl = signed?.signedUrl ?? null;
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
        Inventario
      </h1>
      <p className="mt-1 text-3xl font-bold text-brand-950">Editar ítem</p>
      <div className="mt-8">
        <ItemForm userId={user.id} item={item} photoUrl={photoUrl} />
      </div>
    </div>
  );
}
