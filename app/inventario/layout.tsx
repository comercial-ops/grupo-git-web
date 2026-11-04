import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario | GRUPO GIT",
  robots: { index: false, follow: false },
};

export default function InventarioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
