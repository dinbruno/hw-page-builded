"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Clock, Eye, Heart, Newspaper } from "lucide-react";
import { NewsService, type News } from "@/services/news";
import { NewsCommentsService } from "@/services/news-comments";
import { NewsLikesService } from "@/services/news-likes";

// Interface para notícia processada (com dados adicionais carregados)
interface ProcessedNewsItem extends News {
  commentsCount?: number;
  likesCount?: number;
  viewsCount?: number;
  formattedDate?: string;
  imageUrl?: string;
  categoryName?: string;
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
interface StaticNewsWebpartProps {
  // Configurações de conteúdo
  title?: string;
  showViewAll?: boolean;
  viewAllText?: string;
  viewAllUrl?: string;
  maxItems?: number; // Quantidade máxima de itens a exibir

  // Layout
  layout?: "grid" | "list" | "card";
  columns?: 1 | 2 | 3;
  showImage?: boolean;
  showExcerpt?: boolean;
  showCategory?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;

  // Styling
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;

  // Spacing
  margin?: SpacingProps;
  padding?: SpacingProps;
  border?: BorderProps;

  // Card específico
  cardShadow?: "none" | "sm" | "md" | "lg" | "xl";
  cardHoverEffect?: boolean;
  imageHeight?: number;
  titleSize?: number;
  excerptSize?: number;
  dateSize?: number;
  spacing?: number;

  // Filtros de dados
  statusFilter?: "all" | "published" | "draft" | "archived";
  sortBy?: "date-desc" | "date-asc" | "title-asc" | "title-desc" | "likes-desc";

  // Textos customizados
  loadingText?: string;
  errorText?: string;
  emptyText?: string;

  // Props comuns
  hidden?: boolean;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

// Configurações padrão
const defaultBorder: BorderProps = {
  width: 0,
  style: "solid",
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

export default function StaticNewsWebpart({
  title = "Outras notícias",
  showViewAll = true,
  viewAllText = "Ver todas",
  viewAllUrl = "/noticias",
  maxItems = 3,
  layout = "list",
  columns = 1,
  showImage = true,
  showExcerpt = true,
  showCategory = true,
  showDate = true,
  showAuthor = false,
  showStats = false,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#3b82f6",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  maxHeight = 500,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  border = defaultBorder,
  cardShadow = "sm",
  cardHoverEffect = true,
  imageHeight = 200,
  titleSize = 16,
  excerptSize = 14,
  dateSize = 12,
  spacing = 16,
  statusFilter = "published",
  sortBy = "date-desc",
  loadingText = "Carregando notícias...",
  errorText = "Erro ao carregar notícias.",
  emptyText = "Nenhuma notícia disponível",
  hidden = false,
  id,
  style,
  customClasses = "",
}: StaticNewsWebpartProps) {
  // Estados
  const [newsItems, setNewsItems] = useState<ProcessedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Data não disponível";
    }
  };

  // Função para processar notícias com dados adicionais
  const processNewsData = async (newsData: News[]): Promise<ProcessedNewsItem[]> => {
    const processedNews: ProcessedNewsItem[] = [];

    for (const newsItem of newsData) {
      try {
        // Carregar dados adicionais em paralelo
        const [comments, likes] = await Promise.all([
          NewsCommentsService.getByNewsId(newsItem.id).catch(() => []),
          NewsLikesService.getByNewsId(newsItem.id).catch(() => []),
        ]);

        const processed: ProcessedNewsItem = {
          ...newsItem,
          commentsCount: comments.length,
          likesCount: likes.length,
          viewsCount: 0, // Campo não existe na interface, usar 0
          formattedDate: formatDate(newsItem.published_at || newsItem.createdAt),
          imageUrl: newsItem.cover_image?.url, // Usar a URL direta do campo aninhado
          categoryName: "Notícias", // Campo category não existe, usar valor padrão
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
          categoryName: "Notícias",
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

      // Ordenar notícias
      const sortedNews = [...processedNews].sort((a, b) => {
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
          default:
            return 0;
        }
      });

      // Limitar quantidade de itens
      const limitedNews = sortedNews.slice(0, maxItems);
      setNewsItems(limitedNews);
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
  }, [statusFilter, sortBy, maxItems]);

  // Função para navegar para notícia
  const handleNewsClick = (item: ProcessedNewsItem) => {
    const url = `/noticias/${item.slug || item.id}`;
    window.location.href = url;
  };

  // Função para obter classes do grid
  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  // Função para obter classe da sombra
  const getShadowClass = () => {
    switch (cardShadow) {
      case "none":
        return "";
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      case "xl":
        return "shadow-xl";
      default:
        return "shadow-sm";
    }
  };

  // Função para obter estilo da borda
  const getBorderStyle = () => {
    return {
      borderWidth: `${border.width}px`,
      borderStyle: border.style,
      borderColor: border.color,
      borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
    };
  };

  // Renderizar item no layout de card
  const renderCardItem = (item: ProcessedNewsItem) => (
    <motion.div
      key={item.id}
      className={`flex flex-col overflow-hidden cursor-pointer ${getShadowClass()} ${
        cardHoverEffect ? "hover:shadow-lg" : ""
      } transition-all duration-300`}
      style={{
        ...getBorderStyle(),
        backgroundColor: "#ffffff",
        marginBottom: `${spacing}px`,
      }}
      onClick={() => handleNewsClick(item)}
      whileHover={cardHoverEffect ? { y: -2, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {showImage && item.imageUrl && (
        <div className="relative w-full overflow-hidden" style={{ height: `${imageHeight}px` }}>
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
          {showCategory && item.categoryName && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm" style={{ color: accentColor }}>
                {item.categoryName}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {!showImage && showCategory && item.categoryName && (
          <span className="text-xs font-medium mb-2" style={{ color: accentColor }}>
            {item.categoryName}
          </span>
        )}

        <h4
          className="font-semibold line-clamp-2 mb-2"
          style={{
            color: titleColor,
            fontSize: `${titleSize}px`,
            lineHeight: "1.4",
          }}
        >
          {item.title}
        </h4>

        {showExcerpt && item.subtitle && (
          <p
            className="line-clamp-3 mb-3 flex-1"
            style={{
              color: textColor,
              fontSize: `${excerptSize}px`,
              lineHeight: "1.5",
            }}
          >
            {item.subtitle}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {showDate && item.formattedDate && (
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: `${dateSize}px`,
                  color: textColor,
                  opacity: 0.7,
                }}
              >
                <Clock size={dateSize} />
                {item.formattedDate}
              </span>
            )}

            {showAuthor && (
              <div className="flex items-center gap-2">
                <span style={{ fontSize: `${dateSize}px`, color: textColor, opacity: 0.7 }}>Autor</span>
              </div>
            )}
          </div>

          {showStats && (
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: `${dateSize}px`,
                  color: textColor,
                  opacity: 0.7,
                }}
              >
                <Heart size={dateSize} />
                {item.likesCount || 0}
              </span>
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: `${dateSize}px`,
                  color: textColor,
                  opacity: 0.7,
                }}
              >
                <Eye size={dateSize} />
                {item.viewsCount || 0}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Renderizar item no layout de lista
  const renderListItem = (item: ProcessedNewsItem) => (
    <motion.div
      key={item.id}
      className="flex gap-4 pb-4 mb-4 border-b last:border-b-0 cursor-pointer"
      style={{ borderColor }}
      onClick={() => handleNewsClick(item)}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      {showImage && item.imageUrl && (
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded" style={{ borderRadius: `${borderRadius / 2}px` }}>
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {showCategory && item.categoryName && (
          <span className="text-xs font-medium" style={{ color: accentColor }}>
            {item.categoryName}
          </span>
        )}
        <h4 className="font-medium line-clamp-2" style={{ color: titleColor }}>
          {item.title}
        </h4>
        {showExcerpt && item.subtitle && (
          <p className="text-sm line-clamp-2 mt-1" style={{ color: textColor }}>
            {item.subtitle}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: textColor }}>
          {showDate && item.formattedDate && (
            <span className="flex items-center gap-1 opacity-70">
              <Clock size={12} />
              {item.formattedDate}
            </span>
          )}
          {showStats && (
            <>
              <span className="flex items-center gap-1 opacity-70">
                <Heart size={12} />
                {item.likesCount || 0}
              </span>
              <span className="flex items-center gap-1 opacity-70">
                <Eye size={12} />
                {item.viewsCount || 0}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Renderizar item no layout de grid
  const renderGridItem = (item: ProcessedNewsItem) => (
    <motion.div
      key={item.id}
      className="flex flex-col overflow-hidden rounded cursor-pointer"
      style={{
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
      }}
      onClick={() => handleNewsClick(item)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {showImage && item.imageUrl && (
        <div className="relative w-full h-40 overflow-hidden">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        {showCategory && item.categoryName && (
          <span className="text-xs font-medium" style={{ color: accentColor }}>
            {item.categoryName}
          </span>
        )}
        <h4 className="font-medium line-clamp-2 mt-1" style={{ color: titleColor }}>
          {item.title}
        </h4>
        {showExcerpt && item.subtitle && (
          <p className="text-sm line-clamp-2 mt-1" style={{ color: textColor }}>
            {item.subtitle}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          {showAuthor && (
            <span className="text-xs" style={{ color: textColor }}>
              Autor
            </span>
          )}
          {showDate && item.formattedDate && (
            <span className="text-xs opacity-70" style={{ color: textColor }}>
              {item.formattedDate}
            </span>
          )}
        </div>
        {showStats && (
          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: textColor }}>
            <span className="flex items-center gap-1 opacity-70">
              <Heart size={12} />
              {item.likesCount || 0}
            </span>
            <span className="flex items-center gap-1 opacity-70">
              <Eye size={12} />
              {item.viewsCount || 0}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (hidden) return null;

  const marginStyle = {
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
  };

  const paddingStyle = {
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
  };

  // Renderizar estado de carregamento
  if (loading) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-webpart ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          ...getBorderStyle(),
          minHeight: "200px",
          ...(style || {}),
        }}
        id={id}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2 mx-auto" style={{ borderColor: accentColor }}></div>
          <p style={{ color: textColor, fontSize: "14px" }}>{loadingText}</p>
        </div>
      </motion.div>
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-webpart ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          ...getBorderStyle(),
          minHeight: "200px",
          ...(style || {}),
        }}
        id={id}
      >
        <div className="text-center">
          <p style={{ color: textColor, fontSize: "14px" }}>{error}</p>
          <button
            onClick={loadNews}
            className="mt-2 px-3 py-1 text-sm rounded transition-colors"
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

  // Renderizar estado vazio
  if (newsItems.length === 0) {
    return (
      <motion.div
        className={`w-full flex items-center justify-center static-news-webpart ${customClasses}`}
        style={{
          backgroundColor,
          ...marginStyle,
          ...paddingStyle,
          ...getBorderStyle(),
          minHeight: "200px",
          ...(style || {}),
        }}
        id={id}
      >
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="mx-auto mb-4 p-4 rounded-full"
            style={{
              backgroundColor: `${accentColor}15`,
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Newspaper size={32} style={{ color: accentColor, opacity: 0.7 }} />
          </div>

          <h4 className="text-lg font-semibold mb-2" style={{ color: titleColor }}>
            Nenhuma notícia encontrada
          </h4>

          <p className="text-sm" style={{ color: textColor, opacity: 0.7 }}>
            {emptyText}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`w-full static-news-webpart ${customClasses}`}
      style={{
        backgroundColor,
        ...marginStyle,
        ...getBorderStyle(),
        ...(style || {}),
      }}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={paddingStyle}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3
            className="text-xl font-bold"
            style={{
              color: titleColor,
              fontSize: `${titleSize + 4}px`,
            }}
          >
            {title}
          </h3>

          {showViewAll && (
            <a href={viewAllUrl} className="flex items-center text-sm font-medium hover:underline" style={{ color: accentColor }}>
              {viewAllText}
              <ArrowRight size={16} className="ml-1" />
            </a>
          )}
        </div>

        {/* Content */}
        <div
          className="space-y-0"
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
        >
          {layout === "list" ? (
            <div className="space-y-0">{newsItems.map(renderListItem)}</div>
          ) : layout === "card" ? (
            <div className={`grid ${getGridColumns()} gap-${Math.floor(spacing / 4)}`}>{newsItems.map(renderCardItem)}</div>
          ) : (
            <div className={`grid ${getGridColumns()} gap-4`}>{newsItems.map(renderGridItem)}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
