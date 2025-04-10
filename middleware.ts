import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota pública
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password"
  ) {
    return NextResponse.next();
  }

  // Verificar token de autenticação
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // Redirecionar para login se não estiver autenticado
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Verificar se o usuário tem acesso ao tenant e workspace
  const tenantId = request.cookies.get("tenantId")?.value;

  if (!tenantId && !pathname.startsWith("/onboarding")) {
    // Redirecionar para onboarding se não tiver tenant configurado
    return NextResponse.redirect(new URL("/onboarding/welcome", request.url));
  }

  // Continuar com a requisição
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
