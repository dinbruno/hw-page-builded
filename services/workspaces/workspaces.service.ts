import type { CreateWorkspaceInput, UpdateWorkspaceInput, GetWorkspaceParams, GetWorkspacesResponse, Workspace } from "./workspaces.types";
import { getHeaders } from "../../utils/getHeaders";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD || "http://localhost:4000";

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
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/workspaces`, {
      cache: "no-store",
      headers: getHeaders(),
    });

    return this.handleResponse<GetWorkspacesResponse>(response);
  }

  /**
   * Retorna o workspace caso exista, ou null se não encontrado (404).
   */
  static async getWorkspaceBySlug({ slug }: GetWorkspaceParams): Promise<Workspace | null> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

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
  }

  /**
   * Retorna o workspace com base na URL fornecida.
   * Se não for encontrado, retorna null.
   */
  static async getWorkspaceByUrl(url: string): Promise<Workspace | null> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    try {
      const response = await fetch(`${API_URL}/workspaces/domain/${url}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      console.log("WorkspaceService.getWorkspaceByUrl", response.status);

      // Se retornou 404, significa que não existe workspace com essa URL
      if (response.status === 404) {
        return null;
      }

      // Para qualquer outro status que não seja 2xx, handleResponse jogará erro
      return this.handleResponse<Workspace>(response);
    } catch (error) {
      console.error("Error in getWorkspaceByUrl:", error);
      return null;
    }
  }

  static async deleteWorkspace(id: string): Promise<void> {
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
