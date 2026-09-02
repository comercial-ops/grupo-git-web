import Image from "next/image";
import type { Product } from "@/lib/types";
import { buildWhatsAppLink, formatCOP } from "@/lib/whatsapp";
import WhatsAppButton from "./WhatsAppButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-brand-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-brand-500/60">
            Sin foto
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand-950/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent-400">
          Ref. {product.reference}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-brand-950">
          {product.name}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm text-brand-700/80">
          {product.description}
        </p>
        <p className="text-lg font-bold text-brand-800">
          {formatCOP(product.price)}
        </p>
        <WhatsAppButton href={buildWhatsAppLink(product)} className="mt-2 w-full" />
      </div>
    </article>
  );
}
