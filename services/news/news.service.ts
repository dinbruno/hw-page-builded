import { News, CreateNewsData, UpdateNewsData } from "./news.types";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD;

export class NewsService {
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

  static async getAll(workspaceId?: string, status?: string): Promise<News[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/news`;
    const params = new URLSearchParams();

    if (workspaceId) {
      params.append("workspaceId", workspaceId);
    }

    if (status) {
      params.append("status", status);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<News[]>(response);
  }

  static async getById(id: string): Promise<News> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news/${id}`, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<News>(response);
  }

  static async create(data: CreateNewsData): Promise<News> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    if (!data.workspace_id) {
      throw new Error("workspace_id is required to create news");
    }

    const response = await fetch(`${API_URL}/news`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<News>(response);
  }

  static async update(id: string, data: UpdateNewsData): Promise<News> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<News>(response);
  }

  static async delete(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete news: ${response.statusText}`);
    }

    return;
  }

  static async uploadCoverImage(newsId: string, file: File): Promise<News> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const formData = new FormData();
    formData.append("file", file);

    const headers = (await getHeaders()) as Record<string, string>;
    delete headers["Content-Type"];

    const response = await fetch(`${API_URL}/news/${newsId}/cover-image`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    return this.handleResponse<News>(response);
  }

  static async getByStatus(workspaceId: string, status: "draft" | "published" | "archived"): Promise<News[]> {
    return this.getAll(workspaceId, status);
  }

  static async publish(id: string): Promise<News> {
    return this.update(id, {
      status: "published",
      published_at: new Date().toISOString(),
    });
  }

  static async archive(id: string): Promise<News> {
    return this.update(id, { status: "archived" });
  }

  static async getBySlug(slug: string, workspaceId?: string): Promise<News> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const news = await this.getAll(workspaceId);
    const foundNews = news.find((n) => n.slug === slug);

    if (!foundNews) {
      throw new Error(`News with slug ${slug} not found`);
    }

    return foundNews;
  }

  static async getRelatedNews(newsId: string, workspaceId: string, limit: number = 5): Promise<News[]> {
    try {
      // Fallback: if API fails, try external API
      if (API_URL) {
        const externalResponse = await fetch(`${API_URL}/news/related?top=${limit}&exclude_id=${newsId}&workspace_id=${workspaceId}`, {
          cache: "no-store",
          headers: await getHeaders(),
        });

        if (externalResponse.ok) {
          const result = await this.handleResponse<{ data: News[] }>(externalResponse);
          return result.data || [];
        }
      }

      // If both fail, return empty array
      console.warn(`Failed to fetch related news for ID: ${newsId}`);
      return [];
    } catch (error) {
      console.error("Error fetching related news:", error);
      return [];
    }
  }

  static async getAllNewsOperations(workspaceId: string) {
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    return {
      getAllNews: async (): Promise<News[]> => {
        return this.getAll(workspaceId);
      },

      getPublishedNews: async (): Promise<News[]> => {
        return this.getByStatus(workspaceId, "published");
      },

      getDraftNews: async (): Promise<News[]> => {
        return this.getByStatus(workspaceId, "draft");
      },

      getArchivedNews: async (): Promise<News[]> => {
        return this.getByStatus(workspaceId, "archived");
      },

      createNews: async (newsData: Omit<CreateNewsData, "workspace_id">): Promise<News> => {
        return this.create({
          ...newsData,
          workspace_id: workspaceId,
        });
      },

      publishNews: async (id: string): Promise<News> => {
        return this.publish(id);
      },

      archiveNews: async (id: string): Promise<News> => {
        return this.archive(id);
      },

      getNewsBySlug: async (slug: string): Promise<News> => {
        return this.getBySlug(slug, workspaceId);
      },
    };
  }
}
