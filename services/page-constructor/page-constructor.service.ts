import { mockPages } from "../mock";

export interface Page {
  id: string;
  slug: string;
  workspaceId: string;
  name?: string;
}

export class PageService {
  private static cache: Record<string, { data: any; timestamp: number }> = {};
  private static CACHE_DURATION = 5 * 1000;
  private static IS_DEVELOPMENT = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_NODE_ENV === "development";

  static async getById(pageId: string, workspaceId?: string): Promise<Page> {
    const cacheKey = `id:${pageId}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      if (this.IS_DEVELOPMENT) {
        const page = mockPages.find((p) => p.id === pageId);
        if (!page) throw new Error(`Page with ID ${pageId} not found`);

        this.cache[cacheKey] = {
          data: page,
          timestamp: Date.now(),
        };

        return page;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pages/${pageId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching page by ID:", error);

      if (!this.IS_DEVELOPMENT) {
        console.log("Falling back to mock data");
        const page = mockPages.find((p) => p.id === pageId);
        if (page) return page;
      }

      throw error;
    }
  }

  static async getBySlug(slug: string, workspaceId?: string): Promise<Page> {
    const cacheKey = `slug:${slug}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      if (this.IS_DEVELOPMENT) {
        const page = mockPages.find((p) => p.slug === slug && (!workspaceId || p.workspaceId === workspaceId));
        if (!page) throw new Error(`Page with slug "${slug}" not found`);

        this.cache[cacheKey] = {
          data: page,
          timestamp: Date.now(),
        };

        return page;
      }

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/pages/by-slug/${slug}`);
      if (workspaceId) {
        url.searchParams.append("workspaceId", workspaceId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching page by slug:", error);

      if (!this.IS_DEVELOPMENT) {
        console.log("Falling back to mock data");
        const page = mockPages.find((p) => p.slug === slug && (!workspaceId || p.workspaceId === workspaceId));
        if (page) return page;
      }

      throw error;
    }
  }

  static async getAll(workspaceId?: string): Promise<Page[]> {
    const cacheKey = `all:${workspaceId || "all"}`;

    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION) {
      return this.cache[cacheKey].data;
    }

    try {
      if (this.IS_DEVELOPMENT) {
        const pages = workspaceId ? mockPages.filter((p) => p.workspaceId === workspaceId) : mockPages;

        this.cache[cacheKey] = {
          data: pages,
          timestamp: Date.now(),
        };

        return pages;
      }

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
      if (workspaceId) {
        url.searchParams.append("workspaceId", workspaceId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      const data = await response.json();

      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error("Error fetching all pages:", error);

      if (!this.IS_DEVELOPMENT) {
        console.log("Falling back to mock data");
        const pages = workspaceId ? mockPages.filter((p) => p.workspaceId === workspaceId) : mockPages;
        return pages;
      }

      throw error;
    }
  }

  static clearCache() {
    this.cache = {};
  }
}
