"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, ShoppingCart, Tag, Clock, Bookmark, Eye, Percent, Award } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  title?: string;
  image?: string;
  category?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  categoryColor?: string;
  categoryBgColor?: string;
  linkColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
  imageHeight?: number;
  hidden?: boolean;
  // Propriedades adicionais
  layout?: "default" | "horizontal" | "minimal" | "featured" | "compact" | "modern";
  primaryText?: string;
  secondaryText?: string;
  highlightText?: string;
  rating?: number;
  maxRating?: number;
  showRating?: boolean;
  ratingColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeBgColor?: string;
  badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showActionButton1?: boolean;
  showActionButton2?: boolean;
  actionText?: string;
  actionColor?: string;
  actionBgColor?: string;
  actionBorderRadius?: number;
  imageObjectFit?: "cover" | "contain" | "fill" | "none";
  titleLines?: number;
  descriptionLines?: number;
  titleSize?: number;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";
  categorySize?: number;
  descriptionSize?: number;
  linkSize?: number;
  primaryTextSize?: number;
  secondaryTextSize?: number;
  highlightTextSize?: number;
  animation?: {
    type: "none" | "fade" | "slide" | "zoom" | "flip" | "bounce";
    duration: number;
    delay: number;
    easing: string;
    repeat: number;
  };
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  border?: {
    width: number;
    style: "solid" | "dashed" | "dotted" | "none";
    color: string;
    radius: {
      topLeft: number;
      topRight: number;
      bottomRight: number;
      bottomLeft: number;
    };
  };
  background?: {
    type: "color" | "gradient" | "image";
    color: string;
    gradient?: {
      type: string;
      angle: number;
      colors: { color: string; position: number }[];
    };
    image?: {
      url: string;
      size: string;
      position: string;
      repeat: string;
    };
    overlay?: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
  iconType?: "arrow" | "cart" | "heart" | "bookmark" | "eye" | "none";
  badgeIconType?: "tag" | "percent" | "clock" | "star" | "award" | "none";
  aspectRatio?: "auto" | "square" | "video" | "portrait" | "custom";
  customAspectRatio?: string;
  imageOverlayColor?: string;
  imageOverlayOpacity?: number;
  titleColor?: string;
  descriptionColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  highlightTextColor?: string;
}

const defaultBorder = {
  width: 1,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

const defaultAnimation = {
  type: "fade" as const,
  duration: 300,
  delay: 0,
  easing: "ease",
  repeat: 0,
};

const defaultBackground = {
  type: "color" as const,
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

export default function StaticProductCard({
  title = "Título do Card",
  image = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  category = "Categoria",
  description = "Descrição curta que aparece no card.",
  linkText = "Leia mais",
  linkUrl = "#",
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  categoryColor = "#047857",
  categoryBgColor = "#ecfdf5",
  linkColor = "#2563eb",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  shadow = "md",
  imageHeight = 160,
  hidden = false,
  // Propriedades adicionais
  layout = "default",
  primaryText = "Texto Principal",
  secondaryText = "Texto Secundário",
  highlightText = "Destaque",
  rating = 4.5,
  maxRating = 5,
  showRating = true,
  ratingColor = "#f59e0b",
  showBadge = true,
  badgeText = "Novo",
  badgeColor = "#ffffff",
  badgeBgColor = "#3b82f6",
  badgePosition = "top-right",
  showActionButton1 = true,
  showActionButton2 = true,
  actionText = "Ação Principal",
  actionColor = "#ffffff",
  actionBgColor = "#3b82f6",
  actionBorderRadius = 8,
  imageObjectFit = "cover",
  titleLines = 1,
  descriptionLines = 2,
  titleSize = 18,
  titleWeight = "semibold",
  categorySize = 12,
  descriptionSize = 14,
  linkSize = 14,
  primaryTextSize = 18,
  secondaryTextSize = 14,
  highlightTextSize = 14,
  animation = defaultAnimation,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  border = defaultBorder,
  background = defaultBackground,
  iconType = "arrow",
  badgeIconType = "tag",
  aspectRatio = "auto",
  customAspectRatio = "4/3",
  imageOverlayColor = "#000000",
  imageOverlayOpacity = 0.3,
  titleColor = "#1f272f",
  descriptionColor = "#4b5563",
  primaryTextColor = "#1f272f",
  secondaryTextColor = "#9ca3af",
  highlightTextColor = "#ef4444",
}: ProductCardProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (hidden) return null;

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    inner: "shadow-inner",
  };

  // Configurar animações com Framer Motion
  const getAnimationProps = () => {
    if (animation.type === "none") {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }

    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: animation.duration / 1000,
        delay: animation.delay / 1000,
        ease: animation.easing,
        repeat: animation.repeat,
        repeatType: "loop" as const,
      },
    };

    switch (animation.type) {
      case "fade":
        return {
          ...baseAnimation,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "slide":
        return {
          ...baseAnimation,
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "zoom":
        return {
          ...baseAnimation,
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "flip":
        return {
          ...baseAnimation,
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
        };
      case "bounce":
        return {
          ...baseAnimation,
          animate: { y: [0, -10, 0] },
          transition: {
            ...baseAnimation.transition,
            times: [0, 0.5, 1],
          },
        };
      default:
        return baseAnimation;
    }
  };

  // Obter ícone para o link
  const getLinkIcon = () => {
    switch (iconType) {
      case "cart":
        return <ShoppingCart size={16} className="ml-1" />;
      case "heart":
        return <Heart size={16} className="ml-1" />;
      case "bookmark":
        return <Bookmark size={16} className="ml-1" />;
      case "eye":
        return <Eye size={16} className="ml-1" />;
      case "arrow":
        return <ArrowRight size={16} className="ml-1" />;
      case "none":
        return null;
      default:
        return <ArrowRight size={16} className="ml-1" />;
    }
  };

  // Obter ícone para o badge
  const getBadgeIcon = () => {
    switch (badgeIconType) {
      case "tag":
        return <Tag size={12} className="mr-1" />;
      case "percent":
        return <Percent size={12} className="mr-1" />;
      case "clock":
        return <Clock size={12} className="mr-1" />;
      case "star":
        return <Star size={12} className="mr-1" />;
      case "award":
        return <Award size={12} className="mr-1" />;
      case "none":
        return null;
      default:
        return <Tag size={12} className="mr-1" />;
    }
  };

  // Obter estilo de aspect ratio para a imagem
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "square":
        return { aspectRatio: "1/1" };
      case "video":
        return { aspectRatio: "16/9" };
      case "portrait":
        return { aspectRatio: "3/4" };
      case "custom":
        return { aspectRatio: customAspectRatio };
      case "auto":
      default:
        return { height: `${imageHeight}px` };
    }
  };

  // Obter posição do badge
  const getBadgePositionClass = () => {
    switch (badgePosition) {
      case "top-left":
        return "top-2 left-2";
      case "top-right":
        return "top-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
      default:
        return "top-2 right-2";
    }
  };

  // Renderizar estrelas para avaliação
  const renderRatingStars = () => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={16} fill={ratingColor} color={ratingColor} className="inline-block" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative inline-block">
          <Star size={16} color={ratingColor} className="inline-block" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
            <Star size={16} fill={ratingColor} color={ratingColor} className="inline-block" />
          </div>
        </div>
      );
    }

    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} size={16} color={ratingColor} className="inline-block opacity-40" />);
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm" style={{ color: ratingColor }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

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

  const borderStyle: Record<string, any> = {
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
  };

  // Add border to ensure border-radius works even when width is 0
  if (
    border.width === 0 &&
    (border.radius.topLeft > 0 || border.radius.topRight > 0 || border.radius.bottomLeft > 0 || border.radius.bottomRight > 0)
  ) {
    borderStyle.border = "0px solid transparent";
  }

  // Renderizar layout padrão
  const renderDefaultLayout = () => (
    <div style={{ ...paddingStyle }}>
      <div className="relative w-full overflow-hidden" style={getAspectRatioStyle()}>
        <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
            style={{
              backgroundColor: badgeBgColor,
              color: badgeColor,
            }}
          >
            {badgeIconType !== "none" && getBadgeIcon()}
            {badgeText}
          </div>
        )}

        {/* Botão de ação 1 */}
        {showActionButton1 && (
          <button
            className={`absolute top-2 ${badgePosition === "top-right" ? "right-12" : "right-2"} z-10 p-1.5 bg-white rounded-full shadow-sm`}
            style={{ color: "#ef4444" }}
          >
            <Heart size={16} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-md mb-2"
              style={{
                backgroundColor: categoryBgColor,
                color: categoryColor,
                fontSize: `${categorySize}px`,
              }}
            >
              {category}
            </span>
            <h3 className={`font-${titleWeight} line-clamp-${titleLines}`} style={{ color: titleColor, fontSize: `${titleSize}px` }}>
              {title}
            </h3>
          </div>
          {showRating && <div className="ml-2">{renderRatingStars()}</div>}
        </div>

        <p className={`text-sm line-clamp-${descriptionLines} mb-3`} style={{ color: descriptionColor, fontSize: `${descriptionSize}px` }}>
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold block" style={{ color: primaryTextColor, fontSize: `${primaryTextSize}px` }}>
              {primaryText}
            </span>
            {secondaryText && (
              <div className="flex items-center gap-2">
                <span className="text-sm line-through" style={{ color: secondaryTextColor, fontSize: `${secondaryTextSize}px` }}>
                  {secondaryText}
                </span>
                {highlightText && (
                  <span className="text-sm font-medium" style={{ color: highlightTextColor, fontSize: `${highlightTextSize}px` }}>
                    {highlightText}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {showActionButton2 ? (
              <button
                className="text-sm font-medium px-3 py-1.5 rounded-md flex items-center"
                style={{
                  backgroundColor: actionBgColor,
                  color: actionColor,
                  borderRadius: `${actionBorderRadius}px`,
                }}
              >
                <ShoppingCart size={16} className="mr-1" />
                {actionText}
              </button>
            ) : (
              <button className="text-sm font-medium flex items-center" style={{ color: linkColor, fontSize: `${linkSize}px` }}>
                {linkText}
                {iconType !== "none" && getLinkIcon()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar layout horizontal
  const renderHorizontalLayout = () => (
    <div className="flex" style={{ ...paddingStyle }}>
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          width: "40%",
          ...getAspectRatioStyle(),
        }}
      >
        <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
            style={{
              backgroundColor: badgeBgColor,
              color: badgeColor,
            }}
          >
            {badgeIconType !== "none" && getBadgeIcon()}
            {badgeText}
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-md mb-2"
              style={{
                backgroundColor: categoryBgColor,
                color: categoryColor,
                fontSize: `${categorySize}px`,
              }}
            >
              {category}
            </span>
            <h3 className={`font-${titleWeight} line-clamp-${titleLines}`} style={{ color: titleColor, fontSize: `${titleSize}px` }}>
              {title}
            </h3>
          </div>
        </div>

        {showRating && <div className="mb-2">{renderRatingStars()}</div>}

        <p className={`text-sm line-clamp-${descriptionLines} mb-3`} style={{ color: descriptionColor, fontSize: `${descriptionSize}px` }}>
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold block" style={{ color: primaryTextColor, fontSize: `${primaryTextSize}px` }}>
              {primaryText}
            </span>
            {secondaryText && (
              <div className="flex items-center gap-2">
                <span className="text-sm line-through" style={{ color: secondaryTextColor, fontSize: `${secondaryTextSize}px` }}>
                  {secondaryText}
                </span>
                {highlightText && (
                  <span className="text-sm font-medium" style={{ color: highlightTextColor, fontSize: `${highlightTextSize}px` }}>
                    {highlightText}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showActionButton1 && (
              <button className="p-1.5 bg-gray-100 rounded-full" style={{ color: "#ef4444" }}>
                <Heart size={16} />
              </button>
            )}
            {showActionButton2 ? (
              <button
                className="text-sm font-medium px-3 py-1.5 rounded-md flex items-center"
                style={{
                  backgroundColor: actionBgColor,
                  color: actionColor,
                  borderRadius: `${actionBorderRadius}px`,
                }}
              >
                <ShoppingCart size={16} className="mr-1" />
                {actionText}
              </button>
            ) : (
              <button className="text-sm font-medium flex items-center" style={{ color: linkColor, fontSize: `${linkSize}px` }}>
                {linkText}
                {iconType !== "none" && getLinkIcon()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar layout minimal
  const renderMinimalLayout = () => (
    <div style={{ ...paddingStyle }}>
      <div className="relative w-full overflow-hidden" style={getAspectRatioStyle()}>
        <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
            style={{
              backgroundColor: badgeBgColor,
              color: badgeColor,
            }}
          >
            {badgeIconType !== "none" && getBadgeIcon()}
            {badgeText}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className={`font-${titleWeight} line-clamp-${titleLines} mb-1`} style={{ color: titleColor, fontSize: `${titleSize}px` }}>
          {title}
        </h3>

        <div className="flex justify-between items-center">
          <span className="font-bold" style={{ color: primaryTextColor, fontSize: `${primaryTextSize}px` }}>
            {primaryText}
          </span>
          {showRating && <div>{renderRatingStars()}</div>}
        </div>
      </div>
    </div>
  );

  // Renderizar layout featured
  const renderFeaturedLayout = () => (
    <div style={{ ...paddingStyle }}>
      <div className="relative w-full overflow-hidden" style={getAspectRatioStyle()}>
        <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

        {/* Overlay escuro na imagem */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: imageOverlayColor,
            opacity: imageOverlayOpacity,
          }}
        />

        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
            style={{
              backgroundColor: badgeBgColor,
              color: badgeColor,
            }}
          >
            {badgeIconType !== "none" && getBadgeIcon()}
            {badgeText}
          </div>
        )}

        {/* Conteúdo sobreposto na imagem */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <span
            className="inline-block px-2 py-1 text-xs font-medium rounded-md mb-2 self-start"
            style={{
              backgroundColor: categoryBgColor,
              color: categoryColor,
              fontSize: `${categorySize}px`,
            }}
          >
            {category}
          </span>

          <h3 className={`font-${titleWeight} line-clamp-${titleLines} mb-2`} style={{ fontSize: `${titleSize}px`, color: "#ffffff" }}>
            {title}
          </h3>

          {showRating && <div className="mb-2">{renderRatingStars()}</div>}

          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold block" style={{ fontSize: `${primaryTextSize}px`, color: "#ffffff" }}>
                {primaryText}
              </span>
              {secondaryText && (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through" style={{ fontSize: `${secondaryTextSize}px`, color: "rgba(255, 255, 255, 0.7)" }}>
                    {secondaryText}
                  </span>
                  {highlightText && (
                    <span className="text-sm font-medium" style={{ fontSize: `${highlightTextSize}px`, color: "#fca5a5" }}>
                      {highlightText}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showActionButton1 && (
                <button className="p-1.5 bg-white bg-opacity-20 rounded-full" style={{ color: "#ef4444" }}>
                  <Heart size={16} />
                </button>
              )}
              {showActionButton2 ? (
                <button
                  className="text-sm font-medium px-3 py-1.5 rounded-md flex items-center"
                  style={{
                    backgroundColor: actionBgColor,
                    color: actionColor,
                    borderRadius: `${actionBorderRadius}px`,
                  }}
                >
                  <ShoppingCart size={16} className="mr-1" />
                  {actionText}
                </button>
              ) : (
                <button className="text-sm font-medium flex items-center" style={{ color: "#ffffff", fontSize: `${linkSize}px` }}>
                  {linkText}
                  {iconType !== "none" && getLinkIcon()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar layout compact
  const renderCompactLayout = () => (
    <div style={{ ...paddingStyle }}>
      <div className="flex flex-col h-full">
        <div className="relative w-full overflow-hidden" style={getAspectRatioStyle()}>
          <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

          {/* Badge */}
          {showBadge && (
            <div
              className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
              style={{
                backgroundColor: badgeBgColor,
                color: badgeColor,
              }}
            >
              {badgeIconType !== "none" && getBadgeIcon()}
              {badgeText}
            </div>
          )}

          {/* Botões de ação */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            {showActionButton1 && (
              <button className="p-1.5 bg-white rounded-full shadow-sm" style={{ color: "#ef4444" }}>
                <Heart size={16} />
              </button>
            )}
            {showActionButton2 && (
              <button className="p-1.5 bg-white rounded-full shadow-sm" style={{ color: actionBgColor }}>
                <ShoppingCart size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <div className="mb-1">
            <span
              className="inline-block px-2 py-0.5 text-xs font-medium rounded-md mb-1"
              style={{
                backgroundColor: categoryBgColor,
                color: categoryColor,
                fontSize: `${categorySize}px`,
              }}
            >
              {category}
            </span>
          </div>

          <h3 className={`font-${titleWeight} line-clamp-${titleLines} mb-1`} style={{ color: titleColor, fontSize: `${titleSize}px` }}>
            {title}
          </h3>

          {showRating && <div className="mb-1">{renderRatingStars()}</div>}

          <div className="mt-auto pt-2 flex justify-between items-center">
            <div>
              <span className="font-bold" style={{ color: primaryTextColor, fontSize: `${primaryTextSize}px` }}>
                {primaryText}
              </span>
              {secondaryText && (
                <span className="text-sm line-through ml-2" style={{ color: secondaryTextColor, fontSize: `${secondaryTextSize}px` }}>
                  {secondaryText}
                </span>
              )}
            </div>

            <button className="text-sm font-medium flex items-center" style={{ color: linkColor, fontSize: `${linkSize}px` }}>
              {linkText}
              {iconType !== "none" && getLinkIcon()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar layout modern
  const renderModernLayout = () => (
    <div style={{ ...paddingStyle }}>
      <div className="relative w-full overflow-hidden" style={getAspectRatioStyle()}>
        <Image src={image || "/placeholder.svg"} alt={title} fill className={`object-${imageObjectFit}`} />

        {/* Badge */}
        {showBadge && (
          <div
            className={`absolute ${getBadgePositionClass()} z-10 px-2 py-1 text-xs font-medium rounded-md flex items-center`}
            style={{
              backgroundColor: badgeBgColor,
              color: badgeColor,
            }}
          >
            {badgeIconType !== "none" && getBadgeIcon()}
            {badgeText}
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <span
          className="inline-block px-2 py-1 text-xs font-medium rounded-md mb-2"
          style={{
            backgroundColor: categoryBgColor,
            color: categoryColor,
            fontSize: `${categorySize}px`,
          }}
        >
          {category}
        </span>

        <h3 className={`font-${titleWeight} line-clamp-${titleLines} mb-2`} style={{ color: titleColor, fontSize: `${titleSize}px` }}>
          {title}
        </h3>

        {showRating && <div className="flex justify-center mb-2">{renderRatingStars()}</div>}

        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="font-bold" style={{ color: primaryTextColor, fontSize: `${primaryTextSize}px` }}>
            {primaryText}
          </span>
          {secondaryText && (
            <span className="text-sm line-through" style={{ color: secondaryTextColor, fontSize: `${secondaryTextSize}px` }}>
              {secondaryText}
            </span>
          )}
          {highlightText && (
            <span
              className="text-sm font-medium px-1.5 py-0.5 rounded"
              style={{
                color: "#ffffff",
                backgroundColor: highlightTextColor,
                fontSize: `${highlightTextSize}px`,
              }}
            >
              {highlightText}
            </span>
          )}
        </div>

        {showActionButton2 && (
          <button
            className="w-full text-sm font-medium py-2 rounded-md flex items-center justify-center"
            style={{
              backgroundColor: actionBgColor,
              color: actionColor,
              borderRadius: `${actionBorderRadius}px`,
            }}
          >
            <ShoppingCart size={16} className="mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );

  // Selecionar o layout apropriado
  const renderLayout = () => {
    switch (layout) {
      case "horizontal":
        return renderHorizontalLayout();
      case "minimal":
        return renderMinimalLayout();
      case "featured":
        return renderFeaturedLayout();
      case "compact":
        return renderCompactLayout();
      case "modern":
        return renderModernLayout();
      case "default":
      default:
        return renderDefaultLayout();
    }
  };

  return (
    <motion.div
      className={`overflow-hidden ${shadowClasses[shadow]}`}
      style={{
        backgroundColor,
        color: textColor,
        ...borderStyle,
        ...marginStyle,
      }}
      {...getAnimationProps()}
    >
      {renderLayout()}
    </motion.div>
  );
}
