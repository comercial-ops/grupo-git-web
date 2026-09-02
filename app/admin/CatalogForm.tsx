"use client";

import { useActionState, useRef } from "react";
import { uploadCatalog } from "./actions";

export default function CatalogForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, formAction, pending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      const result = await uploadCatalog(_prevState, formData);
      if (!result) formRef.current?.reset();
      return result;
    },
    null
  );

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-4">
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
          Archivo PDF
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
