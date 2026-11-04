"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InventoryItem } from "@/lib/types";
import { compressImage, uploadToBucket } from "@/lib/upload";
import { createItem, deleteItem, updateItem } from "./actions";

const input =
  "mt-1 w-full rounded-md border border-brand-100 bg-white px-3 py-2.5 text-base outline-none focus:border-brand-500 md:text-sm";
const label = "block text-xs font-semibold uppercase tracking-wide text-brand-700/70";

type Props = {
  userId: string;
  /** Si viene, el formulario edita ese ítem; si no, crea uno nuevo. */
  item?: InventoryItem;
  /** URL firmada de la foto actual (solo al editar). */
  photoUrl?: string | null;
};

export default function ItemForm({ userId, item, photoUrl }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(photoUrl ?? null);

  // Vista previa de la foto recién tomada/elegida (se libera al cambiar/salir).
  const objectUrl = useRef<string | null>(null);
  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  function onPickFile(picked: File | null) {
    setFile(picked);
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = picked ? URL.createObjectURL(picked) : null;
    setPreview(objectUrl.current ?? photoUrl ?? null);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.delete("photo");
    setError(null);

    startTransition(async () => {
      try {
        if (file) {
          const { blob, ext, contentType } = await compressImage(file);
          const path = await uploadToBucket("inventory-photos", blob, {
            folder: userId,
            ext,
            contentType,
          });
          formData.set("photo_path", path);
        }
      } catch (err) {
        setError(`No se pudo subir la foto: ${err instanceof Error ? err.message : "error"}`);
        return;
      }

      const result = item ? await updateItem(item.id, formData) : await createItem(formData);
      if (result) {
        setError(result);
        return;
      }
      router.push("/inventario");
      router.refresh();
    });
  }

  function onDelete() {
    if (!item) return;
    if (!window.confirm(`¿Eliminar "${item.name}" del inventario? No se puede deshacer.`)) return;
    startTransition(async () => {
      const result = await deleteItem(item.id);
      if (result) {
        setError(result);
        return;
      }
      router.push("/inventario");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Foto */}
      <div>
        <span className={label}>Foto</span>
        <div className="mt-1 flex items-center gap-4">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-brand-200 bg-brand-50">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-center text-xs text-brand-700/60">Sin foto</span>
            )}
          </div>
          <label className="cursor-pointer rounded-md bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            {preview ? "Cambiar foto" : "Tomar o elegir foto"}
            <input
              name="photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-brand-700/60">
          En el celular puedes tomarla con la cámara o elegirla de la galería.
        </p>
      </div>

      <div>
        <label className={label}>Nombre</label>
        <input name="name" required defaultValue={item?.name} className={input} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Referencia</label>
          <input name="reference" defaultValue={item?.reference} className={input} />
        </div>
        <div>
          <label className={label}>Marca</label>
          <input name="brand" defaultValue={item?.brand} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Descripción básica</label>
        <textarea name="description" rows={2} defaultValue={item?.description} className={input} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label}>Cantidad</label>
          <input
            name="quantity"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            required
            defaultValue={item?.quantity ?? 1}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Localización</label>
          <input name="location" defaultValue={item?.location} className={input} />
        </div>
        <div>
          <label className={label}>Costo (COP)</label>
          <input
            name="cost"
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            defaultValue={item?.cost ?? 0}
            className={input}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Guardando..." : item ? "Guardar cambios" : "Agregar al inventario"}
        </button>
        <Link
          href="/inventario"
          className="rounded-md border border-brand-200 px-5 py-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
        >
          Cancelar
        </Link>
        {item && (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="ml-auto rounded-md border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
