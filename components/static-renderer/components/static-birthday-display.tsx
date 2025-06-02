"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, Cake, Calendar, Sparkles, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { CollabsService } from "@/services/collabs/collabs.service";
import type { Collab } from "@/services/collabs/collabs.types";
import { BirthdayCard } from "./birthday-card";

interface BirthdayPerson {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  department?: string;
  role?: string;
}

interface StaticBirthdayDisplayProps {
  // Data Source
  dataSource?: "today" | "mock";
  useMockData?: boolean;

  // Display Type
  displayType?: "list" | "carousel";

  // Common Properties
  title?: string;
  showIcon?: boolean;
  iconType?: "gift" | "cake" | "calendar" | "sparkles";
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  hidden?: boolean;
  alignment?: "left" | "center" | "right";

  // List Specific Properties
  showDate?: boolean;
  showDepartment?: boolean;
  maxHeight?: number;
  avatarSize?: number;
  initialsBackgroundColor?: string;
  initialsTextColor?: string;
  itemSpacing?: number;
  itemHoverEffect?: boolean;
  displayMode?: "list" | "grid";
  gridColumns?: number;
  itemsPerPage?: number;
  showPagination?: boolean;
  titleSize?: number;
  nameSize?: number;
  dateSize?: number;
  departmentSize?: number;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";
  nameWeight?: "normal" | "medium" | "semibold" | "bold";
  dateWeight?: "normal" | "medium" | "semibold" | "bold";
  departmentWeight?: "normal" | "medium" | "semibold" | "bold";
  avatarShape?: "circle" | "rounded" | "square";
  itemBackgroundColor?: string;
  itemBorderRadius?: number;
  itemBorderWidth?: number;
  itemBorderColor?: string;
  itemPadding?: number;

  // Carousel Specific Properties
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  cardSpacing?: number;
  cardBackgroundColor?: string;
  cardBorderRadius?: number;
  cardShadow?: boolean;

  // Empty State Properties
  showEmptyState?: boolean;
  emptyStateText?: string;
  emptyStateIcon?: "gift" | "cake" | "calendar" | "sparkles";

  // Animation
  animation?: "fade" | "slide" | "scale" | "none";
  animationDuration?: number;

  // Responsive
  responsiveBreakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
  };

  // System props
  id?: string;
  style?: React.CSSProperties;
}

const defaultPeople: BirthdayPerson[] = [
  {
    id: "1",
    name: "Luiza Vieira",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740473796650-1aa512e71b83?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "15/02",
    department: "Design",
    role: "Designer",
  },
  {
    id: "2",
    name: "Bruno Dino",
    date: "22/03",
    department: "Tecnologia",
    role: "CTO",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740097670023-338a3d290b4a?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    date: "10/04",
    department: "Design",
    role: "Desenvolvedor",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    date: "05/05",
    department: "Tecnologia",
    role: "Marketing",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740011638726-fbee21cb3f36?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function StaticBirthdayDisplay({
  // Data Source
  dataSource = "today",
  useMockData = false,

  // Display Type
  displayType = "list",

  // Common Properties
  title = "Aniversariantes",
  showIcon = true,
  iconType = "cake",
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#f23030",
  hidden = false,
  alignment = "left",

  // List Specific Properties
  showDate = true,
  showDepartment = false,
  maxHeight = 300,
  avatarSize = 40,
  initialsBackgroundColor = "#f23030",
  initialsTextColor = "#ffffff",
  itemSpacing = 12,
  itemHoverEffect = true,
  displayMode = "list",
  gridColumns = 2,
  itemsPerPage = 4,
  showPagination = false,
  titleSize = 18,
  nameSize = 16,
  dateSize = 14,
  departmentSize = 14,
  titleWeight = "medium",
  nameWeight = "medium",
  dateWeight = "normal",
  departmentWeight = "normal",
  avatarShape = "circle",
  itemBackgroundColor = "transparent",
  itemBorderRadius = 8,
  itemBorderWidth = 0,
  itemBorderColor = "#e5e7eb",
  itemPadding = 8,

  // Carousel Specific Properties
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  cardWidth = 300,
  cardHeight = 400,
  cardSpacing = 20,
  cardBackgroundColor = "#9c27b0",
  cardBorderRadius = 12,
  cardShadow = true,

  // Empty State Properties
  showEmptyState = true,
  emptyStateText = "Não há aniversariantes para mostrar",
  emptyStateIcon = "cake",

  // Animation
  animation = "fade",
  animationDuration = 0.3,

  // Responsive
  responsiveBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
  },

  // System props
  id,
  style,
}: StaticBirthdayDisplayProps) {
  // State
  const [realPeople, setRealPeople] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // List state
  const [currentPage, setCurrentPage] = useState(0);

  // Carousel state
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Load birthday data
  useEffect(() => {
    loadBirthdayData();
  }, [dataSource, useMockData]);

  const loadBirthdayData = async () => {
    if (useMockData) {
      setRealPeople(defaultPeople);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let collaborators: Collab[] = [];

      if (dataSource === "today") {
        collaborators = await CollabsService.getTodayBirthdays();
      }

      // Transform Collab data to BirthdayPerson format
      const birthdayPeople: BirthdayPerson[] = collaborators.map((collaborator) => ({
        id: collaborator.id,
        name: collaborator.name,
        avatar: collaborator.thumbnail?.url || collaborator.thumb,
        date: collaborator.birthday ? formatBirthdayDate(collaborator.birthday) : "Data não informada",
        department: collaborator.position || collaborator.access_level?.name,
        role: collaborator.position || collaborator.access_level?.name,
      }));

      setRealPeople(birthdayPeople);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load birthday data");
      // Fallback to mock data
      setRealPeople(defaultPeople);
    } finally {
      setLoading(false);
    }
  };

  // Format birthday date for display
  const formatBirthdayDate = (birthDate: string): string => {
    try {
      const date = new Date(birthDate);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month}`;
    } catch {
      return "Data inválida";
    }
  };

  // Use real data or mock data based on settings
  const currentPeople = useMockData ? defaultPeople : realPeople;

  // Responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Autoplay para carrossel
  useEffect(() => {
    if (displayType === "carousel" && autoplay && currentPeople.length > 0) {
      const autoplayInterval = setInterval(() => {
        setActiveCarouselIndex((prev) => (prev + 1) % currentPeople.length);
      }, interval);
      return () => clearInterval(autoplayInterval);
    }
  }, [displayType, autoplay, interval, currentPeople.length]);

  if (hidden) return null;

  const getIcon = () => {
    switch (iconType) {
      case "gift":
        return <Gift size={titleSize} style={{ color: accentColor }} />;
      case "calendar":
        return <Calendar size={titleSize} style={{ color: accentColor }} />;
      case "sparkles":
        return <Sparkles size={titleSize} style={{ color: accentColor }} />;
      case "cake":
      default:
        return <Cake size={titleSize} style={{ color: accentColor }} />;
    }
  };

  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: animationDuration },
        };
      case "slide":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: animationDuration },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: animationDuration },
        };
      case "none":
      default:
        return {};
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ").filter((part) => part.length > 0);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const textAlignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  // Estilo do avatar com base na forma selecionada
  const getAvatarShapeStyle = () => {
    switch (avatarShape) {
      case "square":
        return { borderRadius: "0" };
      case "rounded":
        return { borderRadius: "8px" };
      case "circle":
      default:
        return { borderRadius: "50%" };
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundColor,
          color: textColor,
          borderRadius: "12px",
          ...style,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: accentColor }} />
          <p className="text-sm" style={{ color: textColor }}>
            Carregando aniversariantes...
          </p>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (currentPeople.length === 0 && showEmptyState) {
    return (
      <motion.div
        className={`w-full h-full ${textAlignmentClass}`}
        style={{
          backgroundColor,
          color: textColor,
          ...style,
        }}
        {...getAnimationProps()}
        id={id}
      >
        <div className="h-full w-full" style={{ padding: "24px" }}>
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2 group">
              {showIcon && (
                <div
                  className="flex items-center justify-center p-2 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    borderColor: `${accentColor}20`,
                    border: "1px solid",
                  }}
                >
                  {getIcon()}
                </div>
              )}
              <div className="flex-grow">
                <h3
                  className={`font-${titleWeight} leading-tight`}
                  style={{
                    color: titleColor,
                    fontSize: `${titleSize}px`,
                  }}
                >
                  {title}
                </h3>
              </div>
            </div>
            <div className="h-0.5 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
          </div>

          <div
            className="flex flex-col items-center justify-center py-16 text-center rounded-xl border-2 border-dashed"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}05`,
              minHeight: "200px",
            }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm" style={{ backgroundColor: `${accentColor}15` }}>
              {emptyStateIcon === "gift" && <Gift size={32} className="opacity-60" style={{ color: accentColor }} />}
              {emptyStateIcon === "cake" && <Cake size={32} className="opacity-60" style={{ color: accentColor }} />}
              {emptyStateIcon === "calendar" && <Calendar size={32} className="opacity-60" style={{ color: accentColor }} />}
              {emptyStateIcon === "sparkles" && <Sparkles size={32} className="opacity-60" style={{ color: accentColor }} />}
            </div>
            <h4 className="font-medium mb-2" style={{ color: textColor, fontSize: `${nameSize + 2}px` }}>
              {emptyStateText}
            </h4>
            <p className="text-sm opacity-60 max-w-sm" style={{ color: textColor }}>
              {dataSource === "today" && "Nenhum colaborador faz aniversário hoje."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Determinar número de colunas responsivo
  const getResponsiveGridColumns = () => {
    if (windowWidth < (responsiveBreakpoints?.sm || 640)) {
      return 1;
    } else if (windowWidth < (responsiveBreakpoints?.md || 768)) {
      return Math.min(2, gridColumns);
    } else if (windowWidth < (responsiveBreakpoints?.lg || 1024)) {
      return Math.min(3, gridColumns);
    }
    return gridColumns;
  };

  // Renderizar item individual da lista
  const renderPersonItem = (person: BirthdayPerson) => (
    <motion.div
      key={person.id}
      className="group relative overflow-hidden"
      whileHover={itemHoverEffect ? { y: -3, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      style={{
        marginBottom: `${itemSpacing}px`,
        backgroundColor: itemBackgroundColor,
        borderRadius: `${itemBorderRadius}px`,
        borderWidth: `${itemBorderWidth}px`,
        borderColor: itemBorderColor,
        borderStyle: "solid",
        padding: `${itemPadding}px`,
      }}
    >
      <div className="relative flex items-center gap-3">
        {/* Avatar with enhanced styling */}
        <div className="relative flex-shrink-0">
          <div
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              width: `${avatarSize}px`,
              height: `${avatarSize}px`,
              ...getAvatarShapeStyle(),
            }}
          >
            {person.avatar ? (
              <Image src={person.avatar || "/placeholder.svg"} alt={person.name} fill className="object-cover" />
            ) : (
              <div
                className="flex items-center justify-center w-full h-full"
                style={{
                  backgroundColor: initialsBackgroundColor,
                  color: initialsTextColor,
                  fontSize: `${nameSize * 0.6}px`,
                  fontWeight: nameWeight,
                }}
              >
                {getInitials(person.name)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <p
            className="truncate"
            style={{
              color: textColor,
              fontSize: `${nameSize}px`,
              fontWeight: nameWeight,
            }}
          >
            {person.name}
          </p>
          {showDate && (
            <p
              className="truncate"
              style={{
                color: accentColor,
                fontSize: `${dateSize}px`,
                fontWeight: dateWeight,
              }}
            >
              {person.date}
            </p>
          )}
          {showDepartment && person.department && (
            <p
              className="opacity-70 truncate"
              style={{
                fontSize: `${departmentSize}px`,
              }}
            >
              {person.department}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Renderizar conteúdo da lista
  const renderListContent = () => {
    // Paginação
    const totalPages = Math.ceil(currentPeople.length / itemsPerPage);
    const paginatedPeople = showPagination ? currentPeople.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) : currentPeople;

    const listContent = () => {
      switch (displayMode) {
        case "grid":
          return (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${getResponsiveGridColumns()}, 1fr)`,
                maxHeight: `${maxHeight}px`,
                overflowY: "auto",
              }}
            >
              {(showPagination ? paginatedPeople : currentPeople).map(renderPersonItem)}
            </div>
          );
        case "list":
        default:
          return (
            <div
              className="space-y-3 overflow-y-auto"
              style={{
                maxHeight: `${maxHeight}px`,
                gap: `${itemSpacing}px`,
              }}
            >
              {(showPagination ? paginatedPeople : currentPeople).map(renderPersonItem)}
            </div>
          );
      }
    };

    return (
      <>
        {listContent()}
        {/* Paginação */}
        {showPagination && totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              className="px-2 py-1 border rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={14} />
            </button>

            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              className="px-2 py-1 border rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </>
    );
  };

  // Renderizar conteúdo do carrossel
  const renderCarouselContent = () => {
    const totalContentWidth = currentPeople.length * (cardWidth + cardSpacing) - cardSpacing;
    const shouldScroll = totalContentWidth > windowWidth;

    const handlePrev = () => {
      setActiveCarouselIndex((prev) => (prev - 1 + currentPeople.length) % currentPeople.length);
    };

    const handleNext = () => {
      setActiveCarouselIndex((prev) => (prev + 1) % currentPeople.length);
    };

    const handleDotClick = (index: number) => {
      setActiveCarouselIndex(index);
    };

    return (
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out pb-8"
          style={{
            transform: shouldScroll ? `translateX(-${activeCarouselIndex * (cardWidth + cardSpacing)}px)` : "none",
            gap: `${cardSpacing}px`,
            justifyContent: shouldScroll ? "flex-start" : "center",
            minHeight: `${cardHeight + 60}px`,
          }}
        >
          {currentPeople.map((person) => (
            <div key={person.id} className="flex-shrink-0" style={{ width: `${cardWidth}px` }}>
              <div
                className={`w-full h-full rounded-lg transition-shadow duration-300 ${cardShadow ? "shadow-xl hover:shadow-2xl" : ""}`}
                style={{
                  borderRadius: `${cardBorderRadius}px`,
                  boxShadow: cardShadow ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
                }}
              >
                <BirthdayCard
                  name={person.name}
                  role={person.role || person.department || ""}
                  date={person.date}
                  avatar={person.avatar || ""}
                  backgroundColor={cardBackgroundColor}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                />
              </div>
            </div>
          ))}
        </div>

        {showArrows && currentPeople.length > 1 && shouldScroll && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50 transition-colors"
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50 transition-colors"
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {showDots && currentPeople.length > 1 && shouldScroll && (
          <div className="flex justify-center mt-4 gap-2">
            {currentPeople.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all ${activeCarouselIndex === index ? "w-6" : "w-3 bg-gray-300"}`}
                style={{
                  backgroundColor: activeCarouselIndex === index ? accentColor : undefined,
                }}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`w-full h-full ${textAlignmentClass}`}
      style={{
        backgroundColor,
        color: textColor,
        ...style,
      }}
      {...getAnimationProps()}
      id={id}
    >
      <div className="h-full w-full" style={{ padding: "24px" }}>
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2 group">
            {showIcon && (
              <div
                className="flex items-center justify-center p-2 rounded-lg shadow-sm transition-shadow duration-200"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderColor: `${accentColor}20`,
                  border: "1px solid",
                }}
              >
                {getIcon()}
              </div>
            )}
            <div className="flex-grow">
              <h3
                className={`font-${titleWeight} leading-tight transition-opacity duration-200`}
                style={{
                  color: titleColor,
                  fontSize: `${titleSize}px`,
                }}
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Decorative line */}
          <div className="h-0.5 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
        </div>

        {/* Content */}
        {displayType === "carousel" ? renderCarouselContent() : renderListContent()}

        {/* Error state indicator */}
        {error && !useMockData && (
          <div className="text-center mt-3">
            <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full">
              ⚠️ Exibindo dados de fallback devido a erro na API
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
