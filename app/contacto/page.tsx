import type { Metadata } from "next";
import WhatsAppButton from "@/components/WhatsAppButton";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contáctanos | GRUPO GIT",
  description:
    "Escríbenos por WhatsApp o correo para cotizar equipos, servicios de ingeniería o capacitación técnica en fibra óptica.",
};

const contactItems = [
  {
    label: "WhatsApp",
    value: "+57 312 895 3243",
    href: buildWhatsAppContactLink(),
  },
  {
    label: "Correo",
    // TODO: reemplazar por el correo real de GRUPO GIT
    value: "contacto@grupogit.com",
    href: "mailto:contacto@grupogit.com",
  },
  {
    label: "Cobertura",
    value: "Colombia — atención nacional",
    href: undefined,
  },
];

export default function ContactoPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
          Contáctanos
        </h1>
        <p className="mt-2 text-3xl font-bold text-brand-950">
          Hablemos de tu proyecto de fibra óptica
        </p>
        <p className="mt-3 text-base text-brand-700/80">
          La forma más rápida de recibir atención es escribirnos directamente
          por WhatsApp. Con gusto te ayudamos a cotizar equipos, servicios de
          ingeniería o capacitación técnica.
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-950">
            Escríbenos ahora
          </h2>
          <p className="mt-2 text-sm text-brand-700/80">
            Te respondemos en horario hábil. Cuéntanos qué necesitas y un
            asesor de GRUPO GIT te contactará.
          </p>
          <WhatsAppButton
            href={buildWhatsAppContactLink()}
            label="Abrir chat de WhatsApp"
            className="mt-6"
          />
        </div>

        <div className="rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-950">
            Datos de contacto
          </h2>
          <ul className="mt-4 space-y-4">
            {contactItems.map((item) => (
              <li key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand-950 hover:text-brand-700"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-brand-950">
                    {item.value}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
