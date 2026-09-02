"use client";

import { useActionState, useRef } from "react";
import { createProduct } from "./actions";

export default function ProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, formAction, pending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      const result = await createProduct(_prevState, formData);
      if (!result) formRef.current?.reset();
      return result;
    },
    null
  );

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Nombre del equipo
        </label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Referencia
        </label>
        <input
          name="reference"
          required
          className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Precio (COP)
        </label>
        <input
          name="price"
          type="number"
          min="0"
          step="1"
          required
          className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          Foto del producto
        </label>
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
