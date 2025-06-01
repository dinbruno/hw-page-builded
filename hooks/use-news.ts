"use client";

import { useState, useEffect } from "react";
import { NewsService, type News } from "@/services/news";
import { NewsCommentsService, type NewsComment } from "@/services/news-comments";
import { NewsLikesService, type NewsLike } from "@/services/news-likes";

interface UseNewsOptions {
  autoLoad?: boolean;
  filterStatus?: "published" | "draft" | "archived";
}

interface UseNewsReturn {
  news: News[];
  loading: boolean;
  error: string | null;
  loadNews: () => Promise<void>;
  refreshNews: () => Promise<void>;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const { autoLoad = true, filterStatus } = options;

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const newsData = await NewsService.getAll();

      // Filtrar por status se especificado
      const filteredNews = filterStatus ? newsData.filter((item) => item.status === filterStatus) : newsData;

      // Ordenar por data de publicação (mais recente primeiro)
      const sortedNews = filteredNews.sort((a, b) => {
        const dateA = new Date(a.published_at || a.createdAt);
        const dateB = new Date(b.published_at || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setNews(sortedNews);
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
      setError("Erro ao carregar as notícias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = loadNews;

  useEffect(() => {
    if (autoLoad) {
      loadNews();
    }
  }, [autoLoad, filterStatus]);

  return {
    news,
    loading,
    error,
    loadNews,
    refreshNews,
  };
}

interface UseNewsArticleOptions {
  slug?: string;
  id?: string;
  loadComments?: boolean;
  loadLikes?: boolean;
}

interface UseNewsArticleReturn {
  article: News | null;
  comments: NewsComment[];
  likes: NewsLike[];
  loading: boolean;
  error: string | null;
  loadArticle: (slugOrId: string) => Promise<void>;
  refreshArticle: () => Promise<void>;
  isLiked: boolean;
  toggleLike: () => Promise<void>;
}

export function useNewsArticle(options: UseNewsArticleOptions = {}): UseNewsArticleReturn {
  const { slug, id, loadComments = true, loadLikes = true } = options;

  const [article, setArticle] = useState<News | null>(null);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [likes, setLikes] = useState<NewsLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const loadArticle = async (slugOrId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Carregar todas as notícias e encontrar a específica
      const newsData = await NewsService.getAll();
      const foundArticle = newsData.find(
        (news) => news.slug === slugOrId || news.id === slugOrId || news.title.toLowerCase().replace(/\s+/g, "-") === slugOrId
      );

      if (!foundArticle) {
        setError("Artigo não encontrado.");
        return;
      }

      setArticle(foundArticle);

      // Carregar dados adicionais em paralelo
      const promises: Promise<any>[] = [];

      if (loadComments) {
        promises.push(NewsCommentsService.getByNewsId(foundArticle.id));
      }

      if (loadLikes) {
        promises.push(NewsLikesService.getByNewsId(foundArticle.id));
      }

      if (promises.length > 0) {
        const results = await Promise.all(promises);

        if (loadComments) {
          setComments(results[0] || []);
        }

        if (loadLikes) {
          const likesData = results[loadComments ? 1 : 0] || [];
          setLikes(likesData);

          // Verificar se o usuário atual curtiu (simulação)
          const userLiked = likesData.some((like: NewsLike) => like.collab_id === "current-user-id");
          setIsLiked(userLiked);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar artigo:", err);
      setError("Erro ao carregar o artigo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const refreshArticle = () => {
    if (article) {
      return loadArticle(article.slug || article.id);
    }
    return Promise.resolve();
  };

  const toggleLike = async () => {
    if (!article) return;

    try {
      if (isLiked) {
        // Remover curtida (implementar delete no service)
        setIsLiked(false);
        setLikes((prev) => prev.filter((like) => like.collab_id !== "current-user-id"));
      } else {
        // Adicionar curtida
        const newLike = await NewsLikesService.create({
          news_id: article.id,
          collab_id: "current-user-id", // Usar ID real do usuário em produção
        });
        setIsLiked(true);
        setLikes((prev) => [...prev, newLike]);
      }
    } catch (err) {
      console.error("Erro ao processar curtida:", err);
    }
  };

  useEffect(() => {
    const identifier = slug || id;
    if (identifier) {
      loadArticle(identifier);
    }
  }, [slug, id, loadComments, loadLikes]);

  return {
    article,
    comments,
    likes,
    loading,
    error,
    loadArticle,
    refreshArticle,
    isLiked,
    toggleLike,
  };
}

// Hook para formatação de dados
export function useNewsHelpers() {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data não disponível";
    }
  };

  const formatRelativeDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Há poucos minutos";
      if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `Há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;

      return formatDate(dateString);
    } catch {
      return "Data não disponível";
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const truncateText = (text: string, length: number = 150): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).replace(/\s+\S*$/, "") + "...";
  };

  return {
    formatDate,
    formatRelativeDate,
    generateSlug,
    truncateText,
  };
}
