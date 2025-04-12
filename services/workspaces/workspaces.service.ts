import type { CreateWorkspaceInput, UpdateWorkspaceInput, GetWorkspaceParams, GetWorkspacesResponse, Workspace } from "./workspaces.types";
import { getHeaders } from "../../utils/getHeaders";
import { mockWorkspaces } from "../mock";

const API_URL = process.env.API_CORE_URL_PROD;
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_NODE_ENV === "development";

export class WorkspaceService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Failed to perform operation: ${response.statusText}`;
      try {
        const errorBody = await response.text();
        errorMessage += ` - Details: ${errorBody}`;
      } catch (error) {
        console.error("Failed to read error response body:", error);
      }
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const data: T = await response.json();
      if (!data) {
        throw new Error("No data returned from API");
      }
      return data;
    } catch (error) {
      console.error("Failed to parse response JSON:", error);
      throw new Error("Failed to parse server response");
    }
  }

  static async createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
    if (IS_DEVELOPMENT) {
      console.log("Development mode: Mocking createWorkspace");
      // Simulando criação em desenvolvimento
      const newWorkspace: Workspace = {
        ...data,
        id: `mock-${Date.now()}`,
        active: true,
        public: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        founder: mockWorkspaces[0].founder,
        thumbnail: mockWorkspaces[0].thumbnail,
        favicon_file: null,
        workspace_theme: {
          ...mockWorkspaces[0].workspace_theme,
          id_workspace: `mock-${Date.now()}`,
        },
      };

      // Retorna o mock
      return newWorkspace;
    }

    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/workspaces`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Workspace>(response);
  }

  static async updateWorkspace(id: string, data: UpdateWorkspaceInput): Promise<Workspace> {
    if (IS_DEVELOPMENT) {
      console.log("Development mode: Mocking updateWorkspace");
      // Em desenvolvimento, simplesmente retorna o primeiro workspace mockado com as alterações
      // Clone profundo do workspace mockado para não modificar o original
      const mockWorkspace = JSON.parse(JSON.stringify(mockWorkspaces[0])) as Workspace;

      // Aplicar atualizações
      if (data.name) mockWorkspace.name = data.name;
      if (data.description) mockWorkspace.description = data.description;
      if (data.slug) mockWorkspace.slug = data.slug;
      if (data.active !== undefined) mockWorkspace.active = data.active;
      if (data.public !== undefined) mockWorkspace.public = data.public;
      if (data.thumb) mockWorkspace.thumb = data.thumb;
      if (data.favicon) mockWorkspace.favicon = data.favicon;

      // Atualizar workspace_theme se for fornecido
      if (data.workspace_theme) {
        Object.assign(mockWorkspace.workspace_theme, data.workspace_theme);
      }

      mockWorkspace.updatedAt = new Date().toISOString();

      return mockWorkspace;
    }

    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/workspaces/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Workspace>(response);
  }

  static async getWorkspaces(): Promise<GetWorkspacesResponse> {
    if (IS_DEVELOPMENT) {
      console.log("Development mode: Using mock workspaces");
      return mockWorkspaces;
    }

    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    try {
      const response = await fetch(`${API_URL}/workspaces`, {
        cache: "no-store",
        headers: getHeaders(),
      });

      return this.handleResponse<GetWorkspacesResponse>(response);
    } catch (error) {
      console.error("Error fetching workspaces, using mock data:", error);
      // Em caso de erro em produção, retornar mock data como fallback
      return mockWorkspaces;
    }
  }

  /**
   * Retorna o workspace caso exista, ou null se não encontrado (404).
   */
  static async getWorkspaceBySlug({ slug }: GetWorkspaceParams): Promise<Workspace | null> {
    if (IS_DEVELOPMENT) {
      console.log("Development mode: Using mock workspace by slug");
      const workspace = mockWorkspaces.find((w) => w.slug === slug);
      return workspace || null;
    }

    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    try {
      const response = await fetch(`${API_URL}/workspaces/${slug}`, {
        cache: "no-store",
        headers: getHeaders(),
      });

      console.log("WorkspaceService.getWorkspaceBySlug", response.status);

      // Se retornou 404, significa que não existe workspace com esse slug.
      if (response.status === 404) {
        return null;
      }

      // Para qualquer outro status que não seja 2xx, handleResponse jogará erro
      return this.handleResponse<Workspace>(response);
    } catch (error) {
      console.error("Error fetching workspace by slug, using mock data:", error);
      // Em caso de erro em produção, verificar nos mocks
      const workspace = mockWorkspaces.find((w) => w.slug === slug);
      return workspace || null;
    }
  }

  static async deleteWorkspace(id: string): Promise<void> {
    if (IS_DEVELOPMENT) {
      console.log("Development mode: Mocking deleteWorkspace for ID:", id);
      // Em desenvolvimento, apenas simula deletar
      return;
    }

    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/workspaces/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      let errorMessage = `Failed to delete workspace: ${response.statusText}`;
      try {
        const errorBody = await response.text();
        errorMessage += ` - Details: ${errorBody}`;
      } catch (error) {
        console.error("Failed to read error response body:", error);
      }
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}
