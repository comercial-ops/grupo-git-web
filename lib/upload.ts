// Subida de archivos DIRECTO del navegador a Supabase Storage.
// Así se evita el límite de ~4.5 MB por petición de Vercel (catálogos PDF
// grandes y fotos de celular).  Solo usar desde componentes de cliente.

import { createClient } from "@/lib/supabase/client";

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "archivo"
  );
}

/**
 * Reduce una foto (ej. de la cámara del celular) a máx. `maxSide` px y la
 * convierte a JPEG. Respeta la orientación EXIF. Si el navegador no puede
 * decodificarla (ej. HEIC), devuelve el archivo original.
 */
export async function compressImage(
  file: File,
  maxSide = 1600,
  quality = 0.82
): Promise<{ blob: Blob; ext: string; contentType: string }> {
  const original = {
    blob: file as Blob,
    ext: (file.name.split(".").pop() || "jpg").toLowerCase(),
    contentType: file.type || "image/jpeg",
  };
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return original;
    return { blob, ext: "jpg", contentType: "image/jpeg" };
  } catch {
    return original;
  }
}

type UploadOptions = {
  folder?: string;
  /** Nombre base legible para el archivo (se normaliza). */
  name?: string;
  ext: string;
  contentType: string;
};

/** Sube un archivo y devuelve su ruta dentro del bucket. */
export async function uploadToBucket(
  bucket: string,
  blob: Blob,
  { folder, name, ext, contentType }: UploadOptions
): Promise<string> {
  const supabase = createClient();
  const unique = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const base = name ? `${unique}-${slugify(name)}` : unique;
  const path = `${folder ? folder + "/" : ""}${base}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export function publicUrl(bucket: string, path: string) {
  const supabase = createClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
