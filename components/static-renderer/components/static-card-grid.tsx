"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface CardItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: {
    name: string;
    color: string;
    backgroundColor: string;
  };
  badge?: {
    text: string;
    color: string;
  };
  button?: {
    text: string;
    url: string;
  };
}

interface CardStyle {
  width: number | "auto";
  height: number | "auto";
  aspectRatio?: string;
  maxWidth?: string;
  minWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  shadow: string;
}

interface StaticCardGridProps {
  items?: CardItem[];
  columns?: number;
  gap?: number;
  cardStyle?: CardStyle;
  layout?: {
    imagePosition: "left" | "right";
    imageSize: "small" | "medium" | "large";
    contentAlignment: "left" | "center" | "right";
    verticalAlignment: "top" | "middle" | "bottom";
    showBadge: boolean;
    showButton: boolean;
    imageFit: "contain" | "cover" | "fill" | "none" | "scale-down";
    imageBorderRadius: number;
    truncateText: boolean;
  };
  textStyle?: {
    titleColor: string;
    descriptionColor: string;
    titleSize: number;
    descriptionSize: number;
  };
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  background?: {
    type: "color" | "image" | "gradient";
    color: string;
    image: {
      url: string;
      size: "cover" | "contain" | "auto";
      position: "center" | "top" | "bottom";
      repeat: "no-repeat" | "repeat";
    };
    gradient: {
      type: "linear" | "radial";
      angle: number;
      colors: Array<{ color: string; position: number }>;
    };
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
  hidden?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

// Default items for the card grid
const defaultCardItems: CardItem[] = [
  {
    id: "1",
    title: "Design de Interiores",
    description: "Transforme sua casa em um espaço único e acolhedor com nossos projetos personalizados.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Novo",
      color: "#22c55e",
    },
    button: {
      text: "Ver Projetos",
      url: "#",
    },
  },
  {
    id: "2",
    title: "Consultoria Online",
    description: "Receba orientações profissionais sem sair de casa. Agende sua consultoria virtual.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Destaque",
      color: "#3b82f6",
    },
    button: {
      text: "Agendar",
      url: "#",
    },
  },
  {
    id: "3",
    title: "Decoração Completa",
    description: "Serviço completo de decoração, desde a escolha dos móveis até os detalhes finais.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Popular",
      color: "#f59e0b",
    },
    button: {
      text: "Saiba Mais",
      url: "#",
    },
  },
  {
    id: "4",
    title: "Reformas",
    description: "Renove seus ambientes com projetos modernos e funcionais para seu espaço.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Oferta",
      color: "#ef4444",
    },
    button: {
      text: "Orçamento",
      url: "#",
    },
  },
  {
    id: "5",
    title: "Projetos Comerciais",
    description: "Crie ambientes comerciais que encantam seus clientes e potencializam vendas.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Empresarial",
      color: "#8b5cf6",
    },
    button: {
      text: "Conhecer",
      url: "#",
    },
  },
  {
    id: "6",
    title: "Consultoria de Cores",
    description: "Descubra a paleta perfeita para cada ambiente da sua casa ou empresa.",
    image:
      "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: {
      text: "Especial",
      color: "#ec4899",
    },
    button: {
      text: "Explorar",
      url: "#",
    },
  },
];

const defaultCardStyle: CardStyle = {
  width: "auto",
  height: "auto",
  aspectRatio: "auto",
  maxWidth: "100%",
  minWidth: "0",
  maxHeight: "none",
  minHeight: "0",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  padding: 16,
  shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

const defaultLayout = {
  imagePosition: "left" as const,
  imageSize: "small" as const,
  contentAlignment: "left" as const,
  verticalAlignment: "top" as const,
  showBadge: true,
  showButton: true,
  imageFit: "cover" as const,
  imageBorderRadius: 12,
  truncateText: true,
};

const defaultTextStyle = {
  titleColor: "#1a202c",
  descriptionColor: "#4a5568",
  titleSize: 18,
  descriptionSize: 14,
};

const defaultBackground = {
  type: "color" as const,
  color: "#f7fafc",
  image: {
    url: "",
    size: "cover" as const,
    position: "center" as const,
    repeat: "no-repeat" as const,
  },
  gradient: {
    type: "linear" as const,
    angle: 90,
    colors: [
      { color: "#f7fafc", position: 0 },
      { color: "#edf2f7", position: 100 },
    ],
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
  },
};

export default function StaticCardGrid({
  items = defaultCardItems,
  columns = 3,
  gap = 16,
  cardStyle = defaultCardStyle,
  layout = defaultLayout,
  textStyle = defaultTextStyle,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  background = defaultBackground,
  hidden = false,
  className = "",
  style = {},
  id,
}: StaticCardGridProps) {
  if (hidden) return null;

  const getImageSize = () => {
    switch (layout.imageSize) {
      case "small":
        return "w-1/3";
      case "medium":
        return "w-1/2";
      case "large":
        return "w-2/3";
      default:
        return "w-1/2";
    }
  };

  const getVerticalAlignment = () => {
    switch (layout.verticalAlignment) {
      case "top":
        return "justify-start";
      case "middle":
        return "justify-center";
      case "bottom":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  const getBackgroundStyle = () => {
    if (background.type === "color") {
      return { backgroundColor: background.color };
    } else if (background.type === "image" && background.image.url) {
      return {
        backgroundImage: `url(${background.image.url})`,
        backgroundSize: background.image.size,
        backgroundPosition: background.image.position,
        backgroundRepeat: background.image.repeat,
      };
    } else if (background.type === "gradient") {
      const gradientType = background.gradient.type === "linear" ? "linear-gradient" : "radial-gradient";
      const angle = background.gradient.type === "linear" ? `${background.gradient.angle}deg` : "circle";
      const colors = background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ");
      return {
        background: `${gradientType}(${angle}, ${colors})`,
      };
    }
    return {};
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

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: `${gap}px`,
  };

  const handleButtonClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  };

  return (
    <motion.div
      className={`w-full static-card-grid ${className}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
        ...getBackgroundStyle(),
        ...(style || {}),
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div style={gridStyle}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="overflow-hidden flex flex-col"
            style={{
              width: cardStyle.width,
              height: cardStyle.height,
              aspectRatio: cardStyle.aspectRatio,
              maxWidth: cardStyle.maxWidth,
              minWidth: cardStyle.minWidth,
              maxHeight: cardStyle.maxHeight,
              minHeight: cardStyle.minHeight,
              backgroundColor: cardStyle.backgroundColor,
              borderRadius: `${cardStyle.borderRadius}px`,
              padding: `${cardStyle.padding}px`,
              boxShadow: cardStyle.shadow,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className={`flex ${layout.imagePosition === "right" ? "flex-row-reverse" : "flex-row"} flex-1 min-h-0`}>
              <div className={`${getImageSize()} relative flex-shrink-0`}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full"
                    style={{
                      objectFit: layout.imageFit,
                      borderRadius: `${layout.imageBorderRadius}px`,
                    }}
                  />
                ) : item.icon ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: item.icon.backgroundColor,
                      borderRadius: `${layout.imageBorderRadius}px`,
                    }}
                  >
                    {React.createElement((Icons as any)[item.icon.name], {
                      className: "h-1/2 w-1/2",
                      style: { color: item.icon.color },
                    })}
                  </div>
                ) : null}
              </div>
              <div
                className={`flex-1 p-2 flex flex-col overflow-y-auto ${getVerticalAlignment()} ${
                  layout.contentAlignment === "center"
                    ? "items-center text-center"
                    : layout.contentAlignment === "right"
                    ? "items-end text-right"
                    : "items-start text-left"
                }`}
              >
                <div className="min-h-0 w-full">
                  {layout.showBadge && item.badge && (
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap mb-1"
                      style={{
                        backgroundColor: item.badge.color,
                        color: "#ffffff",
                      }}
                    >
                      {item.badge.text}
                    </span>
                  )}
                  <h3
                    style={{
                      color: textStyle.titleColor,
                      fontSize: `${textStyle.titleSize}px`,
                      marginBottom: "4px",
                      lineHeight: "1.2",
                      fontWeight: "600",
                    }}
                    className={layout.truncateText ? "truncate" : ""}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: textStyle.descriptionColor,
                      fontSize: `${textStyle.descriptionSize}px`,
                      marginBottom: "8px",
                      lineHeight: "1.3",
                    }}
                    className={layout.truncateText ? "line-clamp-2" : ""}
                  >
                    {item.description}
                  </p>
                  {layout.showButton && item.button && (
                    <button
                      onClick={() => handleButtonClick(item.button?.url || "#")}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-auto"
                    >
                      {item.button.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
