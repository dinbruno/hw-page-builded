import { Collab, CreateCollabData, UpdateCollabData, AuthCollab, CollabProfile } from "./collabs.types";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD;

export class CollabsService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`Failed to perform operation: ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");

    if ((contentLength === "0" || !contentType || !contentType.includes("application/json")) && response.status === 200) {
      return undefined as unknown as T;
    }

    return response.json();
  }

  /**
   * Get collaborator by Firebase Auth ID
   */
  static async getByIdRefAuth(idRefAuth: string, workspaceId?: string): Promise<Collab> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/collabs/auth/${idRefAuth}`;
    const params = new URLSearchParams();

    if (workspaceId) {
      params.append("workspaceId", workspaceId);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<Collab>(response);
  }

  /**
   * Get all collaborators
   */
  static async getAll(workspaceId?: string): Promise<Collab[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/collabs`;
    const params = new URLSearchParams();

    if (workspaceId) {
      params.append("workspaceId", workspaceId);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<Collab[]>(response);
  }

  /**
   * Get collaborator by ID
   */
  static async getById(id: string): Promise<Collab> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/collabs/${id}`, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<Collab>(response);
  }

  /**
   * Create new collaborator
   */
  static async create(data: CreateCollabData): Promise<Collab> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/collabs`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Collab>(response);
  }

  /**
   * Update collaborator
   */
  static async update(id: string, data: UpdateCollabData): Promise<Collab> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/collabs/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Collab>(response);
  }

  /**
   * Delete collaborator
   */
  static async delete(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/collabs/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete collaborator: ${response.statusText}`);
    }

    return;
  }

  /**
   * Activate collaborator
   */
  static async activate(id: string): Promise<Collab> {
    return this.update(id, { active: true });
  }

  /**
   * Deactivate collaborator
   */
  static async deactivate(id: string): Promise<Collab> {
    return this.update(id, { active: false });
  }

  /**
   * Get collaborator profile for UI components
   */
  static async getProfile(idRefAuth: string, workspaceId?: string): Promise<CollabProfile> {
    const collab = await this.getByIdRefAuth(idRefAuth, workspaceId);

    return {
      id: collab.id,
      name: collab.name,
      email: collab.email,
      avatar: collab.thumbnail?.url || collab.thumb || "/images/avatar.png",
      position: collab.position,
      department: collab.department,
      isActive: collab.active,
      permissions: collab.access_level?.permissions || [],
    };
  }

  /**
   * Get authenticated collaborator with permissions
   */
  static async getAuthenticatedCollab(idRefAuth: string, workspaceId?: string): Promise<AuthCollab> {
    const collab = await this.getByIdRefAuth(idRefAuth, workspaceId);

    return {
      ...collab,
      permissions: collab.access_level?.permissions || [],
      isAuthenticated: true,
    };
  }

  /**
   * Check if collaborator has permission
   */
  static async hasPermission(idRefAuth: string, permission: string, workspaceId?: string): Promise<boolean> {
    try {
      const collab = await this.getByIdRefAuth(idRefAuth, workspaceId);
      return collab.access_level?.permissions?.includes(permission) || false;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  /**
   * Get collaborators by department
   */
  static async getByDepartment(department: string, workspaceId?: string): Promise<Collab[]> {
    const allCollabs = await this.getAll(workspaceId);
    return allCollabs.filter((collab) => collab.department === department && collab.active);
  }

  /**
   * Search collaborators by name or email
   */
  static async search(query: string, workspaceId?: string): Promise<Collab[]> {
    const allCollabs = await this.getAll(workspaceId);
    const lowercaseQuery = query.toLowerCase();

    return allCollabs.filter(
      (collab) => collab.active && (collab.name.toLowerCase().includes(lowercaseQuery) || collab.email.toLowerCase().includes(lowercaseQuery))
    );
  }
}
