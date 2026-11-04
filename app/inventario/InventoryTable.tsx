"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { InventoryItem } from "@/lib/types";
import { formatCOP } from "@/lib/whatsapp";

export type InventoryRow = InventoryItem & { photoUrl: string | null };

// Búsqueda sin distinguir mayúsculas ni tildes ("bogota" encuentra "Bogotá").
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[^\x00-\x7F]/g, "").toLowerCase().trim();

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="inline h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function NameCell({ row }: { row: InventoryRow }) {
  if (!row.photoUrl) return <span className="font-medium text-brand-950">{row.name}</span>;
  return (
    <a
      href={row.photoUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Ver foto"
      className="inline-flex items-center gap-1.5 font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-950"
    >
      <CameraIcon />
      {row.name}
    </a>
  );
}

export default function InventoryTable({ rows }: { rows: InventoryRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.reference, r.brand, r.description, r.location].some((v) =>
        normalize(v).includes(q)
      )
    );
  }, [rows, query]);

  const units = filtered.reduce((sum, r) => sum + r.quantity, 0);
  const value = filtered.reduce((sum, r) => sum + r.quantity * Number(r.cost), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nombre, ref., marca, lugar…"
          className="min-w-[240px] flex-1 rounded-md border border-brand-100 bg-white px-3 py-2.5 text-base outline-none focus:border-brand-500 md:text-sm"
        />
        <Link
          href="/inventario/nuevo"
          className="rounded-md bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          + Agregar ítem
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-brand-200 bg-white p-10 text-center text-sm text-brand-700/70">
          {rows.length === 0
            ? "El inventario está vacío. Agrega el primer ítem con el botón de arriba."
            : "Ningún ítem coincide con la búsqueda."}
        </div>
      ) : (
        <>
          {/* Escritorio: tabla */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-brand-100 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs uppercase tracking-wide text-brand-700/70">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Referencia</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3 text-right">Cant.</th>
                  <th className="px-4 py-3">Localización</th>
                  <th className="px-4 py-3 text-right">Costo</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-brand-50/60">
                    <td className="px-4 py-3"><NameCell row={r} /></td>
                    <td className="px-4 py-3 text-brand-950">{r.reference}</td>
                    <td className="px-4 py-3 text-brand-950">{r.brand}</td>
                    <td className="max-w-xs px-4 py-3 text-brand-700/80">{r.description}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-950">{r.quantity}</td>
                    <td className="px-4 py-3 text-brand-950">{r.location}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-brand-950">{formatCOP(Number(r.cost))}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/inventario/${r.id}`} className="text-brand-700 hover:text-brand-950">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Celular: tarjetas */}
          <ul className="mt-6 space-y-3 md:hidden">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-xl border border-brand-100 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <NameCell row={r} />
                    <p className="mt-0.5 text-xs text-brand-700/70">
                      {[r.reference && `Ref. ${r.reference}`, r.brand].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-800 px-2.5 py-1 text-xs font-semibold text-white">
                    × {r.quantity}
                  </span>
                </div>
                {r.description && <p className="mt-2 text-sm text-brand-700/80">{r.description}</p>}
                <div className="mt-3 flex items-center justify-between text-xs text-brand-700/70">
                  <span>{r.location ? `📍 ${r.location}` : "Sin localización"}</span>
                  <span className="font-medium text-brand-950">{formatCOP(Number(r.cost))}</span>
                </div>
                <Link href={`/inventario/${r.id}`} className="mt-3 inline-block text-sm font-medium text-brand-700">
                  Editar
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-4 text-xs text-brand-700/70">
        {filtered.length} ítem(s) · {units} unidad(es) · Valor total (cantidad × costo):{" "}
        <strong className="text-brand-950">{formatCOP(value)}</strong>
      </p>
    </div>
  );
}
