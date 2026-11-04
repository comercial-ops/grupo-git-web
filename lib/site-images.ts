// Fotos reales de GRUPO GIT para la landing y el portafolio.
//
// Mientras una entrada sea `null`, el sitio muestra un diseño gráfico de marca
// (sin fotos de stock). Para usar una foto real:
//   1. Copia el archivo a `public/images/` (ej. public/images/hero.jpg)
//   2. Cambia el `null` por la ruta, ej.  hero: "/images/hero.jpg"
//
// Tamaños recomendados: hero 1920x1080, tarjetas 1200x800 (horizontal).

export const siteImages: Record<
  "hero" | "engineering" | "otdrFusion" | "training" | "team",
  string | null
> = {
  hero: null, // Portada: servicios de ingeniería / infraestructura
  engineering: null, // Ingeniería en campo
  otdrFusion: null, // Equipos OTDR y fusionadoras
  training: null, // Personas en entrenamiento técnico
  team: null, // Equipo de GRUPO GIT en acción
};
