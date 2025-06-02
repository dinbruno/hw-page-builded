"use client";

import { useState, useEffect } from "react";
import { NewsService } from "@/services/news/news.service";
import { CustomNavigationBar } from "@/components/ui/custom-navigation-bar";
import StaticBreadcrumb from "@/components/static-renderer/components/static-breadcrumb";
import StaticContainer from "@/components/static-renderer/components/static-container";
import StaticNewsArticleLayout from "@/components/static-renderer/components/static-news-article-layout";
import StaticCommentsSection from "@/components/static-renderer/components/static-comments-section";
import { useCurrentUser, useAuth } from "@/contexts/auth-context";

// Mock image generator function
const generateMockImage = (seed: string, category = "news") => {
  const categories = {
    news: ["1", "2", "3", "4", "5"],
    tech: ["1", "2", "3", "4", "5"],
    business: ["1", "2", "3", "4", "5"],
  };
  const imageIds = categories[category as keyof typeof categories] || categories.news;
  const imageId = imageIds[seed.length % imageIds.length];
  return `https://picsum.photos/seed/${category}-${imageId}/800/400`;
};

// Safe date formatter function
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Data não disponível";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Data não disponível";
    }
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data não disponível";
  }
};

interface NewsArticlePageClientProps {
  slug: string;
  workspaceId?: string;
}

export const NewsArticlePageClient = ({ slug, workspaceId }: NewsArticlePageClientProps) => {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [relatedNewsLoading, setRelatedNewsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // Get current user for authentication
  const { user, isLoading: userLoading, isAuthenticated, collabId, profile } = useCurrentUser();
  const { logout } = useAuth();

  // Get user display data
  const userName = user?.name || profile?.name || "Usuário";
  const userPhoto = user?.photo || profile?.avatar;

  // Theme colors
  const backgroundColor = "#ffffff";
  const textColor = "#374151";
  const accentColor = "#3b82f6";

  // Função para obter imagem com fallback
  const getImageWithFallback = (imageUrl?: string, category = "news") => {
    if (imageUrl) return imageUrl;

    // Imagens de fallback baseadas em categoria
    const fallbackImages = {
      news: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
      tech: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
      business: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
      default: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop",
    };

    return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
  };

  // Carregar notícias relacionadas
  const loadRelatedNews = async (newsId: string) => {
    setRelatedNewsLoading(true);
    try {
      const related = await NewsService.getRelatedNews(newsId, 5);
      setRelatedNews(related);
    } catch (error) {
      console.error("Erro ao carregar notícias relacionadas:", error);
    } finally {
      setRelatedNewsLoading(false);
    }
  };

  // Carregar dados de curtidas da notícia - sem mock, dados reais apenas
  const loadLikesData = async (articleId: string) => {
    if (!isAuthenticated || !collabId) return;

    try {
      // Implementar chamadas reais para a API de likes quando disponível
      // Por enquanto, manter estado inicial limpo
      setLikesCount(0);
      setIsLiked(false);
    } catch (error) {
      console.error("Erro ao carregar curtidas:", error);
    }
  };

  // Alternar curtida
  const handleToggleLike = async () => {
    if (!isAuthenticated || !collabId || isTogglingLike || !article) return;

    setIsTogglingLike(true);
    try {
      // Aqui você implementaria a chamada para a API
      // Por enquanto, vamos simular a alteração
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      // Em produção, faria algo como:
      // await NewsLikesService.toggleLike(article.id, collabId);
    } catch (error) {
      console.error("Erro ao alterar curtida:", error);
      // Reverter em caso de erro
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : Math.max(0, likesCount - 1));
    } finally {
      setIsTogglingLike(false);
    }
  };

  // Carregar dados da notícia
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const foundArticle = await NewsService.getBySlug(slug);
        setArticle(foundArticle);

        // Carregar notícias relacionadas usando o ID da notícia
        if (foundArticle.id) {
          await loadRelatedNews(foundArticle.id);
          await loadLikesData(foundArticle.id);
        }
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
        setError("Erro ao carregar a notícia");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  // Update metadata client-side when article loads
  useEffect(() => {
    if (article) {
      // Update document title
      document.title = `${article.title} - Portal de Notícias`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", article.subtitle || `Leia o artigo completo: ${article.title}`);
      } else {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = article.subtitle || `Leia o artigo completo: ${article.title}`;
        document.head.appendChild(newMetaDescription);
      }

      // Update Open Graph meta tags
      const updateOrCreateMeta = (property: string, content: string) => {
        const existingMeta = document.querySelector(`meta[property="${property}"]`);
        if (existingMeta) {
          existingMeta.setAttribute("content", content);
        } else {
          const newMeta = document.createElement("meta");
          newMeta.setAttribute("property", property);
          newMeta.setAttribute("content", content);
          document.head.appendChild(newMeta);
        }
      };

      // Open Graph tags
      updateOrCreateMeta("og:title", article.title);
      updateOrCreateMeta("og:description", article.subtitle || `Leia o artigo completo: ${article.title}`);
      updateOrCreateMeta("og:type", "article");
      if (article.cover_image?.url) {
        updateOrCreateMeta("og:image", article.cover_image.url);
      }

      // Twitter Card tags
      const updateOrCreateTwitterMeta = (name: string, content: string) => {
        const existingMeta = document.querySelector(`meta[name="${name}"]`);
        if (existingMeta) {
          existingMeta.setAttribute("content", content);
        } else {
          const newMeta = document.createElement("meta");
          newMeta.setAttribute("name", name);
          newMeta.setAttribute("content", content);
          document.head.appendChild(newMeta);
        }
      };

      updateOrCreateTwitterMeta("twitter:card", "summary_large_image");
      updateOrCreateTwitterMeta("twitter:title", article.title);
      updateOrCreateTwitterMeta("twitter:description", article.subtitle || `Leia o artigo completo: ${article.title}`);
      if (article.cover_image?.url) {
        updateOrCreateTwitterMeta("twitter:image", article.cover_image.url);
      }

      // Cleanup function to reset title when component unmounts
      return () => {
        document.title = "Portal de Notícias";
      };
    }
  }, [article]);

  // Custom dropdown items with logout functionality
  const customUserDropdownItems = [
    {
      id: "profile",
      label: "Perfil",
      url: "/profile",
      linkType: "custom-url" as const,
      icon: "User",
    },
    {
      id: "settings",
      label: "Configurações",
      url: "/settings",
      linkType: "custom-url" as const,
      icon: "Settings",
    },
    {
      id: "logout",
      label: "Sair",
      url: "#",
      linkType: "custom-url" as const,
      icon: "LogOut",
    },
  ];

  // Handle dropdown item clicks
  const handleDropdownClick = async (itemId: string) => {
    if (itemId === "logout") {
      await logout();
    }
  };

  // Show loading while user data is loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 mx-auto" style={{ borderColor: accentColor }}></div>
          <p style={{ color: textColor }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: textColor }}>
            {error || "Notícia não encontrada"}
          </p>
          <a
            href="/noticias"
            className="px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: accentColor,
              color: "#ffffff",
            }}
          >
            Voltar às notícias
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ backgroundColor }}>
      {/* Navigation Bar */}
      <CustomNavigationBar
        logo="https://media.licdn.com/dms/image/v2/D4D0BAQGCqebSHxE6Aw/company-logo_200_200/company-logo_200_200/0/1700419200248/intranethywork_logo?e=2147483647&v=beta&t=FWD-8aa1YEtwQgD_JmcUk6eCWyWMB3ye0LhdCmRgE8M"
        backgroundColor="#ffffff"
        textColor={textColor}
        menuItems={[]} // Remove all menu items, keep only user dropdown
        userName="" // Remove userName to hide email/name
        userPhoto={userPhoto}
        userDropdownItems={customUserDropdownItems}
        onDropdownItemClick={handleDropdownClick}
        showNotifications={false}
        showMessages={false}
        showUserOptions={true}
        layoutType="standard"
        position="static"
      />

      {/* Hero Section with News Image */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageWithFallback(article.cover_image?.url)})`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">{article.title}</h1>
            {article.subtitle && (
              <p className="text-lg md:text-xl lg:text-2xl mb-6 opacity-90 drop-shadow-md max-w-4xl mx-auto">{article.subtitle}</p>
            )}
            <div className="flex items-center justify-center gap-6 text-sm md:text-base opacity-80">
              {article.author && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {article.author.name}
                </span>
              )}
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(article.published_at || article.created_at)}
              </span>
              {article.category && <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">{article.category}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <StaticBreadcrumb
            showHomeIcon={true}
            separator="chevron"
            backgroundColor="transparent"
            textColor="#6b7280"
            activeColor="#1f272f"
            hoverEffect="underline"
            fontSize={14}
            iconSize={16}
            routeMapping={{
              "": "Home",
              noticias: "Notícias",
              [slug]: article.title.length > 50 ? article.title.substring(0, 50) + "..." : article.title,
            }}
            customClasses="font-medium"
          />
        </div>
      </div>

      {/* Main Content Container */}
      <StaticContainer backgroundColor="#ffffff" padding={16} marginTop={16} marginBottom={16} width="100%" className="max-w-7xl mx-auto">
        {/* Layout with flex to align content and sidebar */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area (75% width) */}
          <div className="flex-1" style={{ maxWidth: "75%" }}>
            {/* News Article Layout */}
            <div id="artigo" className="mb-8">
              <StaticNewsArticleLayout
                customSlug={slug}
                articleWidth={100} // Full width since we're controlling layout externally
                gap={40}
                backgroundColor="#ffffff"
                textColor={textColor}
                titleColor="#111827"
                accentColor={accentColor}
                borderColor="#e5e7eb"
                relatedNewsTitle="Notícias Relacionadas"
                showRelatedNews={false} // Disabled here since we'll show in sidebar
                maxRelatedNews={5}
                showArticleImage={false} // Remove image from content, keep only in hero
                showArticleAuthor={true}
                showArticleDate={true}
                showArticleCategory={true}
                showArticleTags={true}
                showArticleStats={false} // Disable integrated stats, use custom like button
                showSocialShare={true}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                padding={{ top: 32, right: 24, bottom: 32, left: 24 }}
              />
            </div>

            {/* Simple Like Section */}
            <div className="mt-8 mb-8 flex justify-start">
              <button
                onClick={handleToggleLike}
                disabled={!isAuthenticated || isTogglingLike}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLiked
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-red-300"
                } ${isTogglingLike ? "animate-pulse" : ""}`}
                style={{
                  boxShadow: isLiked ? "0 8px 25px rgba(239, 68, 68, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <svg
                  className={`w-6 h-6 transition-all duration-300 ${isLiked ? "fill-current scale-110" : ""}`}
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{isTogglingLike ? "..." : isLiked ? "Curtido" : "Curtir"}</span>
                {likesCount > 0 && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isLiked ? "bg-white bg-opacity-25 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {likesCount}
                  </span>
                )}
              </button>

              {/* Authentication Notice */}
              {!isAuthenticated && (
                <div className="ml-4 flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                  <span>🔒 Faça login para curtir</span>
                </div>
              )}
            </div>

            {/* Comments System - Same width as article content */}
            <div className="mt-8">
              <StaticCommentsSection
                // API Integration with real user data
                newsSlug={slug}
                workspaceId={workspaceId}
                currentUserId={collabId || "anonymous-user"} // Use real collab ID or fallback
                // Display Configuration
                title="Comentários"
                allowComments={isAuthenticated} // Only allow comments if authenticated
                // Styling
                backgroundColor="#ffffff"
                textColor={textColor}
                titleColor="#111827"
                accentColor={accentColor}
                borderColor="#e5e7eb"
                borderRadius={16}
                padding={24}
                // Advanced features
                enableCharacterCount={true}
                maxCharacters={280}
                avatarShape="circle"
                commentBackgroundColor="#f9fafb"
                // Pass current user data for consistent display
                currentUserName={userName}
                currentUserPhoto={userPhoto}
              />
            </div>
          </div>

          {/* Simple Related News Sidebar (25% width) */}
          <div className="flex-shrink-0" style={{ width: "25%", minWidth: "300px" }}>
            <div className="sticky top-4">
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: "#ffffff",
                  border: `1px solid #e5e7eb`,
                }}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: "#111827" }}>
                  Notícias Relacionadas
                </h3>

                {relatedNewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : relatedNews.length > 0 ? (
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <article
                        key={news.id}
                        className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        style={{ borderColor: "#e5e7eb" }}
                        onClick={() => (window.location.href = `/noticias/${news.slug}`)}
                      >
                        {/* News Image */}
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={getImageWithFallback(news.cover_image?.url)}
                            alt={news.cover_image?.alt || news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {news.category && (
                            <span
                              className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded-full"
                              style={{ backgroundColor: accentColor }}
                            >
                              {news.category}
                            </span>
                          )}
                        </div>

                        {/* News Content */}
                        <div className="p-3">
                          <h4
                            className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                            style={{ color: "#111827" }}
                          >
                            {news.title}
                          </h4>

                          {news.subtitle && (
                            <p className="text-xs mb-2 line-clamp-2" style={{ color: textColor, opacity: 0.7 }}>
                              {news.subtitle}
                            </p>
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs" style={{ color: textColor, opacity: 0.6 }}>
                            <span>{news.created_by?.name || "Autor"}</span>
                            <span>{formatDate(news.published_at || news.created_at)}</span>
                          </div>

                          {/* Stats - Remove views, keep only likes and comments */}
                          {(news.likes_count || news.comments_count) && (
                            <div className="flex items-center space-x-4 mt-3 pt-3 border-t" style={{ borderColor: "#e5e7eb" }}>
                              {news.likes_count && (
                                <span className="flex items-center text-xs font-medium" style={{ color: "#ef4444" }}>
                                  <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {news.likes_count}
                                </span>
                              )}
                              {news.comments_count && (
                                <span className="flex items-center text-xs font-medium" style={{ color: "#6b7280" }}>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {news.comments_count}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e5e7eb50" }}>
                      <svg className="w-6 h-6" style={{ color: "#e5e7eb" }} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#111827" }}>
                      Nenhuma notícia relacionada
                    </h4>
                    <p className="text-xs mb-4" style={{ color: textColor, opacity: 0.7 }}>
                      Não encontramos outras notícias relacionadas a este artigo no momento.
                    </p>
                    <button
                      className="w-full px-4 py-2 rounded border transition-colors hover:bg-gray-50"
                      style={{
                        borderColor: accentColor,
                        color: accentColor,
                      }}
                      onClick={() => (window.location.href = "/noticias")}
                    >
                      Explorar todas as notícias
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800">
              <strong>Faça login</strong> para comentar e curtir notícias
            </p>
          </div>
        )}
      </StaticContainer>
    </div>
  );
};
