import type { Metadata } from "next";
import Image from "next/image";
import CatalogCard from "@/components/CatalogCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";
import { stockImages } from "@/lib/stock-images";
import type { Catalog } from "@/lib/types";

export const metadata: Metadata = {
  title: "Portafolio y Servicios | GRUPO GIT",
  description:
    "Servicios de ingeniería, medición OTDR, fusión de empalmes y capacitación técnica de GRUPO GIT. Descarga nuestros catálogos.",
};

export const revalidate = 0;

const services = [
  {
    title: "Ingeniería y Diseño de Redes",
    description:
      "Levantamiento, diseño y ejecución de proyectos de redes de fibra óptica FTTH, troncales y enlaces dedicados.",
    image: stockImages.serviceEngineering,
  },
  {
    title: "Medición OTDR y Certificación",
    description:
      "Caracterización de enlaces con reflectómetros OTDR de última generación y entrega de informes de certificación.",
    image: stockImages.serviceOtdrFusion,
  },
  {
    title: "Fusión de Empalmes",
    description:
      "Empalme de fibra óptica con fusionadoras de alta precisión, minimizando pérdidas de inserción en cada enlace.",
    image: stockImages.portfolioHero,
  },
  {
    title: "Capacitación Técnica",
    description:
      "Formación práctica para técnicos e ingenieros en instalación, medición, fusión y mantenimiento de redes ópticas.",
    image: stockImages.trainingSecondary,
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
        <Image
          src={stockImages.serviceTraining}
          alt="Capacitación técnica en fibra óptica"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-950/50" />
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
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex gap-5 rounded-xl border border-brand-100 bg-white p-5 shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-brand-950">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-700/80">
                  {service.description}
                </p>
              </div>
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
