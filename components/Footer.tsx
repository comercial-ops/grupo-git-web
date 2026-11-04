import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-800 bg-brand-950 text-brand-100/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-lg bg-white px-3 py-2">
            <Image src="/logo.png" alt="GRUPO GIT" width={161} height={65} className="h-9 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Ingeniería, alquiler y venta de equipos de medición de fibra óptica
            (OTDR y fusionadoras) y capacitación técnica para el sector de
            telecomunicaciones.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/tienda" className="hover:text-white">Tienda</Link></li>
            <li><Link href="/portafolio" className="hover:text-white">Portafolio y Servicios</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contáctanos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={buildWhatsAppContactLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp: {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
            {site.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="hover:text-white">Tel. {p.display}</a>
              </li>
            ))}
            <li>{site.country}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800 py-5 text-center text-xs text-brand-100/50">
        © {new Date().getFullYear()} GRUPO GIT. Todos los derechos reservados.
      </div>
    </footer>
  );
}
