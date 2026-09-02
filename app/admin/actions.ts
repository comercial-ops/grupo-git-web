"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugifyFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot) : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${Date.now()}-${base || "archivo"}${ext}`;
}

export async function login(_prevState: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return "Ingresa tu correo y contraseña.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return "Credenciales incorrectas. Verifica tu correo y contraseña.";
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(_prevState: string | null, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "No autorizado.";

  const name = String(formData.get("name") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const photo = formData.get("photo") as File | null;

  if (!name || !reference) {
    return "El nombre y la referencia son obligatorios.";
  }

  let image_url: string | null = null;

  if (photo && photo.size > 0) {
    const path = slugifyFileName(photo.name);
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, photo, { contentType: photo.type });

    if (uploadError) {
      return `No se pudo subir la foto: ${uploadError.message}`;
    }

    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    image_url = publicUrl.publicUrl;
  }

  const { error: insertError } = await supabase.from("products").insert({
    name,
    reference,
    description,
    price: Number.isFinite(price) ? price : 0,
    image_url,
  });

  if (insertError) {
    return `No se pudo guardar el producto: ${insertError.message}`;
  }

  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath("/");
  return null;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function uploadCatalog(_prevState: string | null, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "No autorizado.";

  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!title || !file || file.size === 0) {
    return "Indica un título y selecciona un archivo PDF.";
  }

  const path = slugifyFileName(file.name);
  const { error: uploadError } = await supabase.storage
    .from("catalogs")
    .upload(path, file, { contentType: file.type || "application/pdf" });

  if (uploadError) {
    return `No se pudo subir el catálogo: ${uploadError.message}`;
  }

  const { data: publicUrl } = supabase.storage.from("catalogs").getPublicUrl(path);

  const { error: insertError } = await supabase.from("catalogs").insert({
    title,
    file_url: publicUrl.publicUrl,
  });

  if (insertError) {
    return `No se pudo guardar el catálogo: ${insertError.message}`;
  }

  revalidatePath("/admin");
  revalidatePath("/portafolio");
  return null;
}

export async function deleteCatalog(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("catalogs").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/portafolio");
}
