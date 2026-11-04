"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publicUrl, uploadToBucket } from "@/lib/upload";
import { createCatalog } from "./actions";

const MAX_MB = 50; // límite del plan gratuito de Supabase Storage

export default function CatalogForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);

    const file = formData.get("file") as File | null;
    formData.delete("file");
    if (!file || file.size === 0) {
      setError("Selecciona un archivo PDF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo pesa ${(file.size / 1048576).toFixed(1)} MB; el máximo es ${MAX_MB} MB.`);
      return;
    }

    startTransition(async () => {
      try {
        const path = await uploadToBucket("catalogs", file, {
          name: String(formData.get("title") ?? file.name),
          ext: "pdf",
          contentType: file.type || "application/pdf",
        });
        formData.set("file_url", publicUrl("catalogs", path));
      } catch (err) {
        setError(`No se pudo subir el catálogo: ${err instanceof Error ? err.message : "error"}`);
        return;
      }

      const result = await createCatalog(null, formData);
      if (result) {
        setError(result);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
      <div className="min-w-[220px] flex-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Título del catálogo
        </label>
        <input
          name="title"
          required
          className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Archivo PDF (hasta {MAX_MB} MB)
        </label>
        <input
          name="file"
          type="file"
          accept="application/pdf"
          required
          className="mt-1 text-sm text-brand-700/80 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Subiendo..." : "Subir catálogo"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
