import type { Catalog } from "@/lib/types";

export default function CatalogCard({ catalog }: { catalog: Catalog }) {
  return (
    <a
      href={catalog.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-xl border border-brand-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5A1.5 1.5 0 0 1 6.5 3.5H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5V8a1 1 0 0 0 1 1h4.5" />
        </svg>
      </span>
      <div className="flex-1">
        <p className="font-medium text-brand-950">{catalog.title}</p>
        <p className="text-xs text-brand-700/70">PDF · Descargar catálogo</p>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5 shrink-0 text-brand-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0 4-4m-4 4-4-4M5 19h14" />
      </svg>
    </a>
  );
}
