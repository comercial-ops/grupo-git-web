import type { Metadata } from "next";
import Image from "next/image";
import CatalogCard from "@/components/CatalogCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FiberPattern, ServiceIcon } from "@/components/Graphics";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";
import { siteImages } from "@/lib/site-images";
import type { Catalog } from "@/lib/types";

export const metadata: Metadata = {
  title: "Portafolio y Servicios | GRUPO GIT",
  description:
    "Servicios de ingeniería, medición OTDR, fusión de empalmes, alquiler de equipos, UPS y capacitación técnica de GRUPO GIT. Descarga nuestros catálogos.",
};

export const revalidate = 0;

const services = [
  {
    icon: "network" as const,
    title: "Ingeniería y diseño de redes",
    description:
      "Levantamiento, diseño y ejecución de proyectos de redes de fibra óptica FTTH, troncales y enlaces dedicados.",
  },
  {
    icon: "gauge" as const,
    title: "Medición OTDR y certificación",
    description:
      "Caracterización de enlaces en fibra activa y oscura con equipos OTDR, y entrega de informes de certificación.",
  },
  {
    icon: "tools" as const,
    title: "Fusión de empalmes",
    description:
      "Empalme de fibra óptica con fusionadoras de alta precisión para minimizar las pérdidas de inserción.",
  },
  {
    icon: "rental" as const,
    title: "Alquiler de equipos",
    description:
      "OTDR, fusionadoras y PON power meters en alquiler por proyecto. Consulta el catálogo de alquileres.",
  },
  {
    icon: "power" as const,
    title: "UPS y respaldo de energía",
    description:
      "UPS on-line de doble conversión: monofásicas, bifásicas y trifásicas para infraestructura crítica.",
  },
  {
    icon: "training" as const,
    title: "Capacitación técnica",
    description:
      "Formación práctica para técnicos e ingenieros en instalación, medición, fusión y mantenimiento de redes ópticas.",
  },
];

export default async function PortafolioPage() {
  const supabase = await createClient();
  const items = await safeQuery<Catalog>(
    supabase.from("catalogs").select("*").order("created_at", { ascending: false })
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-950">
        {siteImages.training && (
          <Image
            src={siteImages.training}
            alt="Capacitación técnica en fibra óptica"
            fill
            priority
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <FiberPattern />
        <div className="container-page relative py-20 md:py-24">
          <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            Portafolio y Servicios
          </h1>
          <p className="mt-3 max-w-2xl text-3xl font-bold text-white md:text-4xl">
            Ingeniería, medición y capacitación en fibra óptica
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-800 text-accent-400">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-brand-950">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/80">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton
            href={buildWhatsAppContactLink(
              "Hola GRUPO GIT, quisiera cotizar un servicio de ingeniería/medición de fibra óptica."
            )}
            label="Cotizar un servicio por WhatsApp"
          />
        </div>
      </section>

      <section className="bg-brand-50 py-16">
        <div className="container-page">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
            Catálogos
          </h2>
          <p className="mt-2 text-3xl font-bold text-brand-950">
            Descarga nuestro material técnico
          </p>

          {items.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-brand-200 bg-white p-10 text-center text-brand-700/70">
              Aún no hay catálogos publicados.
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((catalog) => (
                <CatalogCard key={catalog.id} catalog={catalog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
