/**
 * Serviço para gerenciar os domínios específicos por tenant
 */
import { TenantDomainsClient } from "./tenant-domains-client";

export class TenantDomainsService {
  // Vercel API configuration
  private static VERCEL_API_URL = "https://api.vercel.com";
  private static VERCEL_TOKEN = process.env.VERCEL_TOKEN || "";
  private static PROJECT_ID = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID || "prj_vLLPha8ERTKu03ficCGNAIuBqHpv";
  private static TEAM_ID = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID || "";

  // URL base da aplicação na Vercel (sem protocolo)
  private static BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "vercel.app";

  // Cache para armazenar os domínios já registrados (em produção seria um banco de dados)
  private static registeredDomains: Record<string, string> = {};

  /**
   * Gera a URL do subdomínio para um tenant específico
   * @deprecated Use TenantDomainsClient.generateTenantUrl
   */
  static generateTenantUrl(workspaceName: string, tenantId: string): string {
    console.warn("TenantDomainsService.generateTenantUrl está deprecado. Use TenantDomainsClient.generateTenantUrl");
    // Retornamos uma URL síncrona como fallback
    const projectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded";
    return `https://${projectName}.vercel.app`;
  }

  /**
   * Registra um novo domínio na Vercel para um tenant específico
   * @deprecated Use TenantDomainsClient.registerTenantDomain
   */
  static async registerTenantDomain(workspaceName: string, tenantId: string): Promise<{ url: string; success: boolean; message?: string }> {
    console.warn("TenantDomainsService.registerTenantDomain está deprecado. Use TenantDomainsClient.registerTenantDomain");
    return TenantDomainsClient.registerTenantDomain(workspaceName, tenantId, true);
  }

  /**
   * Verifica se um domínio existe na Vercel
   * @deprecated Use TenantDomainsClient.checkDomainExists
   */
  static async checkDomainExists(domainName: string): Promise<boolean> {
    console.warn("TenantDomainsService.checkDomainExists está deprecado. Use TenantDomainsClient.checkDomainExists");
    return TenantDomainsClient.checkDomainExists(domainName);
  }

  /**
   * Normaliza um nome para uso em subdomínio
   * @deprecated Use funções utilitárias específicas
   */
  private static normalizeSubdomainName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/[^a-z0-9-]/g, "") // Remove caracteres não alfanuméricos
      .replace(/-+/g, "-") // Remove hífens duplicados
      .replace(/^-|-$/g, ""); // Remove hífens no início e fim
  }

  /**
   * Verifica se a URL atual corresponde ao subdomínio específico do tenant
   * @deprecated Use TenantDomainsClient.isCorrectTenantDomain
   */
  static async isCorrectTenantDomain(currentUrl: string, workspaceName: string, tenantId: string): Promise<boolean> {
    console.warn("TenantDomainsService.isCorrectTenantDomain está deprecado. Use TenantDomainsClient.isCorrectTenantDomain");
    return TenantDomainsClient.isCorrectTenantDomain(currentUrl, workspaceName, tenantId);
  }

  /**
   * Obtém o domínio de um tenant ou tenta registrá-lo se não existir
   * @deprecated Use TenantDomainsClient.getOrRegisterTenantDomain
   */
  static async getOrRegisterTenantDomain(workspaceName: string, tenantId: string): Promise<string> {
    console.warn("TenantDomainsService.getOrRegisterTenantDomain está deprecado. Use TenantDomainsClient.getOrRegisterTenantDomain");
    return TenantDomainsClient.getOrRegisterTenantDomain(workspaceName, tenantId, true);
  }

  /**
   * Lista todos os domínios associados ao projeto na Vercel
   * @deprecated Use TenantDomainsClient.listAllDomains
   */
  static async listAllDomains(): Promise<string[]> {
    console.warn("TenantDomainsService.listAllDomains está deprecado. Use TenantDomainsClient.listAllDomains");
    return TenantDomainsClient.listAllDomains();
  }
}
