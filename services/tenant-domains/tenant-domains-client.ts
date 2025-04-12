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
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
      });

      const response = await fetch(`${this.API_URL}/tenant-domains/generate-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceName, tenantId }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao gerar URL do tenant:", error);
      // Fallback para um formato padrão se houver erro
      return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "app"}.vercel.app`;
    }
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
      });

      const response = await fetch(`${this.API_URL}/tenant-domains/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceName, tenantId, forceDomainCreation }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro $ {response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao registrar domínio:", error);
      return {
        url: await this.generateTenantUrl(workspaceName, tenantId),
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
      });

      const response = await fetch(`${this.API_URL}/tenant-domains/get-or-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceName,
          tenantId,
          forceDomainCreation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter domínio: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("TenantDomainsClient: Erro ao obter domínio:", error);
      return this.generateTenantUrl(workspaceName, tenantId);
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
