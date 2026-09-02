import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tienda | GRUPO GIT",
  description:
    "Equipos de fibra óptica: OTDR, fusionadoras y accesorios. Consulta precio y compra directo por WhatsApp.",
};

export const revalidate = 0;

export default async function TiendaPage() {
  const supabase = await createClient();
  const items = await safeQuery<Product>(
    supabase.from("products").select("*").order("created_at", { ascending: false })
  );

  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
          Tienda
        </h1>
        <p className="mt-2 text-3xl font-bold text-brand-950">
          Equipos de fibra óptica
        </p>
        <p className="mt-3 text-base text-brand-700/80">
          Selecciona un equipo y escríbenos por WhatsApp para confirmar
          disponibilidad, precio final y forma de entrega.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-brand-100 bg-white p-12 text-center text-brand-700/70">
          Por ahora no hay productos publicados. Vuelve pronto.
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
