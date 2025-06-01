import { NewsComment, CreateNewsCommentData, UpdateNewsCommentData } from "./news-comments.types";
import { getHeaders } from "@/utils/getHeaders";
import { NewsService } from "../news/news.service";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD;

export class NewsCommentsService {
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

  static async getAll(newsId?: string, authorId?: string): Promise<NewsComment[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/news-comments`;
    const params = new URLSearchParams();

    if (newsId) {
      params.append("newsId", newsId);
    }

    if (authorId) {
      params.append("authorId", authorId);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<NewsComment[]>(response);
  }

  static async getById(id: string): Promise<NewsComment> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news-comments/${id}`, {
      cache: "no-store",
      headers: await getHeaders(),
    });

    return this.handleResponse<NewsComment>(response);
  }

  static async getByNewsId(newsId: string): Promise<NewsComment[]> {
    return this.getAll(newsId);
  }

  static async getByAuthorId(authorId: string): Promise<NewsComment[]> {
    return this.getAll(undefined, authorId);
  }

  static async create(data: CreateNewsCommentData): Promise<NewsComment> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    if (!data.news_id) {
      throw new Error("news_id is required to create a comment");
    }

    if (!data.author_id) {
      throw new Error("author_id is required to create a comment");
    }

    const response = await fetch(`${API_URL}/news-comments`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<NewsComment>(response);
  }

  static async update(id: string, data: UpdateNewsCommentData): Promise<NewsComment> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news-comments/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<NewsComment>(response);
  }

  static async delete(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/news-comments/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }

    return;
  }

  static async activate(id: string): Promise<NewsComment> {
    return this.update(id, { is_active: true });
  }

  static async deactivate(id: string): Promise<NewsComment> {
    return this.update(id, { is_active: false });
  }

  static async getActiveComments(newsId?: string): Promise<NewsComment[]> {
    const comments = await this.getAll(newsId);
    return comments.filter((comment) => comment.is_active);
  }

  static async getByNewsSlug(newsSlug: string, workspaceId?: string): Promise<NewsComment[]> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    let url = `${API_URL}/news-comments/by-slug/${newsSlug}`;
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

    return this.handleResponse<NewsComment[]>(response);
  }

  static async getAllCommentsOperations(newsId?: string) {
    return {
      getAllComments: async (): Promise<NewsComment[]> => {
        return this.getAll(newsId);
      },

      getActiveComments: async (): Promise<NewsComment[]> => {
        return this.getActiveComments(newsId);
      },

      createComment: async (commentData: Omit<CreateNewsCommentData, "news_id">): Promise<NewsComment> => {
        if (!newsId) {
          throw new Error("newsId is required");
        }
        return this.create({
          ...commentData,
          news_id: newsId,
        });
      },

      activateComment: async (id: string): Promise<NewsComment> => {
        return this.activate(id);
      },

      deactivateComment: async (id: string): Promise<NewsComment> => {
        return this.deactivate(id);
      },
    };
  }

  static async getAllCommentsBySlugOperations(newsSlug: string, workspaceId?: string) {
    return {
      getAllComments: async (): Promise<NewsComment[]> => {
        return this.getByNewsSlug(newsSlug, workspaceId);
      },

      getActiveComments: async (): Promise<NewsComment[]> => {
        const comments = await this.getByNewsSlug(newsSlug, workspaceId);
        return comments.filter((comment) => comment.is_active);
      },

      createComment: async (commentData: Omit<CreateNewsCommentData, "news_id">): Promise<NewsComment> => {
        if (!newsSlug) {
          throw new Error("newsSlug is required");
        }
        const news = await NewsService.getBySlug(newsSlug, workspaceId);
        return this.create({
          ...commentData,
          news_id: news.id,
        });
      },
    };
  }
}
