"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { compressImage, publicUrl, uploadToBucket } from "@/lib/upload";
import { createProduct } from "./actions";

const input =
  "mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500";
const label = "block text-xs font-semibold uppercase tracking-wide text-brand-700/70";

export default function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);

    startTransition(async () => {
      try {
        const photo = formData.get("photo") as File | null;
        formData.delete("photo");
        if (photo && photo.size > 0) {
          const { blob, ext, contentType } = await compressImage(photo);
          const path = await uploadToBucket("product-images", blob, {
            name: String(formData.get("name") ?? ""),
            ext,
            contentType,
          });
          formData.set("image_url", publicUrl("product-images", path));
        }
      } catch (err) {
        setError(`No se pudo subir la foto: ${err instanceof Error ? err.message : "error"}`);
        return;
      }

      const result = await createProduct(null, formData);
      if (result) {
        setError(result);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label}>Nombre del equipo</label>
        <input name="name" required className={input} />
      </div>

      <div>
        <label className={label}>Referencia</label>
        <input name="reference" required className={input} />
      </div>

      <div className="sm:col-span-2">
        <label className={label}>Descripción</label>
        <textarea name="description" rows={3} className={input} />
      </div>

      <div>
        <label className={label}>Precio (COP)</label>
        <input name="price" type="number" min="0" step="1" required className={input} />
      </div>

      <div>
        <label className={label}>Foto del producto</label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          className="mt-1 w-full text-sm text-brand-700/80 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
      </div>

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Publicar producto"}
        </button>
      </div>
    </form>
  );
}
