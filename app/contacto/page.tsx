import type { Metadata } from "next";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contáctanos | GRUPO GIT",
  description:
    "Escríbenos por WhatsApp o correo para cotizar equipos, servicios de ingeniería o capacitación técnica en fibra óptica.",
};

type ContactItem = { label: string; lines: { text: string; href?: string }[] };

const contactItems: ContactItem[] = [
  {
    label: "WhatsApp",
    lines: [{ text: site.whatsappDisplay, href: buildWhatsAppContactLink() }],
  },
  {
    label: "Correo",
    lines: [{ text: site.email, href: `mailto:${site.email}` }],
  },
  {
    label: "Teléfonos",
    lines: site.phones.map((p) => ({ text: p.display, href: `tel:${p.tel}` })),
  },
  {
    label: "Web y redes",
    lines: [
      { text: site.website.display, href: site.website.href },
      ...site.socials.map((s) => ({ text: s })),
    ],
  },
  { label: "Cobertura", lines: [{ text: `${site.country} — atención nacional` }] },
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
                {item.lines.map((line) =>
                  line.href ? (
                    <a
                      key={line.text}
                      href={line.href}
                      target={line.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="block text-sm font-medium text-brand-950 hover:text-brand-700"
                    >
                      {line.text}
                    </a>
                  ) : (
                    <p key={line.text} className="text-sm font-medium text-brand-950">
                      {line.text}
                    </p>
                  )
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
