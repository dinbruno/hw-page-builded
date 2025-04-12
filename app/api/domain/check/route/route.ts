import { NextResponse } from "next/server";

// Esta rota específica captura solicitações para /api/domain/check/ (com barra no final)
// e redireciona para a rota correta sem barra no final

export async function GET() {
  return NextResponse.redirect(new URL("/api/domain/check", process.env.NEXT_PUBLIC_MAIN_DOMAIN || "https://hycloud.vercel.app"));
}

export async function POST(request: Request) {
  try {
    // Capturar o corpo da requisição
    const body = await request.text();

    // Criar uma nova URL sem a barra final
    const correctUrl = new URL("/api/domain/check", process.env.NEXT_PUBLIC_MAIN_DOMAIN || "https://hycloud.vercel.app");

    // Criar uma nova requisição para a URL correta
    const newRequest = new Request(correctUrl, {
      method: "POST",
      headers: request.headers,
      body,
    });

    // Encaminhar a requisição para a API real
    const response = await fetch(newRequest);
    return response;
  } catch (error) {
    console.error("Erro ao redirecionar requisição POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar requisição. Por favor, use /api/domain/check (sem barra final)",
      },
      { status: 500 }
    );
  }
}
