// Imágenes de stock (Unsplash) usadas como placeholder temporal en la landing
// y el portafolio, mientras se integran fotos reales de GRUPO GIT.
// TODO: reemplazar cada URL por una foto real de la empresa cuando esté disponible.

function unsplash(id: string, params = "w=1600&q=80&auto=format&fit=crop") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

export const stockImages = {
  heroLanding: unsplash("1573164713988-8665fc963095"),
  serviceEngineering: unsplash("1621905251189-08b45d6a269e"),
  serviceOtdrFusion: unsplash("1581092335397-9583eb92d232"),
  serviceTraining: unsplash("1523240795612-9a054b0db644"),
  teamInAction: unsplash("1581091226825-a6a2a5aee158"),
  portfolioHero: unsplash("1581092918056-0c4c3acd3789"),
  trainingSecondary: unsplash("1552664730-d307ca884978"),
};
