import { VercelService } from "../vercel/vercel.service";

interface TenantBuildInfo {
  tenantId: string;
  workspaceId: string;
  buildUrl: string;
  lastUpdated: Date;
  active: boolean;
}

/**
 * Serviço para gerenciar associações entre tenants e seus respectivos builds
 */
export class TenantBuildsService {
  // Na prática, essas informações estariam em um banco de dados
  private static tenantBuildsCache: Record<string, TenantBuildInfo> = {};

  /**
   * Obtém informações do build para um tenant específico
   * @param tenantId ID do tenant
   * @returns Informações do build ou null se não existir
   */
  static async getTenantBuildInfo(tenantId: string): Promise<TenantBuildInfo | null> {
    // Na implementação real, consultaríamos o banco de dados
    if (this.tenantBuildsCache[tenantId]) {
      return this.tenantBuildsCache[tenantId];
    }

    // Consultar o serviço da Vercel para verificar se existe build
    try {
      const build = await VercelService.getTenantBuild(tenantId);

      if (build && build.workspaceId) {
        const buildInfo: TenantBuildInfo = {
          tenantId,
          workspaceId: build.workspaceId,
          buildUrl: `https://${build.url}`,
          lastUpdated: new Date(build.createdAt),
          active: build.ready,
        };

        // Armazenar no cache (e idealmente no banco de dados também)
        this.tenantBuildsCache[tenantId] = buildInfo;

        return buildInfo;
      }

      return null;
    } catch (error) {
      console.error("Erro ao consultar informações de build do tenant:", error);
      return null;
    }
  }

  /**
   * Cria um novo build para o tenant especificado
   * @param tenantId ID do tenant
   * @param workspaceId ID do workspace
   * @returns Informações do build criado ou null em caso de erro
   */
  static async createTenantBuild(tenantId: string, workspaceId: string): Promise<TenantBuildInfo | null> {
    try {
      // Solicitar criação do build pela API da Vercel
      const build = await VercelService.createTenantBuild(tenantId, workspaceId);

      if (!build) {
        throw new Error("Falha ao criar build para o tenant");
      }

      const buildInfo: TenantBuildInfo = {
        tenantId,
        workspaceId,
        buildUrl: `https://${build.url}`,
        lastUpdated: new Date(build.createdAt),
        active: build.ready,
      };

      // Armazenar no cache (e idealmente no banco de dados também)
      this.tenantBuildsCache[tenantId] = buildInfo;

      return buildInfo;
    } catch (error) {
      console.error("Erro ao criar build para tenant:", error);
      return null;
    }
  }

  /**
   * Obtém ou cria um build para o tenant, retornando a URL de acesso
   * @param tenantId ID do tenant
   * @param workspaceId ID do workspace
   * @returns URL do build customizado para o tenant
   */
  static async getOrCreateTenantBuildUrl(tenantId: string, workspaceId: string): Promise<string | null> {
    try {
      // Verificar se já existe um build para este tenant
      let buildInfo = await this.getTenantBuildInfo(tenantId);

      // Se não existir ou não estiver ativo, criar um novo
      if (!buildInfo || !buildInfo.active) {
        buildInfo = await this.createTenantBuild(tenantId, workspaceId);
      }

      if (!buildInfo) {
        throw new Error("Não foi possível obter ou criar build para o tenant");
      }

      return buildInfo.buildUrl;
    } catch (error) {
      console.error("Erro ao obter URL do build por tenant:", error);
      return null;
    }
  }
}
