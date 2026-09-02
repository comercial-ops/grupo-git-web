const WHATSAPP_NUMBER = "573128953243";

type WhatsAppProduct = {
  name: string;
  reference: string;
  description: string;
};

export function buildWhatsAppLink(product: WhatsAppProduct) {
  const text = [
    "Hola GRUPO GIT, estoy interesado en este equipo:",
    `*${product.name}* (Ref: ${product.reference})`,
    product.description,
    "¿Me pueden dar más información?",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppContactLink(message?: string) {
  const text = message ?? "Hola GRUPO GIT, quisiera más información sobre sus servicios.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function formatCOP(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}
