import Link from "next/link";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-800 bg-brand-950 text-brand-100/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent-500 text-sm font-bold text-accent-400">
              GG
            </span>
            <span>
              GRUPO <span className="text-accent-400">GIT</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Ingeniería, medición de fibra óptica (OTDR), fusión de empalmes y
            capacitación técnica especializada para el sector de
            telecomunicaciones.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/tienda" className="hover:text-white">
                Tienda
              </Link>
            </li>
            <li>
              <Link href="/portafolio" className="hover:text-white">
                Portafolio y Servicios
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-white">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={buildWhatsAppContactLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp: +57 312 895 3243
              </a>
            </li>
            <li>Colombia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800 py-5 text-center text-xs text-brand-100/50">
        © {new Date().getFullYear()} GRUPO GIT. Todos los derechos reservados.
      </div>
    </footer>
  );
}
