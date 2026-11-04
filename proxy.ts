import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

// Rutas que requieren sesión: panel de admin e inventario interno.
export const config = {
  matcher: ["/admin/:path*", "/inventario/:path*"],
};
