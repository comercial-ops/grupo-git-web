import Image from "next/image";
import Link from "next/link";
import { groupByLocation, itemValue, totals } from "@/lib/inventory-report";
import type { InventoryItem } from "@/lib/types";
import { formatCOP } from "@/lib/whatsapp";
import PrintButton from "./PrintButton";

const th = "border-b border-brand-800 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide";
const td = "border-b border-brand-100 px-2 py-1.5 align-top";

export default function ReportView({
  items,
  query,
  generatedAt,
}: {
  items: InventoryItem[];
  query: string;
  generatedAt: string;
}) {
  const groups = groupByLocation(items);
  const total = totals(items);

  return (
    <div className="container-page max-w-6xl py-10 print:max-w-none print:p-0">
      {/* Al imprimir: horizontal, sin menú ni pie */}
      <style>{`@page { size: A4 landscape; margin: 12mm; }`}</style>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/inventario" className="text-sm font-medium text-brand-700 hover:text-brand-950">
          ← Volver al inventario
        </Link>
        <PrintButton />
      </div>

      <header className="flex items-start justify-between gap-4 border-b-2 border-brand-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Reporte de inventario</h1>
          <p className="mt-1 text-sm text-brand-700/80">Generado el {generatedAt}</p>
          {query.trim() && (
            <p className="mt-1 text-sm text-brand-700/80">
              Filtro aplicado: <strong>“{query.trim()}”</strong>
            </p>
          )}
        </div>
        <Image src="/logo.png" alt="GRUPO GIT" width={161} height={65} className="h-12 w-auto" />
      </header>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-brand-700/80">No hay ítems para mostrar.</p>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.location} className="mt-8 break-inside-avoid-page">
              <h2 className="text-base font-semibold text-brand-950">
                📍 {g.location}{" "}
                <span className="text-sm font-normal text-brand-700/70">
                  — {g.items.length} ítem(s)
                </span>
              </h2>
              <table className="mt-2 w-full text-xs text-brand-950">
                <thead>
                  <tr>
                    <th className={th}>Nombre</th>
                    <th className={th}>Referencia</th>
                    <th className={th}>Marca</th>
                    <th className={th}>Descripción</th>
                    <th className={`${th} text-right`}>Cant.</th>
                    <th className={`${th} text-right`}>Costo unit.</th>
                    <th className={`${th} text-right`}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((i) => (
                    <tr key={i.id} className="break-inside-avoid">
                      <td className={`${td} font-medium`}>{i.name}</td>
                      <td className={td}>{i.reference}</td>
                      <td className={td}>{i.brand}</td>
                      <td className={td}>{i.description}</td>
                      <td className={`${td} text-right`}>{i.quantity}</td>
                      <td className={`${td} whitespace-nowrap text-right`}>{formatCOP(Number(i.cost))}</td>
                      <td className={`${td} whitespace-nowrap text-right`}>{formatCOP(itemValue(i))}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="px-2 py-1.5" colSpan={4}>Subtotal {g.location}</td>
                    <td className="px-2 py-1.5 text-right">{g.units}</td>
                    <td />
                    <td className="whitespace-nowrap px-2 py-1.5 text-right">{formatCOP(g.value)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          ))}

          <div className="mt-8 break-inside-avoid border-t-2 border-brand-800 pt-3 text-sm text-brand-950">
            <p className="flex flex-wrap justify-between gap-2 font-bold">
              <span>TOTAL GENERAL</span>
              <span>
                {total.items} ítem(s) · {total.units} unidad(es) · {formatCOP(total.value)}
              </span>
            </p>
            <p className="mt-1 text-xs text-brand-700/70">
              Valor = cantidad × costo unitario (COP).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
