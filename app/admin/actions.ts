"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Los archivos (fotos y PDFs) los sube el navegador DIRECTO a Supabase Storage
// (ver lib/upload.ts) para evitar el límite de tamaño de Vercel. Estas acciones
// solo reciben la URL pública resultante y la validan.
function isOwnPublicUrl(url: string, bucket: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base) && url.startsWith(`${base}/storage/v1/object/public/${bucket}/`);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function login(_prevState: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return "Ingresa tu correo y contraseña.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return "Credenciales incorrectas. Verifica tu correo y contraseña.";
  }

  // Solo rutas internas (evita redirecciones a otros sitios).
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  redirect(safeNext);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(_prevState: string | null, formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return "No autorizado.";

  const name = String(formData.get("name") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const imageUrl = String(formData.get("image_url") ?? "");

  if (!name || !reference) {
    return "El nombre y la referencia son obligatorios.";
  }
  if (imageUrl && !isOwnPublicUrl(imageUrl, "product-images")) {
    return "URL de imagen no válida.";
  }

  const { error } = await supabase.from("products").insert({
    name,
    reference,
    description,
    price: Number.isFinite(price) ? price : 0,
    image_url: imageUrl || null,
  });

  if (error) return `No se pudo guardar el producto: ${error.message}`;

  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath("/");
  return null;
}

export async function deleteProduct(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function createCatalog(_prevState: string | null, formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) return "No autorizado.";

  const title = String(formData.get("title") ?? "").trim();
  const fileUrl = String(formData.get("file_url") ?? "");

  if (!title || !fileUrl) return "Indica un título y selecciona un archivo PDF.";
  if (!isOwnPublicUrl(fileUrl, "catalogs")) return "URL de archivo no válida.";

  const { error } = await supabase.from("catalogs").insert({ title, file_url: fileUrl });
  if (error) return `No se pudo guardar el catálogo: ${error.message}`;

  revalidatePath("/admin");
  revalidatePath("/portafolio");
  return null;
}

export async function deleteCatalog(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase.from("catalogs").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/portafolio");
}
