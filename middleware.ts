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

  // Verificar se estamos em produção e se é o domínio principal
  const isMainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN && hostname === process.env.NEXT_PUBLIC_MAIN_DOMAIN;

  // Se for o domínio principal e não for em localhost, redirecionar para o subdomínio do tenant
  if (isMainDomain && !isLocalhost && pathname === "/") {
    // Este bloco será executado apenas se estamos na raiz do domínio principal
    return NextResponse.rewrite(new URL("/_root-handler", request.url));
  }

  // Em desenvolvimento local ou em um subdomínio, continuar a requisição
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_root-handler|favicon.ico).*)"],
};
