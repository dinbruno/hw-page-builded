import { NewsLike, CreateNewsLikeData, UpdateNewsLikeData } from "./news-likes.types";
import { getHeaders } from "@/utils/getHeaders";
import { NewsService } from "../news/news.service";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD;

export class NewsLikesService {
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

  static async getAll(newsId?: string, collabId?: string): Promise<NewsLike[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/news-likes`;
    const params = new URLSearchParams();

    if (newsId) {
      params.append("newsId", newsId);
    }

    if (collabId) {
      params.append("collabId", collabId);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<NewsLike[]>(response);
  }

  static async getById(id: string): Promise<NewsLike> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news-likes/${id}`, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<NewsLike>(response);
  }

  static async getByNewsId(newsId: string): Promise<NewsLike[]> {
    return this.getAll(newsId);
  }

  static async getByCollabId(collabId: string): Promise<NewsLike[]> {
    return this.getAll(undefined, collabId);
  }

  static async create(data: CreateNewsLikeData): Promise<NewsLike> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    if (!data.news_id) {
      throw new Error("news_id is required to create a like");
    }

    if (!data.collab_id) {
      throw new Error("collab_id is required to create a like");
    }

    const response = await fetch(`${API_URL}/news-likes`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<NewsLike>(response);
  }

  static async delete(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news-likes/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete like: ${response.statusText}`);
    }

    return;
  }

  static async toggleLike(newsId: string, collabId: string): Promise<NewsLike | null> {
    // Check if the user already liked this news
    const existingLikes = await this.getAll(newsId, collabId);
    const existingLike = existingLikes.find((like) => like.news_id === newsId && like.collab_id === collabId);

    if (existingLike) {
      // If already liked, remove the like
      await this.delete(existingLike.id);
      return null;
    } else {
      // If not liked, create a new like
      return this.create({ news_id: newsId, collab_id: collabId });
    }
  }

  static async getLikeCount(newsId: string): Promise<number> {
    const likes = await this.getByNewsId(newsId);
    return likes.length;
  }

  static async checkUserLiked(newsId: string, collabId: string): Promise<boolean> {
    const likes = await this.getAll(newsId, collabId);
    return likes.some((like) => like.news_id === newsId && like.collab_id === collabId);
  }

  static async getByNewsSlug(newsSlug: string, workspaceId?: string): Promise<NewsLike[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/news-likes/news/${newsSlug}`;
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

    return this.handleResponse<NewsLike[]>(response);
  }

  static async getLikeCountBySlug(newsSlug: string, workspaceId?: string): Promise<number> {
    const likes = await this.getByNewsSlug(newsSlug, workspaceId);
    return likes.length;
  }

  static async checkUserLikedBySlug(newsSlug: string, collabId: string, workspaceId?: string): Promise<boolean> {
    const likes = await this.getByNewsSlug(newsSlug, workspaceId);
    return likes.some((like) => like.collab_id === collabId);
  }

  static async getAllLikesOperations(newsId?: string) {
    return {
      getAllLikes: async (): Promise<NewsLike[]> => {
        return this.getAll(newsId);
      },

      getLikeCount: async (): Promise<number> => {
        if (!newsId) {
          throw new Error("newsId is required");
        }
        return this.getLikeCount(newsId);
      },

      toggleLike: async (collabId: string): Promise<NewsLike | null> => {
        if (!newsId) {
          throw new Error("newsId is required");
        }
        return this.toggleLike(newsId, collabId);
      },

      checkUserLiked: async (collabId: string): Promise<boolean> => {
        if (!newsId) {
          throw new Error("newsId is required");
        }
        return this.checkUserLiked(newsId, collabId);
      },

      createLike: async (collabId: string): Promise<NewsLike> => {
        if (!newsId) {
          throw new Error("newsId is required");
        }
        return this.create({
          news_id: newsId,
          collab_id: collabId,
        });
      },
    };
  }

  static async getAllLikesBySlugOperations(newsSlug: string, workspaceId?: string) {
    return {
      getAllLikes: async (): Promise<NewsLike[]> => {
        return this.getByNewsSlug(newsSlug, workspaceId);
      },

      getLikeCount: async (): Promise<number> => {
        return this.getLikeCountBySlug(newsSlug, workspaceId);
      },

      checkUserLiked: async (collabId: string): Promise<boolean> => {
        return this.checkUserLikedBySlug(newsSlug, collabId, workspaceId);
      },

      toggleLike: async (collabId: string): Promise<NewsLike | null> => {
        // First get the news by slug to get the news_id
        const news = await NewsService.getBySlug(newsSlug, workspaceId);
        return this.toggleLike(news.id, collabId);
      },

      createLike: async (collabId: string): Promise<NewsLike> => {
        // First get the news by slug to get the news_id
        const news = await NewsService.getBySlug(newsSlug, workspaceId);
        return this.create({
          news_id: news.id,
          collab_id: collabId,
        });
      },
    };
  }
}
