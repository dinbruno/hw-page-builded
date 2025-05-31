"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";

// Interface para definir os cards do carrossel
interface CarouselCard {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  badge?: string;
  price?: string;
  rating?: number;
  buttonText?: string;
  buttonUrl?: string;
  showButton?: boolean;
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  cardColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
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

// Interface para imagem de fundo
interface BackgroundImageValue {
  url: string;
  size: string;
  position: string;
  repeat: string;
  customSize?: string;
  customPosition?: string;
}

// Interface para cores de gradiente
interface BackgroundGradientColor {
  color: string;
  position: number;
}

// Interface para gradiente de fundo
interface BackgroundGradientValue {
  type: string;
  angle: number;
  colors: BackgroundGradientColor[];
}

// Interface para overlay de fundo
interface BackgroundOverlayValue {
  enabled: boolean;
  color: string;
  opacity: number;
}

// Interface para configuração de fundo
interface BackgroundValue {
  type: string;
  color: string;
  image: BackgroundImageValue;
  gradient: BackgroundGradientValue;
  overlay: BackgroundOverlayValue;
}

// Interface principal do componente
interface StaticCardCarouselProps {
  title?: string;
  subtitle?: string;
  cards?: CarouselCard[];
  // Opções de Layout
  itemsPerPage?: number;
  itemsPerRow?: number;
  gap?: number;
  cardHeight?: number;
  cardStyle?: "default" | "minimal" | "detailed" | "modern" | "classic";
  // Opções do Carrossel
  autoplay?: boolean;
  autoplaySpeed?: number;
  showArrows?: boolean;
  showDots?: boolean;
  infinite?: boolean;
  pauseOnHover?: boolean;
  // Opções Visuais
  titleAlignment?: "left" | "center" | "right";
  cardAlignment?: "left" | "center" | "right";
  titleSize?: number;
  subtitleSize?: number;
  cardRadius?: number;
  cardShadow?: "none" | "sm" | "md" | "lg" | "xl";
  // Cores
  titleColor?: string;
  subtitleColor?: string;
  arrowColor?: string;
  arrowBgColor?: string;
  dotColor?: string;
  dotActiveColor?: string;
  // Cores Padrão dos Cards
  defaultCardColor?: string;
  defaultTextColor?: string;
  defaultButtonColor?: string;
  defaultButtonTextColor?: string;
  // Props comuns
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  hidden?: boolean;
  border?: BorderProps;
  background?: BackgroundValue;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

// Cards padrão para demonstração
const defaultCards: CarouselCard[] = [
  {
    id: "card1",
    title: "Card de Exemplo 1",
    subtitle: "Subtítulo interessante",
    description: "Descrição detalhada do primeiro card para demonstrar as funcionalidades.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Destaque",
    price: "R$ 99,90",
    rating: 4.5,
    buttonText: "Ver mais",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
  {
    id: "card2",
    title: "Card de Exemplo 2",
    subtitle: "Outro subtítulo",
    description: "Segunda descrição para mostrar a variedade de conteúdo possível.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Popular",
    price: "R$ 149,90",
    rating: 4.8,
    buttonText: "Saiba mais",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
  {
    id: "card3",
    title: "Card de Exemplo 3",
    subtitle: "Terceiro exemplo",
    description: "Terceira descrição demonstrando a flexibilidade do componente.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Novo",
    price: "R$ 79,90",
    rating: 4.2,
    buttonText: "Explorar",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
  {
    id: "card4",
    title: "Card de Exemplo 4",
    subtitle: "Quarto exemplo",
    description: "Quarta descrição para completar a demonstração inicial.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Oferta",
    price: "R$ 199,90",
    rating: 4.9,
    buttonText: "Comprar",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
  {
    id: "card5",
    title: "Card de Exemplo 5",
    subtitle: "Quinto exemplo",
    description: "Quinta descrição para demonstrar mais cards no carrossel.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1726&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Limitado",
    price: "R$ 299,90",
    rating: 4.7,
    buttonText: "Adquirir",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
  {
    id: "card6",
    title: "Card de Exemplo 6",
    subtitle: "Sexto exemplo",
    description: "Sexta descrição mostrando ainda mais variedade de conteúdo.",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3",
    badge: "Premium",
    price: "R$ 399,90",
    rating: 5.0,
    buttonText: "Ver detalhes",
    buttonUrl: "#",
    showButton: true,
    showBadge: true,
    showRating: true,
    showPrice: true,
  },
];

// Configuração padrão de borda
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

// Configuração padrão de fundo
const defaultBackground: BackgroundValue = {
  type: "color",
  color: "#ffffff",
  image: {
    url: "",
    size: "cover",
    position: "center",
    repeat: "no-repeat",
  },
  gradient: {
    type: "linear",
    angle: 90,
    colors: [
      { color: "#ffffff", position: 0 },
      { color: "#f9fafb", position: 100 },
    ],
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
  },
};

export default function StaticCardCarousel({
  title = "Carrossel de Cards",
  subtitle = "Explore nossos cards em destaque",
  cards = defaultCards,
  itemsPerPage = 3,
  itemsPerRow = 1,
  gap = 16,
  cardHeight = 400,
  cardStyle = "default",
  autoplay = false,
  autoplaySpeed = 4000,
  showArrows = true,
  showDots = true,
  infinite = true,
  pauseOnHover = true,
  titleAlignment = "left",
  cardAlignment = "left",
  titleSize = 28,
  subtitleSize = 16,
  cardRadius = 8,
  cardShadow = "md",
  titleColor = "#1f2937",
  subtitleColor = "#6b7280",
  arrowColor = "#374151",
  arrowBgColor = "#ffffff",
  dotColor = "#d1d5db",
  dotActiveColor = "#3b82f6",
  defaultCardColor = "#ffffff",
  defaultTextColor = "#1f2937",
  defaultButtonColor = "#3b82f6",
  defaultButtonTextColor = "#ffffff",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  hidden = false,
  border = defaultBorder,
  background = defaultBackground,
  id,
  style,
  customClasses = "",
}: StaticCardCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(cards.length / itemsPerPage);

  // Funcionalidade de reprodução automática
  useEffect(() => {
    if (autoplay && !isHovered) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentPage((prev) => (infinite ? (prev + 1) % totalPages : Math.min(prev + 1, totalPages - 1)));
      }, autoplaySpeed);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaySpeed, currentPage, totalPages, isHovered, infinite]);

  // Função para próxima página
  const nextPage = () => {
    if (infinite) {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    }
  };

  // Função para página anterior
  const prevPage = () => {
    if (infinite) {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    }
  };

  // Função para ir para página específica
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Obter estilo de fundo
  const getBackgroundStyle = () => {
    if (background?.type === "color") {
      return {
        backgroundColor: background.color,
        backgroundImage: "none",
        background: background.color,
      };
    } else if (background?.type === "image") {
      const imageUrl = background.image.url;
      const overlayStyle = background.overlay.enabled
        ? `linear-gradient(rgba(${hexToRgb(background.overlay.color)}, ${background.overlay.opacity}), rgba(${hexToRgb(background.overlay.color)}, ${
            background.overlay.opacity
          }))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${imageUrl})`,
        backgroundSize: background.image.size === "custom" ? background.image.customSize : background.image.size,
        backgroundPosition: background.image.position === "custom" ? background.image.customPosition : background.image.position,
        backgroundRepeat: background.image.repeat,
        backgroundColor: "transparent",
      };
    } else if (background?.type === "gradient") {
      const gradientType =
        background.gradient.type === "linear"
          ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return {
        background: gradientType,
        backgroundColor: "transparent",
      };
    }

    return { backgroundColor: "#ffffff" };
  };

  // Função auxiliar para converter hex para rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}` : "0, 0, 0";
  };

  // Classes de sombra dos cards
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Renderizar avaliação por estrelas
  const renderRating = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-300" />);
    }
    return stars;
  };

  // Função para lidar com clique do botão
  const handleButtonClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
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

  return (
    <motion.div
      className={`relative static-card-carousel ${customClasses}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      style={{
        ...marginStyle,
        ...borderStyle,
        overflow: "hidden",
        ...(style || {}),
      }}
      id={id}
    >
      <div style={{ ...getBackgroundStyle(), ...paddingStyle }}>
        {/* Cabeçalho */}
        <div className={`mb-6 flex items-center justify-between`} style={{ textAlign: titleAlignment }}>
          <div style={{ textAlign: titleAlignment, flex: 1 }}>
            <h2 style={{ fontSize: `${titleSize}px`, color: titleColor, fontWeight: "bold", margin: 0, lineHeight: 1.2 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: `${subtitleSize}px`, color: subtitleColor, margin: "8px 0 0 0", lineHeight: 1.4 }}>{subtitle}</p>}
          </div>

          {showArrows && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={prevPage}
                disabled={!infinite && currentPage === 0}
                className="p-2 rounded-full transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: arrowBgColor, color: arrowColor }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextPage}
                disabled={!infinite && currentPage === totalPages - 1}
                className="p-2 rounded-full transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: arrowBgColor, color: arrowColor }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Container dos Cards */}
        <div className="relative">
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
                      gap: `${gap}px`,
                      justifyItems: cardAlignment === "center" ? "center" : cardAlignment === "right" ? "end" : "start",
                    }}
                  >
                    {cards.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((card) => (
                      <motion.div
                        key={card.id}
                        className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${shadowClasses[cardShadow]}`}
                        style={{
                          height: `${cardHeight}px`,
                          borderRadius: `${cardRadius}px`,
                          backgroundColor: card.cardColor || defaultCardColor,
                          color: card.textColor || defaultTextColor,
                        }}
                        whileHover={{ y: -4 }}
                      >
                        {/* Imagem do Card */}
                        {card.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                            {card.showBadge && card.badge && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">{card.badge}</div>
                            )}
                          </div>
                        )}

                        {/* Conteúdo do Card */}
                        <div className="p-4 flex flex-col h-full">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{card.title}</h3>
                            {card.subtitle && <p className="text-sm text-gray-600 mb-2 line-clamp-1">{card.subtitle}</p>}
                            {card.description && <p className="text-sm text-gray-700 mb-3 line-clamp-3">{card.description}</p>}

                            {/* Avaliação */}
                            {card.showRating && card.rating && (
                              <div className="flex items-center gap-1 mb-2">
                                {renderRating(card.rating)}
                                <span className="text-xs text-gray-600 ml-1">({card.rating})</span>
                              </div>
                            )}

                            {/* Preço */}
                            {card.showPrice && card.price && <div className="text-lg font-bold text-green-600 mb-3">{card.price}</div>}
                          </div>

                          {/* Botão */}
                          {card.showButton && card.buttonText && (
                            <button
                              className="w-full py-2 px-4 rounded font-medium transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: card.buttonColor || defaultButtonColor,
                                color: card.buttonTextColor || defaultButtonTextColor,
                              }}
                              onClick={() => handleButtonClick(card.buttonUrl || "")}
                            >
                              {card.buttonText}
                              {card.buttonUrl && card.buttonUrl !== "#" && <ExternalLink size={14} />}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navegação por Pontos */}
        {showDots && totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className="w-3 h-3 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: index === currentPage ? dotActiveColor : dotColor,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
