"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/portafolio", label: "Portafolio y Servicios" },
  { href: "/contacto", label: "Contáctanos" },
];

// Solo visibles con sesión iniciada (equipo interno).
const privateLinks = [
  { href: "/inventario", label: "Inventario" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar({ loggedIn = false }: { loggedIn?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = loggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="GRUPO GIT - Inicio" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="GRUPO GIT"
            width={161}
            height={65}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-800 text-white"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-brand-800 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand-100 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-brand-800 text-white"
                    : "text-brand-800 hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
