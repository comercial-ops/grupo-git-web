import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { formatCOP } from "@/lib/whatsapp";
import type { Product, Catalog } from "@/lib/types";
import { deleteCatalog, deleteProduct, logout } from "./actions";
import ProductForm from "./ProductForm";
import CatalogForm from "./CatalogForm";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();

  const [productList, catalogList] = await Promise.all([
    safeQuery<Product>(
      supabase.from("products").select("*").order("created_at", { ascending: false })
    ),
    safeQuery<Catalog>(
      supabase.from("catalogs").select("*").order("created_at", { ascending: false })
    ),
  ]);

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
            Panel de administración
          </h1>
          <p className="mt-1 text-2xl font-bold text-brand-950">GRUPO GIT</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      {/* Productos */}
      <section className="mt-10 rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-950">
          Nuevo producto
        </h2>
        <div className="mt-4">
          <ProductForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-brand-950">
          Productos publicados ({productList.length})
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-brand-100 bg-white">
          {productList.length === 0 ? (
            <p className="p-6 text-sm text-brand-700/70">
              Aún no has publicado ningún producto.
            </p>
          ) : (
            <ul className="divide-y divide-brand-100">
              {productList.map((product) => (
                <li key={product.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-brand-50">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-950">
                      {product.name}{" "}
                      <span className="text-brand-500">· {product.reference}</span>
                    </p>
                    <p className="text-sm text-brand-700/70">
                      {formatCOP(product.price)}
                    </p>
                  </div>
                  <form action={deleteProduct.bind(null, product.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Catálogos */}
      <section className="mt-12 rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-950">
          Nuevo catálogo
        </h2>
        <div className="mt-4">
          <CatalogForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-brand-950">
          Catálogos publicados ({catalogList.length})
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-brand-100 bg-white">
          {catalogList.length === 0 ? (
            <p className="p-6 text-sm text-brand-700/70">
              Aún no has subido ningún catálogo.
            </p>
          ) : (
            <ul className="divide-y divide-brand-100">
              {catalogList.map((catalog) => (
                <li key={catalog.id} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={catalog.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-medium text-brand-950 hover:text-brand-700"
                    >
                      {catalog.title}
                    </a>
                  </div>
                  <form action={deleteCatalog.bind(null, catalog.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
