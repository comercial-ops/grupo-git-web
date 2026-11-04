"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "inventory-photos";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function parseItem(formData: FormData, userId: string) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "El nombre es obligatorio." as const };

  const quantity = Math.trunc(Number(formData.get("quantity") ?? 0));
  const cost = Number(formData.get("cost") ?? 0);
  if (!Number.isFinite(quantity) || quantity < 0) return { error: "Cantidad no válida." as const };
  if (!Number.isFinite(cost) || cost < 0) return { error: "Costo no válido." as const };

  // La foto la sube el navegador directo a Storage dentro de la carpeta del
  // usuario; aquí solo se valida la ruta recibida.
  const photoPath = String(formData.get("photo_path") ?? "");
  if (photoPath && (!photoPath.startsWith(`${userId}/`) || photoPath.includes(".."))) {
    return { error: "Ruta de foto no válida." as const };
  }

  return {
    values: {
      name,
      reference: String(formData.get("reference") ?? "").trim(),
      brand: String(formData.get("brand") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      quantity,
      location: String(formData.get("location") ?? "").trim(),
      cost,
    },
    photoPath: photoPath || null,
  };
}

export async function createItem(formData: FormData): Promise<string | null> {
  const { supabase, user } = await requireUser();
  if (!user) return "No autorizado.";

  const parsed = parseItem(formData, user.id);
  if ("error" in parsed) return parsed.error ?? "Datos no válidos.";

  const { error } = await supabase
    .from("inventory_items")
    .insert({ ...parsed.values, photo_path: parsed.photoPath });
  if (error) return `No se pudo guardar: ${error.message}`;

  revalidatePath("/inventario");
  return null;
}

export async function updateItem(id: string, formData: FormData): Promise<string | null> {
  const { supabase, user } = await requireUser();
  if (!user) return "No autorizado.";

  const parsed = parseItem(formData, user.id);
  if ("error" in parsed) return parsed.error ?? "Datos no válidos.";

  const { data: current } = await supabase
    .from("inventory_items")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  // Si no se subió foto nueva, se conserva la anterior.
  const newPath = parsed.photoPath ?? current?.photo_path ?? null;

  const { error } = await supabase
    .from("inventory_items")
    .update({ ...parsed.values, photo_path: newPath })
    .eq("id", id);
  if (error) return `No se pudo guardar: ${error.message}`;

  // Foto reemplazada: borra la anterior para no dejar archivos huérfanos.
  if (parsed.photoPath && current?.photo_path && current.photo_path !== parsed.photoPath) {
    await supabase.storage.from(BUCKET).remove([current.photo_path]);
  }

  revalidatePath("/inventario");
  return null;
}

export async function deleteItem(id: string): Promise<string | null> {
  const { supabase, user } = await requireUser();
  if (!user) return "No autorizado.";

  const { data: current } = await supabase
    .from("inventory_items")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("inventory_items").delete().eq("id", id);
  if (error) return `No se pudo eliminar: ${error.message}`;

  if (current?.photo_path) {
    await supabase.storage.from(BUCKET).remove([current.photo_path]);
  }

  revalidatePath("/inventario");
  return null;
}
