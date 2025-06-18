"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

interface AccordionProps {
  items?: AccordionItemData[];
  allowMultiple?: boolean;
  collapsible?: boolean;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  borderColor?: string;
  hoverColor?: string;
  activeColor?: string;
  titleSize?: number;
  contentSize?: number;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";
  contentWeight?: "normal" | "medium" | "semibold" | "bold";
  itemSpacing?: number;
  titlePadding?: number;
  contentPadding?: number;
  borderRadius?: number;
  borderWidth?: number;
  showIcons?: boolean;
  iconPosition?: "left" | "right";
  iconType?: "chevron" | "plus";
  layout?: "default" | "bordered" | "filled" | "minimal" | "modern" | "classic" | "elegant" | "compact";
  animationDuration?: number;
  enableHover?: boolean;
  hidden?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

const defaultItems: AccordionItemData[] = [
  {
    id: "item-1",
    title: "O que é o hywork?",
    content:
      "O hywork é uma plataforma completa de intranet que permite criar páginas personalizadas, gerenciar equipes e facilitar a comunicação interna da sua empresa.",
    isOpen: false,
  },
  {
    id: "item-2",
    title: "Como posso personalizar minha página?",
    content:
      "Você pode personalizar sua página usando nosso editor visual intuitivo. Arraste e solte componentes, altere cores, fontes e layouts conforme sua necessidade.",
    isOpen: false,
  },
  {
    id: "item-3",
    title: "Posso colaborar com minha equipe?",
    content:
      "Sim! O hywork permite colaboração em tempo real. Você pode convidar membros da equipe, definir permissões e trabalhar juntos na criação de conteúdo.",
    isOpen: false,
  },
];

export default function StaticAccordion({
  items = defaultItems,
  allowMultiple = false,
  collapsible = true,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  borderColor = "#e5e7eb",
  hoverColor = "#f9fafb",
  activeColor = "#f3f4f6",
  titleSize = 16,
  contentSize = 14,
  titleWeight = "medium",
  contentWeight = "normal",
  itemSpacing = 8,
  titlePadding = 16,
  contentPadding = 16,
  borderRadius = 8,
  borderWidth = 1,
  showIcons = true,
  iconPosition = "right",
  iconType = "chevron",
  layout = "default",
  animationDuration = 200,
  enableHover = true,
  hidden = false,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  id,
  style,
  customClasses = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  if (hidden) return null;

  const handleItemToggle = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    } else {
      setOpenItems((prev) => (prev.includes(itemId) && collapsible ? [] : [itemId]));
    }
  };

  const getLayoutStyles = () => {
    switch (layout) {
      case "bordered":
        return {
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: `${borderRadius}px`,
        };
      case "filled":
        return {
          backgroundColor: backgroundColor,
          borderRadius: `${borderRadius}px`,
        };
      case "minimal":
        return {
          border: "none",
          backgroundColor: "transparent",
        };
      case "modern":
        return {
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          borderRadius: `${borderRadius * 1.5}px`,
        };
      case "classic":
        return {
          border: `2px solid ${borderColor}`,
          borderRadius: "4px",
          backgroundColor: "#fafafa",
        };
      case "elegant":
        return {
          border: "none",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: `${borderRadius * 2}px`,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        };
      case "compact":
        return {
          border: `1px solid ${borderColor}`,
          borderRadius: `${borderRadius / 2}px`,
          backgroundColor: backgroundColor,
        };
      default:
        return {
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: `${borderRadius}px`,
          backgroundColor: backgroundColor,
        };
    }
  };

  const getItemLayoutStyles = (isOpen: boolean) => {
    switch (layout) {
      case "modern":
        return {
          backgroundColor: isOpen ? "#f1f5f9" : "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: `${borderRadius}px`,
          marginBottom: `${itemSpacing}px`,
          transition: "all 0.2s ease",
        };
      case "classic":
        return {
          backgroundColor: isOpen ? "#f0f9ff" : "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          marginBottom: `${itemSpacing / 2}px`,
        };
      case "elegant":
        return {
          backgroundColor: isOpen ? "#fef7ff" : "#ffffff",
          border: "none",
          borderRadius: `${borderRadius * 1.5}px`,
          marginBottom: `${itemSpacing * 1.2}px`,
          boxShadow: "0 2px 4px 0 rgb(0 0 0 / 0.05)",
        };
      case "compact":
        return {
          backgroundColor: isOpen ? activeColor : "transparent",
          border: "none",
          borderRadius: `${borderRadius / 2}px`,
          marginBottom: `${itemSpacing / 2}px`,
        };
      default:
        return {
          marginBottom: `${itemSpacing}px`,
        };
    }
  };

  const renderIcon = (isOpen: boolean) => {
    if (!showIcons) return null;

    const iconProps = {
      className: `h-4 w-4 transition-transform duration-${animationDuration}`,
      style: { color: titleColor },
    };

    switch (iconType) {
      case "plus":
        return isOpen ? <Minus {...iconProps} /> : <Plus {...iconProps} />;
      case "chevron":
      default:
        return (
          <ChevronDown
            {...iconProps}
            style={{
              ...iconProps.style,
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        );
    }
  };

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

  return (
    <div className="w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>
      <motion.div
        className={`static-accordion ${customClasses}`}
        style={{
          width: `calc(100% - ${margin?.left || 0}px - ${margin?.right || 0}px)`,
          ...marginStyle,
          ...(style || {}),
        }}
        id={id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-full"
          style={{
            ...paddingStyle,
            ...getLayoutStyles(),
          }}
        >
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="w-full"
                style={{
                  ...getItemLayoutStyles(isOpen),
                  marginBottom: index < items.length - 1 ? getItemLayoutStyles(isOpen).marginBottom || `${itemSpacing}px` : 0,
                }}
              >
                <button
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-${animationDuration} ${
                    enableHover ? "hover:bg-opacity-80" : ""
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{
                    padding: `${titlePadding}px`,
                    backgroundColor: isOpen ? activeColor : "transparent",
                    color: titleColor,
                    fontSize: `${titleSize}px`,
                    fontWeight: titleWeight,
                    borderRadius: `${borderRadius}px`,
                  }}
                  onClick={() => handleItemToggle(item.id)}
                  onMouseEnter={(e) => {
                    if (enableHover && !isOpen) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (enableHover && !isOpen) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {showIcons && iconPosition === "left" && renderIcon(isOpen)}
                    <span>{item.title}</span>
                  </div>
                  {showIcons && iconPosition === "right" && renderIcon(isOpen)}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: animationDuration / 1000 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="p-4 border-t"
                        style={{
                          padding: `${contentPadding}px`,
                          borderTopColor: borderColor,
                          color: textColor,
                          fontSize: `${contentSize}px`,
                          fontWeight: contentWeight,
                        }}
                      >
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
