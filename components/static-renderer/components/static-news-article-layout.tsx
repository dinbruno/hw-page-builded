"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { Calendar, User, Eye, Heart, Share2, MessageCircle, Tag, Clock } from "lucide-react";
import Image from "next/image";
import { NewsService, type News } from "@/services/news";
import { NewsCommentsService, type NewsComment } from "@/services/news-comments";
import { NewsLikesService, type NewsLike } from "@/services/news-likes";

// Interface para definir um item de notícia relacionada
interface RelatedNewsItem {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  date?: string;
  author?: string;
  authorAvatar?: string;
  likes?: number;
  views?: number;
  url?: string;
}

// Interface para propriedades de espaçamento
interface SpacingProps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Interface para propriedades de borda
interface BorderProps {
  width: number;
  style: "solid" | "dashed" | "dotted" | "none";
  color: string;
  radius: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

// Interface principal do componente
interface StaticNewsArticleLayoutProps {
  // Configurações de Layout
  articleWidth?: number; // percentage
  gap?: number;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  // Configurações de Notícias Relacionadas
  relatedNewsTitle?: string;
  showRelatedNews?: boolean;
  maxRelatedNews?: number;
  // Configurações de Exibição
  showArticleImage?: boolean;
  showArticleAuthor?: boolean;
  showArticleDate?: boolean;
  showArticleCategory?: boolean;
  showArticleTags?: boolean;
  showArticleStats?: boolean;
  showSocialShare?: boolean;
  // Configurações de Carregamento
  loadingText?: string;
  errorText?: string;
  notFoundText?: string;
  // Props comuns
  margin?: SpacingProps;
  padding?: SpacingProps;
  hidden?: boolean;
  border?: BorderProps;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
  // Configurações de Slug (opcional - para override)
  customSlug?: string;
}

// Configuração padrão de borda
const defaultBorder: BorderProps = {
  width: 0,
  style: "solid",
  color: "#e5e7eb",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

export default function StaticNewsArticleLayout({
  articleWidth = 70,
  gap = 32,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#3b82f6",
  borderColor = "#e5e7eb",
  relatedNewsTitle = "Notícias Relacionadas",
  showRelatedNews = true,
  maxRelatedNews = 5,
  showArticleImage = true,
  showArticleAuthor = true,
  showArticleDate = true,
  showArticleCategory = true,
  showArticleTags = true,
  showArticleStats = true,
  showSocialShare = true,
  loadingText = "Carregando artigo...",
  errorText = "Erro ao carregar o artigo. Tente novamente.",
  notFoundText = "Artigo não encontrado.",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  hidden = false,
  border = defaultBorder,
  id,
  style,
  customClasses = "",
  customSlug,
}: StaticNewsArticleLayoutProps) {
  const params = useParams();
  const pathname = usePathname();

  // Estados para dados da notícia
  const [article, setArticle] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [likes, setLikes] = useState<NewsLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // Obter slug da URL ou usar customSlug
  const slug = customSlug || (params?.slug as string) || extractSlugFromPathname(pathname);

  // Função para extrair slug do pathname se não estiver nos params
  function extractSlugFromPathname(pathname: string): string {
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
  }

  // Função para carregar dados da notícia
  const loadArticleData = async (articleSlug: string) => {
    if (!articleSlug) {
      setError("Slug da notícia não encontrado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Carregar dados da notícia principal
      const newsData = await NewsService.getAll();
      const foundArticle = newsData.find((news) => news.slug === articleSlug || news.title.toLowerCase().replace(/\s+/g, "-") === articleSlug);

      if (!foundArticle) {
        setError(notFoundText);
        setLoading(false);
        return;
      }

      setArticle(foundArticle);

      // Carregar dados paralelos
      const [commentsData, likesData, allNews] = await Promise.all([
        NewsCommentsService.getByNewsId(foundArticle.id),
        NewsLikesService.getByNewsId(foundArticle.id),
        NewsService.getAll(),
      ]);

      setComments(commentsData);
      setLikes(likesData);

      // Verificar se o usuário já curtiu (simulação - em produção usar ID do usuário real)
      const userLiked = likesData.some((like) => like.collab_id === "current-user-id");
      setIsLiked(userLiked);

      // Carregar notícias relacionadas (excluindo a atual)
      const related = allNews
        .filter((news) => news.id !== foundArticle.id)
        .slice(0, maxRelatedNews)
        .map((news) => ({
          id: news.id,
          title: news.title,
          excerpt: news.subtitle || news.content?.substring(0, 150) + "...",
          image: news.cover_image_id ? `/api/files/${news.cover_image_id}` : undefined,
          category: "Notícias", // Campo category não existe, usar valor padrão
          date: formatDate(news.published_at || news.createdAt),
          author: "Autor", // Campo author não existe, usar valor padrão
          authorAvatar: undefined, // Campo author não existe
          likes: 0, // Será carregado dinamicamente se necessário
          views: 0, // Campo views não existe, usar valor padrão
          url: `/noticias/${news.slug || news.id}`,
        }));

      setRelatedNews(related);
    } catch (err) {
      console.error("Erro ao carregar dados da notícia:", err);
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o slug mudar
  useEffect(() => {
    if (slug) {
      loadArticleData(slug);
    }
  }, [slug, maxRelatedNews]);

  // Função para formatar data
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

  // Função para lidar com curtidas
  const handleLike = async () => {
    if (!article) return;

    try {
      if (isLiked) {
        // Remover curtida (implementar no service)
        setIsLiked(false);
        setLikes((prev) => prev.filter((like) => like.collab_id !== "current-user-id"));
      } else {
        // Adicionar curtida
        const newLike = await NewsLikesService.create({
          news_id: article.id,
          collab_id: "current-user-id", // Em produção, usar ID real do usuário
        });
        setIsLiked(true);
        setLikes((prev) => [...prev, newLike]);
      }
    } catch (err) {
      console.error("Erro ao processar curtida:", err);
    }
  };

  // Função para compartilhar
  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = `${article.title} - ${article.subtitle || ""}`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        break;
    }
  };

  if (hidden) return null;

  const marginStyle = {
    marginTop: `${margin?.top || 0}px`,
    marginRight: `${margin?.right || 0}px`,
    marginBottom: `${margin?.bottom || 0}px`,
    marginLeft: `${margin?.left || 0}px`,
  };

  const paddingStyle = {
    paddingTop: `${padding?.top || 0}px`,
    paddingRight: `${padding?.right || 0}px`,
    paddingBottom: `${padding?.bottom || 0}px`,
    paddingLeft: `${padding?.left || 0}px`,
  };

  const borderStyle = {
    borderWidth: border && border.width > 0 ? `${border.width}px` : "0",
    borderStyle: border?.style || "solid",
    borderColor: border?.color || "#e5e7eb",
    borderRadius: border?.radius
      ? `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`
      : "0px",
  };

  const relatedNewsWidth = 100 - articleWidth;

  // Renderizar estado de carregamento
  if (loading) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-article-layout ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          ...borderStyle,
          minHeight: "400px",
          ...(style || {}),
        }}
        id={id}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 mx-auto" style={{ borderColor: accentColor }}></div>
          <p style={{ color: textColor }}>{loadingText}</p>
        </div>
      </motion.div>
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-article-layout ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          ...borderStyle,
          minHeight: "400px",
          ...(style || {}),
        }}
        id={id}
      >
        <div className="text-center">
          <p style={{ color: textColor, fontSize: "18px" }}>{error}</p>
          <button
            onClick={() => slug && loadArticleData(slug)}
            className="mt-4 px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: accentColor,
              color: backgroundColor,
            }}
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    );
  }

  // Renderizar artigo
  return (
    <motion.div
      className={`w-full static-news-article-layout ${customClasses}`}
      style={{
        backgroundColor,
        ...marginStyle,
        ...borderStyle,
        ...(style || {}),
      }}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={paddingStyle}>
        <div className="flex flex-col lg:flex-row" style={{ gap: `${gap}px` }}>
          {/* Artigo Principal */}
          <article
            className="flex-shrink-0"
            style={{
              width: showRelatedNews ? `${articleWidth}%` : "100%",
              color: textColor,
            }}
          >
            {/* Cabeçalho do Artigo */}
            <header className="mb-6">
              {showArticleCategory && (
                <span
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  <Tag size={14} className="inline mr-1" />
                  Notícias
                </span>
              )}

              <h1 className="text-3xl font-bold mb-4" style={{ color: titleColor }}>
                {article?.title}
              </h1>

              {article?.subtitle && (
                <p className="text-lg mb-4 opacity-80" style={{ color: textColor }}>
                  {article.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                {showArticleAuthor && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      Autor
                    </span>
                  </div>
                )}

                {showArticleDate && article?.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(article.published_at)}
                  </span>
                )}

                {showArticleStats && (
                  <>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />0 visualizações
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {comments.length}
                    </span>
                  </>
                )}
              </div>
            </header>

            {/* Imagem do Artigo */}
            {showArticleImage && article?.cover_image_id && (
              <div className="relative w-full h-64 lg:h-80 mb-6 rounded-lg overflow-hidden">
                <Image src={`/api/files/${article.cover_image_id}`} alt={article.title} fill className="object-cover" />
              </div>
            )}

            {/* Conteúdo do Artigo */}
            <div className="prose prose-lg max-w-none mb-6">
              {article?.content?.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags do Artigo */}
            {showArticleTags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(article as any)?.tags?.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full border"
                    style={{
                      borderColor,
                      color: textColor,
                    }}
                  >
                    #{tag}
                  </span>
                )) || <span className="text-sm text-gray-500">Nenhuma tag disponível</span>}
              </div>
            )}

            {/* Compartilhamento Social */}
            {showSocialShare && (
              <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor }}>
                <span className="text-sm font-medium">Compartilhar:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center gap-1 px-3 py-1 text-sm border rounded transition-colors hover:bg-gray-50"
                    style={{ borderColor }}
                  >
                    <Share2 size={14} />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center gap-1 px-3 py-1 text-sm border rounded transition-colors hover:bg-gray-50"
                    style={{ borderColor }}
                  >
                    <Share2 size={14} />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 px-3 py-1 text-sm border rounded transition-colors ${
                      isLiked ? "bg-red-50 text-red-600 border-red-200" : "hover:bg-gray-50"
                    }`}
                    style={isLiked ? {} : { borderColor }}
                  >
                    <Heart size={14} className={isLiked ? "fill-current" : ""} />
                    {isLiked ? "Curtido" : "Curtir"}
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar de Notícias Relacionadas */}
          {showRelatedNews && relatedNews.length > 0 && (
            <aside
              className="flex-shrink-0"
              style={{
                width: `${relatedNewsWidth}%`,
                minWidth: "300px",
              }}
            >
              <div
                className="sticky top-4 p-6 rounded-lg"
                style={{
                  backgroundColor: `${backgroundColor}`,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: titleColor }}>
                  {relatedNewsTitle}
                </h3>

                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-3 pb-4 border-b last:border-b-0 cursor-pointer"
                      style={{ borderColor }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => (window.location.href = item.url || "#")}
                    >
                      {item.image && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {item.category && (
                          <span className="text-xs font-medium" style={{ color: accentColor }}>
                            {item.category}
                          </span>
                        )}

                        <h4 className="font-medium line-clamp-2 mb-1" style={{ color: titleColor }}>
                          {item.title}
                        </h4>

                        {item.excerpt && (
                          <p className="text-sm line-clamp-2 mb-2" style={{ color: textColor }}>
                            {item.excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs opacity-70">
                          {item.date && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {item.date}
                            </span>
                          )}
                          {item.views && (
                            <span className="flex items-center gap-1">
                              <Eye size={10} />
                              {item.views}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  className="w-full mt-4 px-4 py-2 rounded border transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                  onClick={() => (window.location.href = "/noticias")}
                >
                  Ver todas as notícias
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </motion.div>
  );
}
