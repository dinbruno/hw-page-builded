import { TenantDomainsService } from "@/services/tenant-domains/tenant-domains.service";
import { NextResponse } from "next/server";

// Forçar criação de domínios independente do ambiente
global.__FORCE_DOMAIN_CREATION = true;

export async function POST(request: Request) {
  try {
    // Obter os dados da solicitação
    const { workspaceName, tenantId } = await request.json();

    // Validar parâmetros
    if (!workspaceName || !tenantId) {
      return NextResponse.json(
        {
          success: false,
          message: "workspaceName e tenantId são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Logs detalhados de ambiente - para DIAGNOSTICAR porque o código não está criando domínios
    console.log("[API] Verificando disponibilidade do domínio para", { workspaceName, tenantId });
    console.log("[API] Variáveis de ambiente:", {
      nodeEnv: process.env.NODE_ENV,
      envFile: "production", // do arquivo .env
      forceDomainCreation: global.__FORCE_DOMAIN_CREATION || false,
      isClient: typeof window !== "undefined",
    });
    console.log("[API] Forçando criação de domínio independente do ambiente");

    try {
      // Tentar registrar o domínio específico para o tenant
      const domainResult = await TenantDomainsService.registerTenantDomain(workspaceName, tenantId);

      console.log("[API] Resultado do registro de domínio:", domainResult);

      // Retornar o resultado real, sem modificar
      return NextResponse.json({
        ...domainResult,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[API] Erro no serviço de domínios:", error);

      // Retornar erro para que o cliente saiba que houve problema
      const projectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded";
      return NextResponse.json({
        url: `https://${projectName}.vercel.app`,
        success: false,
        message: error.message || "Erro ao criar domínio específico para o tenant",
      });
    }
  } catch (error: any) {
    console.error("[API] Erro na rota de verificação de domínio:", error);
    return NextResponse.json(
      {
        success: false,
        url: `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded"}.vercel.app`,
        message: error.message || "Erro na requisição de verificação de domínio",
      },
      { status: 500 }
    );
  }
}
