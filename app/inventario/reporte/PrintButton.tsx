"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
