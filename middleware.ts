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
    pathname === "/forgot-password" ||
    pathname === "/_root-handler"
  ) {
    return NextResponse.next();
  }

  // Verificar token de autenticação
  const token = request.cookies.get("authToken")?.value;
  const tenantId = request.cookies.get("tenantId")?.value;

  // Se não há token ou tenantId, redirecionar para login
  if (!token || !tenantId) {
    // Salvar a URL atual como callback para retornar após login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Se está na rota raiz (/), redirecionar para o handler específico que trata essa rota
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/_root-handler", request.url));
  }

  // Continuar com a requisição para todas as outras rotas autenticadas
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_root-handler|favicon.ico).*)"],
};
