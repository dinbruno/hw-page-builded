/**
 * Serviço para gerenciar os domínios específicos por tenant
 */
export class TenantDomainsService {
  // URL base da aplicação na Vercel (sem protocolo)
  private static BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "vercel.app";
  // Projeto base da Vercel
  private static PROJECT_NAME = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded";

  // Cache para armazenar os domínios já registrados (em produção seria um banco de dados)
  private static registeredDomains: Record<string, string> = {};

  /**
   * Gera a URL do subdomínio para um tenant específico
   * @param workspaceName Nome do workspace (será usado como parte do subdomínio)
   * @param tenantId ID do tenant
   * @returns URL completa para o tenant
   */
  static generateTenantUrl(workspaceName: string, tenantId: string): string {
    // Normaliza o nome do workspace para uso no subdomínio
    const normalizedName = this.normalizeSubdomainName(workspaceName);

    // Cria o identificador único para este tenant
    const tenantIdentifier = `${normalizedName}-${tenantId.substring(0, 8)}`;

    // Se o domínio já estiver registrado, use-o
    if (this.registeredDomains[tenantId]) {
      return `https://${this.registeredDomains[tenantId]}`;
    }

    // Caso contrário, gere um novo usando o padrão da Vercel
    // Formato: nome-workspace-id.projeto.vercel.app
    const subdomain = `${tenantIdentifier}.${this.PROJECT_NAME}.${this.BASE_DOMAIN}`;

    // Armazenar o domínio gerado no cache (em produção, salvar no banco de dados)
    this.registeredDomains[tenantId] = subdomain;

    // Retorna a URL completa
    return `https://${subdomain}`;
  }

  /**
   * Registra um novo subdomínio para um tenant
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns URL do subdomínio registrado
   */
  static async registerTenantDomain(workspaceName: string, tenantId: string): Promise<string> {
    // Verificar se já existe um domínio registrado para este tenant
    if (this.registeredDomains[tenantId]) {
      return `https://${this.registeredDomains[tenantId]}`;
    }

    // Normaliza o nome do workspace
    const normalizedName = this.normalizeSubdomainName(workspaceName);

    // Gerar identificador único para o tenant
    const tenantIdentifier = `${normalizedName}-${tenantId.substring(0, 8)}`;

    // Na Vercel, cada deploy já gera automaticamente um subdomínio único
    // No formato: projeto-git-branch-username.vercel.app
    // Como estamos usando um único deploy, vamos simular isso com o padrão da Vercel
    const subdomain = `${tenantIdentifier}.${this.PROJECT_NAME}.${this.BASE_DOMAIN}`;

    // Armazenar o domínio no cache (em produção, salvar no banco de dados)
    this.registeredDomains[tenantId] = subdomain;

    console.log(`Subdomínio registrado para tenant ${tenantId}: ${subdomain}`);

    return `https://${subdomain}`;
  }

  /**
   * Normaliza um nome para uso em subdomínio
   * @param name Nome a ser normalizado
   * @returns Nome normalizado
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
   * @param currentUrl URL atual
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns True se estiver no subdomínio correto, false caso contrário
   */
  static isCorrectTenantDomain(currentUrl: string, workspaceName: string, tenantId: string): boolean {
    try {
      const url = new URL(currentUrl);

      // Se temos um domínio registrado, use-o para comparação
      if (this.registeredDomains[tenantId]) {
        return url.hostname === this.registeredDomains[tenantId];
      }

      // Se não, compare com o que seria gerado
      const expectedUrl = new URL(this.generateTenantUrl(workspaceName, tenantId));
      return url.hostname === expectedUrl.hostname;
    } catch (error) {
      console.error("Erro ao verificar domínio do tenant:", error);
      return false;
    }
  }

  /**
   * Obtém o subdomínio registrado para um tenant ou registra um novo se não existir
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns URL do subdomínio para o tenant
   */
  static async getOrRegisterTenantDomain(workspaceName: string, tenantId: string): Promise<string> {
    // Verificar se já temos um domínio registrado
    if (this.registeredDomains[tenantId]) {
      return `https://${this.registeredDomains[tenantId]}`;
    }

    // Caso contrário, registrar um novo
    return await this.registerTenantDomain(workspaceName, tenantId);
  }
}
