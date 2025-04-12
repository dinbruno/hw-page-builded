/**
 * Serviço para integração com a API da Vercel e gerenciamento de builds por tenant
 */

interface VercelDeployment {
  id: string;
  url: string;
  createdAt: string;
  ready: boolean;
  state: string;
}

interface VercelBuild {
  id: string;
  url: string;
  tenantId: string;
  workspaceId?: string;
  ready: boolean;
  createdAt: string;
}

export class VercelService {
  private static VERCEL_API_URL = "https://api.vercel.com";
  private static VERCEL_TOKEN = process.env.VERCEL_API_TOKEN || "";
  private static TEAM_ID = process.env.VERCEL_TEAM_ID || "";
  private static PROJECT_ID = process.env.VERCEL_PROJECT_ID || "";

  // Cache para armazenar os builds já consultados
  private static buildsCache: Record<string, VercelBuild> = {};

  /**
   * Verifica se existe um build específico para o tenant
   * @param tenantId ID do tenant
   * @returns Dados do build ou null se não existir
   */
  static async getTenantBuild(tenantId: string): Promise<VercelBuild | null> {
    // Verificar no cache primeiro
    if (this.buildsCache[tenantId]) {
      return this.buildsCache[tenantId];
    }

    try {
      // Consulta na API da Vercel pelos deployments que contêm o tenantId no nome
      const response = await fetch(`${this.VERCEL_API_URL}/v6/deployments?teamId=${this.TEAM_ID}&meta-tenantId=${tenantId}`, {
        headers: {
          Authorization: `Bearer ${this.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao consultar deployments: ${response.status}`);
      }

      const data = await response.json();

      // Filtrar apenas os deployments em produção para este tenant
      const deployments = data.deployments.filter((d: any) => d.meta?.tenantId === tenantId && d.target === "production" && d.state === "READY");

      if (deployments.length > 0) {
        // Ordenar pelo mais recente
        deployments.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const latestDeployment = deployments[0];

        const build: VercelBuild = {
          id: latestDeployment.id,
          url: latestDeployment.url,
          tenantId,
          workspaceId: latestDeployment.meta?.workspaceId,
          ready: latestDeployment.state === "READY",
          createdAt: latestDeployment.createdAt,
        };

        // Armazenar no cache
        this.buildsCache[tenantId] = build;

        return build;
      }

      return null;
    } catch (error) {
      console.error("Erro ao consultar build por tenant:", error);
      return null;
    }
  }

  /**
   * Cria um novo build específico para o tenant
   * @param tenantId ID do tenant
   * @param workspaceId ID do workspace
   * @returns Dados do build criado ou null em caso de erro
   */
  static async createTenantBuild(tenantId: string, workspaceId: string): Promise<VercelBuild | null> {
    try {
      const deploymentResponse = await fetch(`${this.VERCEL_API_URL}/v13/deployments?teamId=${this.TEAM_ID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `tenant-${tenantId}`,
          projectId: this.PROJECT_ID,
          target: "production",
          meta: {
            tenantId,
            workspaceId,
          },
          env: [
            { key: "NEXT_PUBLIC_TENANT_ID", value: tenantId },
            { key: "NEXT_PUBLIC_WORKSPACE_ID", value: workspaceId },
          ],
        }),
      });

      if (!deploymentResponse.ok) {
        throw new Error(`Falha ao criar deployment: ${deploymentResponse.status}`);
      }

      const deploymentData = await deploymentResponse.json();

      // Aguardar o build ficar pronto (na prática seria melhor implementar webhooks)
      let build: VercelBuild = {
        id: deploymentData.id,
        url: deploymentData.url,
        tenantId,
        workspaceId,
        ready: deploymentData.readyState === "READY",
        createdAt: deploymentData.createdAt,
      };

      // Armazenar no cache
      this.buildsCache[tenantId] = build;

      return build;
    } catch (error) {
      console.error("Erro ao criar build para tenant:", error);
      return null;
    }
  }

  /**
   * Obtém ou cria um build para o tenant especificado
   * @param tenantId ID do tenant
   * @param workspaceId ID do workspace
   * @returns URL completa do build ou null em caso de erro
   */
  static async getOrCreateTenantBuildUrl(tenantId: string, workspaceId: string): Promise<string | null> {
    try {
      // Verificar se já existe um build
      let build = await this.getTenantBuild(tenantId);

      // Se não existir, criar um novo
      if (!build) {
        build = await this.createTenantBuild(tenantId, workspaceId);

        if (!build) {
          throw new Error("Não foi possível criar o build para o tenant");
        }
      }

      // Construir a URL completa do tenant
      return `https://${build.url}`;
    } catch (error) {
      console.error("Erro ao obter ou criar build:", error);
      return null;
    }
  }
}
