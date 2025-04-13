import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const isVercelPreview = hostname.includes("vercel.app");

  // Verificar se é uma rota pública
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/" // Não processar a rota raiz, deixar o page.tsx cuidar disso
  ) {
    return NextResponse.next();
  }

  // Verificar token de autenticação
  const token = request.cookies.get("authToken")?.value;
  const tenantId = request.cookies.get("x-tenant")?.value || request.cookies.get("tenantId")?.value;

  // Se não há token ou tenantId, redirecionar para login
  if (!token || !tenantId) {
    // Salvar a URL atual como callback para retornar após login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Em desenvolvimento local ou em um subdomínio, continuar a requisição
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir rotas específicas do middleware
    "/((?!_next|api|static|login|sign-up|forgot-password|favicon.ico).*)",
  ],
};
