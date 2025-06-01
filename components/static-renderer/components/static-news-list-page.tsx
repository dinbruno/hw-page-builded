"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, User, Eye, Heart, MessageCircle, Tag, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { NewsService, type News, type NewsAuthor, type NewsCoverImage } from "@/services/news";
import { NewsCommentsService } from "@/services/news-comments";
import { NewsLikesService } from "@/services/news-likes";

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

// Interface para notícia processada (com dados adicionais carregados)
interface ProcessedNews extends News {
  commentsCount?: number;
  likesCount?: number;
  viewsCount?: number;
  formattedDate?: string;
  imageUrl?: string;
}

// Interface principal do componente
interface StaticNewsListPageProps {
  // Layout
  itemsPerPage?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  showPagination?: boolean;
  // Grid
  columns?: number;
  gap?: number;
  cardStyle?: "card" | "list" | "compact";
  // Styling
  backgroundColor?: string;
  cardBackgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  // Spacing
  margin?: SpacingProps;
  padding?: SpacingProps;
  // Display options
  showImage?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  showStats?: boolean;
  showExcerpt?: boolean;
  // Content options
  title?: string;
  subtitle?: string;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  // Filters
  statusFilter?: "all" | "published" | "draft" | "archived";
  // Props comuns
  hidden?: boolean;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

// Configuração padrão de borda
const defaultBorder: BorderProps = {
  width: 1,
  style: "solid",
  color: "#e5e7eb",
  radius: {
    topLeft: 16,
    topRight: 16,
    bottomRight: 16,
    bottomLeft: 16,
  },
};

export default function StaticNewsListPage({
  itemsPerPage = 6,
  showSearch = true,
  showFilters = true,
  showSort = true,
  showPagination = true,
  columns = 3,
  gap = 32,
  cardStyle = "card",
  backgroundColor = "#ffffff",
  cardBackgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#3b82f6",
  borderColor = "#e5e7eb",
  borderWidth = 1,
  borderRadius = 16,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 32, right: 32, bottom: 32, left: 32 },
  showImage = true,
  showAuthor = true,
  showDate = true,
  showCategory = true,
  showStats = true,
  showExcerpt = true,
  title = "Notícias",
  subtitle = "Fique por dentro das últimas notícias e informações importantes.",
  loadingText = "Carregando notícias...",
  errorText = "Erro ao carregar notícias. Tente novamente.",
  emptyText = "Nenhuma notícia encontrada",
  statusFilter = "all",
  hidden = false,
  id,
  style,
  customClasses = "",
}: StaticNewsListPageProps) {
  // Estados
  const [news, setNews] = useState<ProcessedNews[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Data não disponível";
    }
  };

  // Função para processar notícias com dados adicionais
  const processNewsData = async (newsData: News[]): Promise<ProcessedNews[]> => {
    const processedNews: ProcessedNews[] = [];

    for (const newsItem of newsData) {
      try {
        // Carregar dados adicionais em paralelo
        const [comments, likes] = await Promise.all([
          NewsCommentsService.getByNewsId(newsItem.id).catch(() => []),
          NewsLikesService.getByNewsId(newsItem.id).catch(() => []),
        ]);

        const processed: ProcessedNews = {
          ...newsItem,
          commentsCount: comments.length,
          likesCount: likes.length,
          viewsCount: 0, // Campo não existe na interface, usar 0
          formattedDate: formatDate(newsItem.published_at || newsItem.createdAt),
          imageUrl: newsItem.cover_image?.url, // Usar a URL direta do campo aninhado
        };

        processedNews.push(processed);
      } catch (err) {
        console.warn(`Erro ao processar notícia ${newsItem.id}:`, err);
        // Adicionar sem dados adicionais em caso de erro
        processedNews.push({
          ...newsItem,
          commentsCount: 0,
          likesCount: 0,
          viewsCount: 0,
          formattedDate: formatDate(newsItem.published_at || newsItem.createdAt),
          imageUrl: newsItem.cover_image?.url, // Usar a URL direta do campo aninhado
        });
      }
    }

    return processedNews;
  };

  // Função para carregar notícias
  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const newsData = await NewsService.getAll();

      // Filtrar por status se especificado
      const filteredNews = statusFilter === "all" ? newsData : newsData.filter((item) => item.status === statusFilter);

      // Processar notícias com dados adicionais
      const processedNews = await processNewsData(filteredNews);

      // Ordenar por data (mais recente primeiro) por padrão
      const sortedNews = processedNews.sort((a, b) => {
        const dateA = new Date(a.published_at || a.createdAt);
        const dateB = new Date(b.published_at || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setNews(sortedNews);

      // Extrair categorias únicas (simulado já que não existe campo category)
      const uniqueCategories = ["Todas", "Notícias", "Informações", "Avisos"];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadNews();
  }, [statusFilter]);

  // Filtrar e ordenar notícias
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase());

    // Para categoria, usar um sistema simples já que não temos categorias reais
    const matchesCategory = selectedCategory === "Todas" || (selectedCategory === "Notícias" && true); // Todas são notícias por padrão

    return matchesSearch && matchesCategory;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.published_at || b.createdAt).getTime() - new Date(a.published_at || a.createdAt).getTime();
      case "date-asc":
        return new Date(a.published_at || a.createdAt).getTime() - new Date(b.published_at || b.createdAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "likes-desc":
        return (b.likesCount || 0) - (a.likesCount || 0);
      case "likes-asc":
        return (a.likesCount || 0) - (b.likesCount || 0);
      default:
        return 0;
    }
  });

  // Paginação
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = sortedNews.slice(startIndex, startIndex + itemsPerPage);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFiltersDropdown) {
        const target = event.target as Element;
        if (!target.closest(".filters-dropdown-container")) {
          setShowFiltersDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFiltersDropdown]);

  // Função para navegar para notícia
  const handleNewsClick = (newsItem: ProcessedNews) => {
    const url = `/noticias/${newsItem.slug || newsItem.id}`;
    window.location.href = url;
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = selectedCategory !== "Todas" || sortBy !== "date-desc";

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

  // Componente do Card de Notícia
  const NewsCard = ({ item }: { item: ProcessedNews }) => (
    <motion.div
      className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${cardStyle === "list" ? "flex gap-6" : ""}`}
      style={{
        backgroundColor: cardBackgroundColor,
        borderColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
        borderRadius: `${borderRadius}px`,
      }}
      onClick={() => handleNewsClick(item)}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showImage && item.imageUrl && (
        <div
          className={`relative overflow-hidden ${cardStyle === "list" ? "w-56 h-36 flex-shrink-0" : "w-full h-52"}`}
          style={{
            borderRadius: cardStyle === "list" ? `${borderRadius}px 0 0 ${borderRadius}px` : `${borderRadius}px ${borderRadius}px 0 0`,
          }}
        >
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-300 hover:scale-110" />
        </div>
      )}

      <div className="p-6 flex-1">
        {showCategory && (
          <span
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full mb-3"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              borderRadius: `${borderRadius / 2}px`,
            }}
          >
            <Tag size={12} className="mr-1.5" />
            Notícias
          </span>
        )}

        <h3
          className={`font-bold mb-3 line-clamp-2 hover:opacity-80 transition-opacity ${cardStyle === "compact" ? "text-base" : "text-xl"}`}
          style={{ color: titleColor }}
        >
          {item.title}
        </h3>

        {showExcerpt && item.subtitle && cardStyle !== "compact" && (
          <p className="text-sm mb-4 line-clamp-3 leading-relaxed" style={{ color: textColor }}>
            {item.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: textColor }}>
          {showAuthor && item.author && (
            <div className="flex items-center gap-2">
              <User size={12} />
              <span className="font-medium">{item.author.name}</span>
            </div>
          )}

          {showDate && item.formattedDate && (
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span>{item.formattedDate}</span>
            </div>
          )}

          {showStats && (
            <>
              <div className="flex items-center gap-2">
                <Eye size={12} />
                <span>{item.viewsCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={12} />
                <span>{item.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={12} />
                <span>{item.commentsCount || 0}</span>
              </div>
            </>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
              item.status === "published"
                ? "bg-green-100 text-green-700"
                : item.status === "draft"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {item.status === "published" ? "Publicado" : item.status === "draft" ? "Rascunho" : "Arquivado"}
          </span>
        </div>
      </div>
    </motion.div>
  );

  // Renderizar estado de carregamento
  if (loading) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-list-page ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          minHeight: "400px",
          borderRadius: `${borderRadius}px`,
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
        className={`w-full flex items-center justify-center static-news-list-page ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          minHeight: "400px",
          borderRadius: `${borderRadius}px`,
          ...(style || {}),
        }}
        id={id}
      >
        <div className="text-center">
          <p style={{ color: textColor, fontSize: "18px" }}>{error}</p>
          <button
            onClick={loadNews}
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

  return (
    <motion.div
      className={`w-full static-news-list-page ${customClasses}`}
      style={{
        backgroundColor,
        ...marginStyle,
        borderRadius: `${borderRadius}px`,
        ...(style || {}),
      }}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={paddingStyle}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: titleColor }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl mb-8" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}

          {/* Search and Filters Container */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar and Filter Button Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                {showSearch && (
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar notícias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      style={{ borderColor }}
                    />
                  </div>
                )}

                {/* Filter Button */}
                {(showFilters || showSort) && (
                  <div className="relative filters-dropdown-container">
                    <button
                      onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                      className={`h-12 px-6 rounded-xl border-gray-200 hover:bg-gray-100 transition-all duration-200 ${
                        hasActiveFilters ? "bg-blue-50 border-blue-200 text-blue-700" : ""
                      }`}
                      style={{ borderColor: hasActiveFilters ? accentColor : borderColor }}
                    >
                      <Filter size={18} className="mr-2 inline" />
                      <span className="font-medium">Filtros</span>
                      {hasActiveFilters && <div className="ml-2 w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />}
                      <motion.div animate={{ rotate: showFiltersDropdown ? 180 : 0 }} transition={{ duration: 0.2 }} className="ml-2 inline-block">
                        <ChevronRight size={16} className="rotate-90" />
                      </motion.div>
                    </button>

                    {/* Filters Dropdown */}
                    <AnimatePresence>
                      {showFiltersDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-14 right-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 min-w-80"
                          style={{ borderColor }}
                        >
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold" style={{ color: titleColor }}>
                                Filtros e Ordenação
                              </h3>
                              <button onClick={() => setShowFiltersDropdown(false)} className="w-8 h-8 p-0 rounded-lg hover:bg-gray-100">
                                <X size={16} />
                              </button>
                            </div>

                            {showFilters && (
                              <div>
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">Categoria</label>
                                <select
                                  value={selectedCategory}
                                  onChange={(e) => setSelectedCategory(e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                  style={{ borderColor, color: textColor }}
                                >
                                  {categories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {showSort && (
                              <div>
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">Ordenar por</label>
                                <select
                                  value={sortBy}
                                  onChange={(e) => setSortBy(e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                  style={{ borderColor, color: textColor }}
                                >
                                  <option value="date-desc">Mais recentes</option>
                                  <option value="date-asc">Mais antigas</option>
                                  <option value="title-asc">A-Z</option>
                                  <option value="title-desc">Z-A</option>
                                  <option value="likes-desc">Mais curtidas</option>
                                  <option value="likes-asc">Menos curtidas</option>
                                </select>
                              </div>
                            )}

                            {hasActiveFilters && (
                              <div className="pt-4 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    setSelectedCategory("Todas");
                                    setSortBy("date-desc");
                                  }}
                                  className="w-full px-4 py-2 rounded-xl border-gray-200 hover:bg-gray-50"
                                >
                                  <X size={14} className="mr-2 inline" />
                                  Limpar Filtros
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: textColor }}>
              <span className="font-semibold">{sortedNews.length}</span> notícia
              {sortedNews.length !== 1 ? "s" : ""} encontrada{sortedNews.length !== 1 ? "s" : ""}
              {searchTerm && (
                <span>
                  {" "}
                  para <span className="font-semibold">&quot;{searchTerm}&quot;</span>
                </span>
              )}
              {selectedCategory !== "Todas" && (
                <span>
                  {" "}
                  em <span className="font-semibold">{selectedCategory}</span>
                </span>
              )}
            </p>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                {selectedCategory !== "Todas" && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("Todas")} className="ml-1.5 hover:opacity-70">
                      <X size={12} />
                    </button>
                  </motion.span>
                )}
                {sortBy !== "date-desc" && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    {sortBy === "date-asc"
                      ? "Mais antigas"
                      : sortBy === "title-asc"
                      ? "A-Z"
                      : sortBy === "title-desc"
                      ? "Z-A"
                      : sortBy === "likes-desc"
                      ? "Mais curtidas"
                      : sortBy === "likes-asc"
                      ? "Menos curtidas"
                      : "Personalizado"}
                    <button onClick={() => setSortBy("date-desc")} className="ml-1.5 hover:opacity-70">
                      <X size={12} />
                    </button>
                  </motion.span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div
          className={`mb-12 ${cardStyle === "list" ? "space-y-6" : "grid"}`}
          style={{
            gridTemplateColumns: cardStyle !== "list" ? `repeat(${columns}, 1fr)` : undefined,
            gap: cardStyle !== "list" ? `${gap}px` : undefined,
          }}
        >
          <AnimatePresence>
            {paginatedNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {paginatedNews.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mb-6" style={{ color: textColor }}>
              <Search size={64} className="mx-auto opacity-20" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: titleColor }}>
              {emptyText}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto" style={{ color: textColor }}>
              {searchTerm || selectedCategory !== "Todas"
                ? "Tente ajustar os filtros ou termo de busca para encontrar o que está procurando"
                : "Não há notícias disponíveis no momento"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-gray-50"
                style={{ borderColor }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                <span>Anterior</span>
              </button>

              <div className="flex gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      page === currentPage ? "shadow-md" : "hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: page === currentPage ? accentColor : "transparent",
                      borderColor: page === currentPage ? accentColor : borderColor,
                      color: page === currentPage ? "white" : textColor,
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-gray-50"
                style={{ borderColor }}
              >
                <span className="mr-1">Próxima</span>
                <ChevronRight size={16} className="inline" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
