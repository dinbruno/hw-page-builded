import { getHeaders } from "../../utils/getHeaders";

export interface Page {
  id: string;
  slug: string;
  workspaceId: string;
  name?: string;
  content?: any;
}

export class PageService {
  private static cache: Record<string, { data: any; timestamp: number }> = {};
  private static CACHE_DURATION = 5 * 1000; // 5 seconds cache
  private static API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD || "http://localhost:4000";

  static async getById(pageId: string, workspaceId?: string, serverToken?: string, serverTenantId?: string): Promise<Page> {
    const cacheKey = `id:${pageId}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      console.log("PageService: Buscando página por ID", { pageId, workspaceId });

      // Use server-side headers if provided, otherwise client-side
      const headers = getHeaders(serverToken, serverTenantId);
      console.log("PageService: Headers para a requisição", headers);

      const apiUrl = `${this.API_URL}/pages/${pageId}`;
      const response = await fetch(apiUrl, {
        headers,
        next: { revalidate: 60 }, // Revalidate cache every 60 seconds
      });

      console.log("PageService: Resposta da API", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch page: ${errorMessage}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching page by ID:", error);
      throw error;
    }
  }

  static async getBySlug(slug: string, workspaceId?: string, serverToken?: string, serverTenantId?: string): Promise<Page> {
    const cacheKey = `slug:${slug}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      console.log("PageService: Buscando página por slug", { slug, workspaceId });

      // Use server-side headers if provided, otherwise client-side
      const headers = getHeaders(serverToken, serverTenantId);
      console.log("PageService: Headers para a requisição", headers);

      const url = new URL(`${this.API_URL}/pages/by-slug/${slug}`);
      if (workspaceId) {
        url.searchParams.append("workspaceId", workspaceId);
      }

      const response = await fetch(url.toString(), {
        headers,
        next: { revalidate: 60 }, // Revalidate cache every 60 seconds
      });

      console.log("PageService: Resposta da API", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch page: ${errorMessage}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      throw error;
    }
  }

  static async getAll(workspaceId?: string, serverToken?: string, serverTenantId?: string): Promise<Page[]> {
    const cacheKey = `all:${workspaceId || "all"}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      console.log("PageService: Buscando todas as páginas", { workspaceId });

      // Use server-side headers if provided, otherwise client-side
      const headers = getHeaders(serverToken, serverTenantId);
      console.log("PageService: Headers para a requisição", headers);

      const url = new URL(`${this.API_URL}/pages`);
      if (workspaceId) {
        url.searchParams.append("workspaceId", workspaceId);
      }

      const response = await fetch(url.toString(), {
        headers,
        next: { revalidate: 60 }, // Revalidate cache every 60 seconds
      });

      console.log("PageService: Resposta da API", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch pages: ${errorMessage}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching all pages:", error);
      throw error;
    }
  }

  static clearCache() {
    this.cache = {};
  }
}
