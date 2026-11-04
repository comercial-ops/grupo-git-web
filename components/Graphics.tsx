import Image from "next/image";

/** Fondo decorativo: líneas de fibra y órbitas, evocan el logo. Sin fotos. */
export function FiberPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="fiber-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#c2b374" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c2b374" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c2b374" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fiber-teal" x1="0" x2="1">
          <stop offset="0" stopColor="#386f58" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5fa98a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#386f58" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="1.5">
        <path d="M-50 420 C 250 300, 450 540, 760 380 S 1150 260, 1280 330" stroke="url(#fiber-gold)" />
        <path d="M-50 470 C 280 360, 480 580, 800 430 S 1160 320, 1280 390" stroke="url(#fiber-teal)" />
        <path d="M-50 520 C 300 420, 520 610, 840 480 S 1170 380, 1280 450" stroke="url(#fiber-gold)" opacity="0.6" />
        <path d="M-50 370 C 220 240, 430 480, 720 330 S 1140 200, 1280 270" stroke="url(#fiber-teal)" opacity="0.7" />
      </g>
      <g fill="none" stroke="#c2b374" strokeOpacity="0.22" strokeWidth="1.5">
        <ellipse cx="930" cy="190" rx="190" ry="70" transform="rotate(-24 930 190)" />
        <ellipse cx="930" cy="190" rx="190" ry="70" transform="rotate(24 930 190)" />
        <circle cx="930" cy="190" r="110" />
      </g>
      <circle cx="930" cy="190" r="5" fill="#c2b374" fillOpacity="0.7" />
      <circle cx="1075" cy="132" r="4" fill="#5fa98a" fillOpacity="0.7" />
      <circle cx="790" cy="262" r="4" fill="#5fa98a" fillOpacity="0.7" />
    </svg>
  );
}

type IconName = "network" | "gauge" | "training" | "rental" | "power" | "tools";

const iconPaths: Record<IconName, React.ReactNode> = {
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2v4.3m0 0-5.7 4.6M12 11.5l5.7 4.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="m12 17 4-5" />
      <circle cx="12" cy="17" r="1.2" />
    </>
  ),
  training: (
    <>
      <path d="m3 9 9-4.5L21 9l-9 4.5L3 9Z" />
      <path d="M7 11.2V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.8" />
      <path d="M21 9v5" />
    </>
  ),
  rental: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h4M7 14h2" />
      <path d="M16 11.5h1.5" />
    </>
  ),
  power: (
    <>
      <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
    </>
  ),
  tools: (
    <>
      <path d="m14.5 6.5 3-3a4 4 0 0 1-5 5L5 16l-1 4 4-1 7.5-7.5a4 4 0 0 0 5-5l-3 3-2.2-.3-.3-2.2Z" />
    </>
  ),
};

export function ServiceIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
}

/** Foto real si existe; si no, un bloque gráfico con el ícono del servicio. */
export function MediaOrIcon({
  src,
  alt,
  icon,
  className = "",
  sizes,
}: {
  src: string | null;
  alt: string;
  icon: IconName;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-brand-900 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          <FiberPattern className="opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-accent-400">
            <ServiceIcon name={icon} className="h-12 w-12" />
          </div>
        </>
      )}
    </div>
  );
}
