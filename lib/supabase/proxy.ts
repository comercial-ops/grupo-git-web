import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch {
    // Si Supabase aún no está configurado (o no responde), se trata como
    // sesión anónima: las rutas /admin redirigen a login en vez de tumbar la app.
  }

  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  // Rutas internas: panel de admin e inventario (solo con sesión).
  const isProtected =
    !isLoginRoute && (pathname.startsWith("/admin") || pathname.startsWith("/inventario"));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const next = request.nextUrl.searchParams.get("next") ?? "";
    const url = request.nextUrl.clone();
    url.search = "";
    url.pathname = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
