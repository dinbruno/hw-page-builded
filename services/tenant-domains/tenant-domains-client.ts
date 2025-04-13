/**
 * Cliente para o serviço de domínios de tenant
 * Este arquivo deve ser importado no frontend para comunicação com o backend
 */

// Tipos de dados
export interface TenantDomainResponse {
  url: string;
  success: boolean;
  message?: string;
}

export interface TenantDomainListResponse {
  domains: string[];
  success: boolean;
}

/**
 * Serviço cliente para gerenciar os domínios específicos por tenant
 */
export class TenantDomainsClient {
  // URL base da API
  private static API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD || "http://localhost:4000";

  /**
   * Obtém o token de autenticação do armazenamento local
   * @returns Token de autenticação ou undefined se não encontrado
   */
  private static getAuthToken(): string | undefined {
    try {
      // Tentar obter do cookie primeiro
      if (typeof document !== "undefined") {
        const authCookie = document.cookie.split("; ").find((row) => row.startsWith("authToken="));
        if (authCookie) return authCookie.split("=")[1];
      }

      // Se não encontrar no cookie, tentar no localStorage
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem("authToken") || undefined;
      }

      return undefined;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return undefined;
    }
  }

  /**
   * Obtém o ID do tenant do armazenamento local
   * @returns ID do tenant ou undefined se não encontrado
   */
  private static getTenantId(): string | undefined {
    try {
      // Tentar obter do cookie primeiro
      if (typeof document !== "undefined") {
        const tenantCookie = document.cookie.split("; ").find((row) => row.startsWith("tenantId="));
        if (tenantCookie) return tenantCookie.split("=")[1];
      }

      // Se não encontrar no cookie, tentar no localStorage
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem("tenantId") || undefined;
      }

      return undefined;
    } catch (error) {
      console.error("Error getting tenant ID:", error);
      return undefined;
    }
  }

  /**
   * Adiciona cabeçalhos de autenticação e tenant ID a uma requisição
   * @param headers Cabeçalhos iniciais
   * @param forceIncludeTenantId Forçar inclusão do tenant ID mesmo quando não for fornecido
   * @param tenantIdOverride ID do tenant para sobrescrever o armazenado (opcional)
   * @returns Cabeçalhos com autenticação e tenant ID
   */
  private static addAuthHeaders(
    headers: Record<string, string> = {},
    forceIncludeTenantId = true,
    tenantIdOverride?: string
  ): Record<string, string> {
    const newHeaders = { ...headers };

    // Adicionar token de autenticação se disponível
    const token = this.getAuthToken();
    if (token) {
      newHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("TenantDomainsClient: Token de autenticação não encontrado");
    }

    // Adicionar tenant ID
    const tenantId = tenantIdOverride || this.getTenantId();
    if (tenantId) {
      newHeaders["x-tenant-id"] = tenantId;
      // Log para verificar se o header está sendo adicionado
      console.log("TenantDomainsClient: Adicionando header x-tenant-id", tenantId);
    } else if (forceIncludeTenantId) {
      console.error("TenantDomainsClient: Tenant ID não encontrado. Algumas operações podem falhar.");
    }

    console.log("TenantDomainsClient: Headers finais:", newHeaders);
    return newHeaders;
  }

  /**
   * Gera a URL do subdomínio para um tenant específico sem registrá-la
   * @param workspaceName Nome do workspace (será usado como parte do subdomínio)
   * @param tenantId ID do tenant
   * @returns URL completa para o tenant
   */
  static async generateTenantUrl(workspaceName: string, tenantId: string): Promise<string> {
    try {
      console.log("TenantDomainsClient: Gerando URL para tenant", {
        workspaceName,
        tenantId,
        API_URL: this.API_URL,
      });

      if (!this.API_URL) {
        // Se API_URL não estiver definida, criar um subdomínio localmente
        console.warn("API_URL não definida, gerando subdomínio localmente");
        return this.createLocalSubdomain(workspaceName, tenantId);
      }

      if (!tenantId) {
        console.error("TenantDomainsClient: tenantId não fornecido");
        throw new Error("ID do tenant não fornecido. Verifique se você está autenticado corretamente.");
      }

      const headers = this.addAuthHeaders(
        {
          "Content-Type": "application/json",
        },
        true,
        tenantId
      );

      // Verificação adicional para garantir que o header x-tenant-id esteja presente
      if (!headers["x-tenant-id"]) {
        console.error("TenantDomainsClient: Header x-tenant-id não foi adicionado para generateTenantUrl", headers);
        throw new Error("Header x-tenant-id não foi adicionado. Verifique o ID do tenant.");
      }

      const response = await fetch(`${this.API_URL}/tenant-domains/generate-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ workspaceName, tenantId }),
      });

      console.log("TenantDomainsClient: Resposta da API de geração de URL", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        console.error("TenantDomainsClient: Erro na resposta ao gerar URL:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("TenantDomainsClient: URL gerada com sucesso:", data.url);

      if (!data.url) {
        throw new Error("A API retornou uma resposta sem URL.");
      }

      return data.url;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao gerar URL do tenant:", error);

      // Se o erro for relacionado à falta de headers, não usar fallback
      if (error instanceof Error && (error.message.includes("Header x-tenant-id") || error.message.includes("ID do tenant não fornecido"))) {
        throw error;
      }

      // Fallback para um formato padrão se houver outro tipo de erro
      return this.createLocalSubdomain(workspaceName, tenantId);
    }
  }

  /**
   * Cria um subdomínio local baseado no nome do workspace e ID do tenant
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns URL formatada para o tenant
   */
  private static createLocalSubdomain(workspaceName: string, tenantId: string): string {
    // Normalizar o nome do workspace para um formato válido de subdomínio
    const normalizedName = workspaceName
      ? workspaceName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      : "tenant";

    // Usar os primeiros 8 caracteres do ID do tenant
    const shortTenantId = tenantId ? tenantId.substring(0, 8) : "default";

    // Criar o nome do subdomínio
    const subdomainName = `${normalizedName}-${shortTenantId}`;

    // Usar o nome do projeto da Vercel ou "app" como fallback
    const projectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "app";

    console.log(`TenantDomainsClient: Criando subdomínio local: ${subdomainName}.${projectName}.vercel.app`);
    console.log(`TenantDomainsClient: ATENÇÃO - Esta URL é um fallback e pode não funcionar corretamente sem o registro adequado.`);
    console.log(`TenantDomainsClient: Variáveis de ambiente disponíveis:`, {
      NEXT_PUBLIC_API_CORE_URL_PROD: process.env.NEXT_PUBLIC_API_CORE_URL_PROD,
      NEXT_PUBLIC_VERCEL_PROJECT_NAME: process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME,
    });

    return `https://${subdomainName}.${projectName}.vercel.app`;
  }

  /**
   * Registra um novo domínio na Vercel para um tenant específico
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @param forceDomainCreation Forçar criação mesmo em ambiente de desenvolvimento
   * @returns Objeto com a URL do domínio registrado e status da operação
   */
  static async registerTenantDomain(workspaceName: string, tenantId: string, forceDomainCreation = false): Promise<TenantDomainResponse> {
    try {
      console.log("TenantDomainsClient: Tentando registrar domínio para", {
        workspaceName,
        tenantId,
        API_URL: this.API_URL,
      });

      if (!this.API_URL) {
        console.error("TenantDomainsClient: API_URL não definida");
        throw new Error("API_URL não está definida. Verifique as variáveis de ambiente.");
      }

      if (!tenantId) {
        console.error("TenantDomainsClient: tenantId não fornecido");
        throw new Error("ID do tenant não fornecido. Verifique se você está autenticado corretamente.");
      }

      const headers = this.addAuthHeaders(
        {
          "Content-Type": "application/json",
        },
        true,
        tenantId
      );

      // Verificação adicional para garantir que o header x-tenant-id esteja presente
      if (!headers["x-tenant-id"]) {
        console.error("TenantDomainsClient: Header x-tenant-id não foi adicionado corretamente", headers);
        throw new Error("Header x-tenant-id não foi adicionado. Verifique o ID do tenant.");
      }

      const response = await fetch(`${this.API_URL}/tenant-domains/register`, {
        method: "POST",
        headers,
        body: JSON.stringify({ workspaceName, tenantId, forceDomainCreation }),
      });

      console.log("TenantDomainsClient: Resposta da API de registro", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("TenantDomainsClient: Domínio registrado com sucesso:", result);
      return result;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao registrar domínio:", error);

      // Se o erro for relacionado à falta de headers, propagar o erro
      if (
        error instanceof Error &&
        (error.message.includes("Header x-tenant-id") ||
          error.message.includes("ID do tenant não fornecido") ||
          error.message.includes("API_URL não está definida"))
      ) {
        throw error;
      }

      // Apenas resposta de fallback se não for erro crítico
      return {
        url: "erro-de-registro.vercel.app", // URL inválida para indicar erro
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao registrar domínio",
      };
    }
  }

  /**
   * Obtém o domínio de um tenant ou tenta registrá-lo se não existir
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @param forceDomainCreation Forçar criação mesmo em ambiente de desenvolvimento
   * @returns URL completa do domínio do tenant
   */
  static async getOrRegisterTenantDomain(workspaceName: string, tenantId: string, forceDomainCreation = false): Promise<string> {
    try {
      console.log("TenantDomainsClient: Obtendo ou registrando domínio para", {
        workspaceName,
        tenantId,
        API_URL: this.API_URL,
      });

      if (!this.API_URL) {
        console.error("TenantDomainsClient: API_URL não definida, usando URL padrão");
        throw new Error("API_URL não está definida. Verifique as variáveis de ambiente.");
      }

      if (!tenantId) {
        console.error("TenantDomainsClient: tenantId não fornecido");
        throw new Error("ID do tenant não fornecido. Verifique se você está autenticado corretamente.");
      }

      const headers = this.addAuthHeaders(
        {
          "Content-Type": "application/json",
        },
        true,
        tenantId
      );

      // Verificação adicional para garantir que o header x-tenant-id esteja presente
      if (!headers["x-tenant-id"]) {
        console.error("TenantDomainsClient: Header x-tenant-id não foi adicionado corretamente", headers);
        throw new Error("Header x-tenant-id não foi adicionado. Verifique o ID do tenant.");
      }

      const response = await fetch(`${this.API_URL}/tenant-domains/get-or-register`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          workspaceName,
          tenantId,
          forceDomainCreation,
        }),
      });

      console.log("TenantDomainsClient: Resposta da API", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        console.error("TenantDomainsClient: Resposta não OK:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("TenantDomainsClient: Domínio obtido com sucesso:", data.url);

      if (!data.url) {
        throw new Error("A API retornou uma resposta sem URL.");
      }

      return data.url;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao obter domínio:", error);

      // Se o erro for relacionado à falta de headers, não tentar fallback
      if (error instanceof Error && (error.message.includes("Header x-tenant-id") || error.message.includes("ID do tenant não fornecido"))) {
        throw error;
      }

      // Tentar registrar diretamente se a primeira chamada falhar
      try {
        console.log("TenantDomainsClient: Tentando registrar domínio como fallback");
        const registerResult = await this.registerTenantDomain(workspaceName, tenantId, true);
        if (registerResult.success) {
          console.log("TenantDomainsClient: Domínio registrado com sucesso como fallback:", registerResult.url);
          return registerResult.url;
        } else {
          console.error("TenantDomainsClient: Registro de domínio falhou:", registerResult.message);
          throw new Error(`Falha ao registrar domínio: ${registerResult.message}`);
        }
      } catch (registerError) {
        console.error("TenantDomainsClient: Erro ao registrar domínio como fallback:", registerError);
        throw new Error(registerError instanceof Error ? registerError.message : "Erro desconhecido ao registrar domínio");
      }
    }
  }

  /**
   * Verifica se um domínio existe na Vercel
   * @param domainName Nome do domínio a verificar
   * @returns true se o domínio existir, false caso contrário
   */
  static async checkDomainExists(domainName: string): Promise<boolean> {
    try {
      console.log("TenantDomainsClient: Verificando se domínio existe:", domainName);

      const response = await fetch(`${this.API_URL}/tenant-domains/check`, {
        method: "POST",
        headers: this.addAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ domainName }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar domínio: ${response.statusText}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao verificar domínio:", error);
      return false;
    }
  }

  /**
   * Verifica se a URL atual corresponde ao subdomínio específico do tenant
   * @param currentUrl URL atual
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   * @returns True se estiver no subdomínio correto, false caso contrário
   */
  static async isCorrectTenantDomain(currentUrl: string, workspaceName: string, tenantId: string): Promise<boolean> {
    try {
      console.log("TenantDomainsClient: Verificando se URL corresponde ao tenant:", { currentUrl });

      const response = await fetch(`${this.API_URL}/tenant-domains/check-correct-domain`, {
        method: "POST",
        headers: this.addAuthHeaders(
          {
            "Content-Type": "application/json",
          },
          true,
          tenantId
        ),
        body: JSON.stringify({ currentUrl, workspaceName, tenantId }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar correspondência de domínio: ${response.statusText}`);
      }

      const data = await response.json();
      return data.isCorrect;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao verificar domínio do tenant:", error);
      return false;
    }
  }

  /**
   * Lista todos os domínios associados ao projeto na Vercel
   * @returns Lista de domínios
   */
  static async listAllDomains(): Promise<string[]> {
    try {
      console.log("TenantDomainsClient: Listando todos os domínios");

      const response = await fetch(`${this.API_URL}/tenant-domains/list`, {
        method: "GET",
        headers: this.addAuthHeaders({
          "Content-Type": "application/json",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar domínios: ${response.statusText}`);
      }

      const data = await response.json();
      return data.domains;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao listar domínios:", error);
      return [];
    }
  }

  /**
   * Exemplo de uso do cliente no frontend
   * @param workspaceName Nome do workspace
   * @param tenantId ID do tenant
   */
  static async example(workspaceName: string, tenantId: string): Promise<void> {
    try {
      // 1. Gerar uma URL para o tenant (sem criar domínio)
      const generatedUrl = await this.generateTenantUrl(workspaceName, tenantId);
      console.log("URL gerada:", generatedUrl);

      // 2. Verificar se o domínio já existe
      const normalizedName = workspaceName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const domainName = `${normalizedName}-${tenantId.substring(0, 8)}.vercel.app`;
      const exists = await this.checkDomainExists(domainName);
      console.log(`O domínio ${domainName} existe? ${exists}`);

      // 3. Registrar domínio ou usar existente
      if (exists) {
        console.log("Domínio já existe, usando-o");
      } else {
        console.log("Tentando registrar novo domínio");
        const registerResult = await this.registerTenantDomain(workspaceName, tenantId, true);
        console.log("Resultado do registro:", registerResult);
      }

      // 4. Obter o domínio final (registrado ou não)
      const finalUrl = await this.getOrRegisterTenantDomain(workspaceName, tenantId);
      console.log("URL final do tenant:", finalUrl);

      // 5. Verificar se o usuário está no domínio correto
      const currentUrl = window.location.href;
      const isCorrectDomain = await this.isCorrectTenantDomain(currentUrl, workspaceName, tenantId);
      console.log(`O usuário está no domínio correto? ${isCorrectDomain}`);

      if (!isCorrectDomain) {
        console.log(`Redirecionando para o domínio correto: ${finalUrl}`);
        // window.location.href = finalUrl; // Descomente para redirecionar
      }
    } catch (error) {
      console.error("Erro no exemplo de uso:", error);
    }
  }
}
