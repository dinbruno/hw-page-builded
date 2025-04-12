/**
 * Serviço para gerenciar os domínios específicos por tenant
 */
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
   * @param workspaceName Nome do workspace (será usado como parte do subdomínio)
   * @param tenantId ID do tenant
   * @returns URL completa para o tenant
   */
  static generateTenantUrl(workspaceName: string, tenantId: string): string {
    console.log("TenantDomains: Gerando URL para tenant", { workspaceName, tenantId, baseDomain: this.BASE_DOMAIN });

    // Normaliza o nome do workspace para uso no subdomínio
    const normalizedName = this.normalizeSubdomainName(workspaceName);

    // Cria o identificador único para este tenant
    const tenantSubdomain = `${normalizedName}-${tenantId.substring(0, 8)}`;

    // Se o domínio já estiver registrado, use-o
    if (this.registeredDomains[tenantId]) {
      console.log("TenantDomains: Usando domínio registrado:", this.registeredDomains[tenantId]);
      return `https://${this.registeredDomains[tenantId]}`;
    }

    // Nome do projeto na Vercel
    const projectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded";

    // Em ambiente de desenvolvimento, usar o domínio do preview da Vercel
    const domain = `${projectName}.vercel.app`;
    console.log("TenantDomains: Usando domínio padrão:", domain);

    // Retorna a URL completa
    return `https://${domain}`;
  }

  /**
   * Registra um novo domínio na Vercel para um tenant específico
   * Nota: Este método só deve ser chamado no lado do servidor
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns Objeto com a URL do domínio registrado e status da operação
   */
  static async registerTenantDomain(workspaceName: string, tenantId: string): Promise<{ url: string; success: boolean; message?: string }> {
    console.log("TenantDomains: Tentando registrar domínio para", { workspaceName, tenantId });

    // Verificar variáveis de ambiente e flags
    const forceDomainCreation = typeof global !== "undefined" && (global as any).__FORCE_DOMAIN_CREATION === true;
    console.log("TenantDomains: Ambiente de registro:", {
      nodeEnv: process.env.NODE_ENV,
      forceDomainCreation: forceDomainCreation,
      isServer: typeof window === "undefined",
    });

    // Verificar ambiente - ignorar verificação quando estamos forçando a criação de domínios
    if (typeof window !== "undefined" && !forceDomainCreation) {
      console.error("TenantDomains: registerTenantDomain deve ser chamado apenas no lado do servidor");
      return {
        url: this.generateTenantUrl(workspaceName, tenantId),
        success: false,
        message: "Este método deve ser chamado apenas no servidor",
      };
    }

    // Verificar se já existe um domínio registrado para este tenant
    if (this.registeredDomains[tenantId]) {
      console.log("TenantDomains: Domínio já registrado:", this.registeredDomains[tenantId]);
      return {
        url: `https://${this.registeredDomains[tenantId]}`,
        success: true,
      };
    }

    // Verificar se o token da Vercel está configurado
    if (!this.VERCEL_TOKEN) {
      console.error("TenantDomains: Token da Vercel não configurado corretamente. Verifique a variável de ambiente VERCEL_TOKEN.");
      console.log("TenantDomains: Token atual:", this.VERCEL_TOKEN || "vazio/undefined");
      return {
        url: this.generateTenantUrl(workspaceName, tenantId),
        success: false,
        message: "Token da Vercel não configurado",
      };
    }

    console.log("TenantDomains: Configuração atual:", {
      token: this.VERCEL_TOKEN ? "Configurado" : "Não configurado",
      projectId: this.PROJECT_ID,
      teamId: this.TEAM_ID || "Não configurado",
      baseDomain: this.BASE_DOMAIN,
    });

    // Normaliza o nome do workspace para uso no domínio
    const normalizedName = this.normalizeSubdomainName(workspaceName);

    // Criar o nome do domínio para o tenant - FORÇAR USO DO SUBDOMÍNIO
    const domainName = `${normalizedName}-${tenantId.substring(0, 8)}.${this.BASE_DOMAIN}`;
    console.log("TenantDomains: Tentando criar domínio:", domainName);

    try {
      // Construir a URL da API com ou sem Team ID
      let apiUrl = `${this.VERCEL_API_URL}/v9/projects/${this.PROJECT_ID}/domains`;
      if (this.TEAM_ID) {
        apiUrl += `?teamId=${this.TEAM_ID}`;
      }
      console.log("TenantDomains: URL da API:", apiUrl);

      // Fazer a solicitação para a API da Vercel
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domainName,
        }),
      });

      // Log adicional para verificar a resposta completa
      console.log("TenantDomains: Resposta da API Status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: { message: "Não foi possível ler o corpo da resposta" } };
        }

        console.error("TenantDomains: Erro ao criar domínio:", errorData);
        console.error("TenantDomains: Código de status:", response.status);
        console.error("TenantDomains: Mensagem de erro:", errorData.error?.message || response.statusText);

        // Se for um erro que o domínio já existe, vamos considerá-lo como sucesso
        if (response.status === 409 || (errorData.error && errorData.error.code === "domain_already_exists")) {
          console.log("TenantDomains: Domínio já existia, usando-o");
          this.registeredDomains[tenantId] = domainName;
          return {
            url: `https://${domainName}`,
            success: true,
            message: "Domínio já existente",
          };
        }

        throw new Error(errorData.error?.message || "Erro ao criar domínio");
      }

      const data = await response.json();
      console.log("TenantDomains: Domínio criado com sucesso:", data);

      // Armazenar o domínio no cache
      this.registeredDomains[tenantId] = domainName;

      // Retornar a URL completa
      return {
        url: `https://${domainName}`,
        success: true,
      };
    } catch (error) {
      console.error("TenantDomains: Erro ao registrar domínio:", error);

      // Retornar erro, não o domínio padrão
      return {
        url: this.generateTenantUrl(workspaceName, tenantId),
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao registrar domínio",
      };
    }
  }

  /**
   * Verifica se um domínio existe na Vercel
   * Nota: Este método só deve ser chamado no lado do servidor
   * @param domainName Nome do domínio a verificar
   * @returns true se o domínio existir, false caso contrário
   */
  static async checkDomainExists(domainName: string): Promise<boolean> {
    console.log("TenantDomains: Verificando se domínio existe:", domainName);

    // Verificar ambiente - apenas executar no servidor
    if (typeof window !== "undefined") {
      console.error("TenantDomains: checkDomainExists deve ser chamado apenas no lado do servidor");
      return false;
    }

    // Verificar se o token da Vercel está configurado
    if (!this.VERCEL_TOKEN) {
      console.error("TenantDomains: Token da Vercel não configurado corretamente. Verifique a variável de ambiente VERCEL_TOKEN.");
      return false;
    }

    try {
      // Construir a URL da API com ou sem Team ID
      let apiUrl = `${this.VERCEL_API_URL}/v9/projects/${this.PROJECT_ID}/domains/${domainName}`;
      if (this.TEAM_ID) {
        apiUrl += `?teamId=${this.TEAM_ID}`;
      }
      console.log("TenantDomains: URL da API de verificação:", apiUrl);

      // Fazer a solicitação para a API da Vercel
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.VERCEL_TOKEN}`,
        },
      });

      // Se a resposta for 200, o domínio existe
      const exists = response.status === 200;
      console.log("TenantDomains: Domínio existe?", exists, "Status:", response.status);
      return exists;
    } catch (error) {
      console.error("TenantDomains: Erro ao verificar domínio:", error);
      return false;
    }
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
      console.log("TenantDomains: Verificando se URL corresponde ao tenant:", { currentUrl, hostname: url.hostname });

      // Se temos um domínio registrado, use-o para comparação
      if (this.registeredDomains[tenantId]) {
        return url.hostname === this.registeredDomains[tenantId];
      }

      // Para projeto pessoal sem equipe, pode ser melhor usar o domínio padrão do projeto
      const projectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "hw-page-builded";
      const expectedDomain = `${projectName}.vercel.app`;

      console.log("TenantDomains: Comparando com domínio esperado:", expectedDomain);
      return url.hostname === expectedDomain;
    } catch (error) {
      console.error("TenantDomains: Erro ao verificar domínio do tenant:", error);
      return false;
    }
  }

  /**
   * Obtém o domínio de um tenant ou tenta registrá-lo se não existir
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns URL completa do domínio do tenant
   */
  static async getOrRegisterTenantDomain(workspaceName: string, tenantId: string): Promise<string> {
    console.log("TenantDomains: getOrRegisterTenantDomain", { workspaceName, tenantId });

    // Verificar a flag global de forçar criação
    const forceDomainCreation = typeof global !== "undefined" && (global as any).__FORCE_DOMAIN_CREATION === true;
    console.log("TenantDomains: Verificando ambiente para getOrRegister:", {
      nodeEnv: process.env.NODE_ENV,
      forceDomainCreation,
      isClient: typeof window !== "undefined",
    });

    // Verificar se já existe um domínio registrado para este tenant
    if (this.registeredDomains[tenantId]) {
      console.log("TenantDomains: Usando domínio em cache:", this.registeredDomains[tenantId]);
      return `https://${this.registeredDomains[tenantId]}`;
    }

    // Se estiver no cliente (ou o ambiente for de desenvolvimento) e não estivermos forçando
    // a criação, retornar apenas a URL gerada
    if ((typeof window !== "undefined" || process.env.NODE_ENV !== "production") && !forceDomainCreation) {
      console.log("TenantDomains: Ambiente não é de produção ou está no cliente, retornando URL gerada");
      return this.generateTenantUrl(workspaceName, tenantId);
    }

    try {
      // Tentar registrar o domínio
      console.log("TenantDomains: Tentando registrar domínio");
      const result = await this.registerTenantDomain(workspaceName, tenantId);

      if (result.success) {
        console.log("TenantDomains: Domínio registrado com sucesso:", result.url);
        return result.url;
      } else {
        console.error("TenantDomains: Falha ao registrar domínio, usando URL gerada:", result.message);
        return this.generateTenantUrl(workspaceName, tenantId);
      }
    } catch (error) {
      console.error("TenantDomains: Erro ao tentar registrar domínio:", error);
      return this.generateTenantUrl(workspaceName, tenantId);
    }
  }

  /**
   * Lista todos os domínios associados ao projeto na Vercel
   * Nota: Este método só deve ser chamado no lado do servidor
   * @returns Lista de domínios
   */
  static async listAllDomains(): Promise<string[]> {
    console.log("TenantDomains: Listando todos os domínios");

    // Verificar ambiente - apenas executar no servidor
    if (typeof window !== "undefined") {
      console.error("TenantDomains: listAllDomains deve ser chamado apenas no lado do servidor");
      return [];
    }

    // Verificar se o token da Vercel está configurado
    if (!this.VERCEL_TOKEN) {
      console.error("TenantDomains: Token da Vercel não configurado corretamente. Verifique a variável de ambiente VERCEL_TOKEN.");
      return [];
    }

    try {
      // Construir a URL da API com ou sem Team ID
      let apiUrl = `${this.VERCEL_API_URL}/v9/projects/${this.PROJECT_ID}/domains`;
      if (this.TEAM_ID) {
        apiUrl += `?teamId=${this.TEAM_ID}`;
      }
      console.log("TenantDomains: URL da API de listagem:", apiUrl);

      // Fazer a solicitação para a API da Vercel
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.VERCEL_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error("TenantDomains: Erro ao listar domínios. Status:", response.status);
        throw new Error(`Erro ao listar domínios: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("TenantDomains: Domínios listados com sucesso:", data.domains?.length || 0);
      return data.domains.map((domain: any) => domain.name);
    } catch (error) {
      console.error("TenantDomains: Erro ao listar domínios:", error);
      return [];
    }
  }
}
