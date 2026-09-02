import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { stockImages } from "@/lib/stock-images";
import type { Product } from "@/lib/types";

const services = [
  {
    title: "Ingeniería de Telecomunicaciones",
    description:
      "Diseño, ejecución y supervisión de proyectos de redes de fibra óptica para operadores e industria.",
    image: stockImages.serviceEngineering,
  },
  {
    title: "Medición OTDR y Fusión de Empalmes",
    description:
      "Certificación de enlaces con equipos OTDR de alta precisión y fusión profesional de empalmes de fibra.",
    image: stockImages.serviceOtdrFusion,
  },
  {
    title: "Capacitación Técnica",
    description:
      "Entrenamiento especializado para técnicos e ingenieros en instalación, medición y mantenimiento de redes ópticas.",
    image: stockImages.serviceTraining,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const featured = await safeQuery<Product>(
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950">
        <Image
          src={stockImages.heroLanding}
          alt="Infraestructura de telecomunicaciones y fibra óptica"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/40" />
        <div className="container-page relative py-28 md:py-36">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            Ingeniería en fibra óptica
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Conectividad confiable, medida y certificada por expertos
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/80 md:text-lg">
            GRUPO GIT ofrece ingeniería de telecomunicaciones, medición OTDR,
            fusión de empalmes, capacitación técnica y equipos especializados
            de fibra óptica para operadores e integradores en toda Colombia.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tienda"
              className="rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-accent-400"
            >
              Ver equipos en la tienda
            </Link>
            <Link
              href="/contacto"
              className="rounded-md border border-brand-100/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
            Qué hacemos
          </h2>
          <p className="mt-2 text-3xl font-bold text-brand-950">
            Servicios de principio a fin para tu red de fibra óptica
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-brand-950">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700/80">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banda de equipo en acción */}
      <section className="bg-brand-50 py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={stockImages.teamInAction}
              alt="Ingenieros de GRUPO GIT en campo"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
              Experiencia comprobada
            </h2>
            <p className="mt-2 text-3xl font-bold text-brand-950">
              Un equipo técnico que entiende tu proyecto
            </p>
            <p className="mt-4 text-base leading-relaxed text-brand-700/80">
              Combinamos experiencia de campo con equipos de medición de alta
              gama para entregar redes de fibra óptica certificadas,
              documentadas y listas para producción.
            </p>
            <Link
              href="/portafolio"
              className="mt-6 inline-block rounded-md bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Conoce nuestro portafolio
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
                Tienda
              </h2>
              <p className="mt-2 text-3xl font-bold text-brand-950">
                Equipos destacados
              </p>
            </div>
            <Link
              href="/tienda"
              className="text-sm font-semibold text-brand-700 hover:text-brand-950"
            >
              Ver toda la tienda →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-brand-950 py-16">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-2xl font-bold text-white md:text-3xl">
            ¿Tienes un proyecto de fibra óptica? Hablemos por WhatsApp
          </h2>
          <Link
            href="/contacto"
            className="rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-accent-400"
          >
            Ir a Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
}
