"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, Cake, Calendar, Sparkles, ChevronLeft, ChevronRight, Loader2, AlertCircle, PartyPopper } from "lucide-react";
import { CollabsService } from "@/services/collabs/collabs.service";
import type { Collab } from "@/services/collabs/collabs.types";

interface BirthdayPerson {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  department?: string;
}

interface StaticBirthdayListProps {
  // Data Source
  dataSource?: "today" | "mock";
  useMockData?: boolean;

  // Basic Content
  title?: string;
  showIcon?: boolean;
  iconType?: "gift" | "cake" | "calendar" | "sparkles";
  showDate?: boolean;
  showDepartment?: boolean;

  // Display Mode
  displayMode?: "list" | "grid" | "carousel";
  gridColumns?: number;
  carouselAutoplay?: boolean;
  carouselInterval?: number;
  carouselShowArrows?: boolean;
  carouselShowDots?: boolean;

  // Pagination
  itemsPerPage?: number;
  showPagination?: boolean;

  // Typography
  titleSize?: number;
  nameSize?: number;
  dateSize?: number;
  departmentSize?: number;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";
  nameWeight?: "normal" | "medium" | "semibold" | "bold";
  dateWeight?: "normal" | "medium" | "semibold" | "bold";

  // Appearance
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;
  avatarSize?: number;
  avatarShape?: "circle" | "rounded" | "square";
  initialsBackgroundColor?: string;
  initialsTextColor?: string;
  itemSpacing?: number;
  itemHoverEffect?: boolean;
  itemBackgroundColor?: string;
  itemBorderRadius?: number;
  itemBorderWidth?: number;
  itemBorderColor?: string;
  itemPadding?: number;

  // States
  showEmptyState?: boolean;
  emptyStateText?: string;
  emptyStateIcon?: "gift" | "cake" | "calendar" | "sparkles";
  hidden?: boolean;
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
    date: "15 de fevereiro",
    department: "Design",
  },
  {
    id: "2",
    name: "Bruno Dino",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740097670023-338a3d290b4a?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "22 de março",
    department: "Tecnologia",
  },
  {
    id: "3",
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    date: "10 de abril",
    department: "Design",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740011638726-fbee21cb3f36?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "05 de maio",
    department: "Tecnologia",
  },
];

export default function StaticBirthdayList({
  // Data Source
  dataSource = "today",
  useMockData = false,

  // Basic Content
  title = "Aniversariantes do Mês",
  showIcon = true,
  iconType = "cake",
  showDate = true,
  showDepartment = false,

  // Display Mode
  displayMode = "list",
  gridColumns = 2,
  carouselAutoplay = true,
  carouselInterval = 5000,
  carouselShowArrows = true,
  carouselShowDots = true,

  // Pagination
  itemsPerPage = 4,
  showPagination = false,

  // Typography
  titleSize = 18,
  nameSize = 16,
  dateSize = 14,
  departmentSize = 14,
  titleWeight = "medium",
  nameWeight = "medium",
  dateWeight = "normal",

  // Appearance
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#f23030",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  maxHeight = 300,
  avatarSize = 40,
  avatarShape = "circle",
  initialsBackgroundColor = "#f23030",
  initialsTextColor = "#ffffff",
  itemSpacing = 12,
  itemHoverEffect = true,
  itemBackgroundColor = "transparent",
  itemBorderRadius = 8,
  itemBorderWidth = 0,
  itemBorderColor = "#e5e7eb",
  itemPadding = 8,

  // States
  showEmptyState = true,
  emptyStateText = "Não há aniversariantes para mostrar",
  emptyStateIcon = "cake",
  hidden = false,
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
}: StaticBirthdayListProps) {
  // State
  const [realPeople, setRealPeople] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Load birthday data
  useEffect(() => {
    loadBirthdayData();
  }, [dataSource, useMockData]);

  const loadBirthdayData = async () => {
    if (useMockData) {
      console.log("🎂 Birthday List: Usando dados mock");
      setRealPeople(defaultPeople);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Birthday List: Carregando dados reais...");

      let collaborators: Collab[] = [];

      if (dataSource === "today") {
        collaborators = await CollabsService.getTodayBirthdays();
      }

      console.log("✅ Birthday List: Colaboradores carregados:", collaborators.length, "total");

      // Transform Collab data to BirthdayPerson format
      const birthdayPeople: BirthdayPerson[] = collaborators.map((collaborator) => ({
        id: collaborator.id,
        name: collaborator.name,
        avatar: collaborator.thumbnail?.url || collaborator.thumb,
        date: collaborator.birthday ? formatBirthdayDate(collaborator.birthday) : "Data não informada",
        department: collaborator.position || collaborator.access_level?.name,
      }));

      setRealPeople(birthdayPeople);
    } catch (err) {
      console.error("❌ Birthday List: Erro ao carregar aniversariantes:", err);
      setError(err instanceof Error ? err.message : "Failed to load birthday data");
      // Fallback to mock data
      console.log("🔄 Birthday List: Usando dados mock como fallback");
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
    if (displayMode === "carousel" && carouselAutoplay && currentPeople.length > 0) {
      const interval = setInterval(() => {
        setActiveCarouselIndex((prev) => (prev + 1) % Math.ceil(currentPeople.length / getItemsPerView()));
      }, carouselInterval);
      return () => clearInterval(interval);
    }
  }, [displayMode, carouselAutoplay, carouselInterval, currentPeople.length, windowWidth]);

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

  // Determinar número de colunas com base na largura da tela
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

  // Determinar número de itens por visualização para o carrossel
  const getItemsPerView = () => {
    if (windowWidth < (responsiveBreakpoints?.sm || 640)) {
      return 1;
    } else if (windowWidth < (responsiveBreakpoints?.md || 768)) {
      return Math.min(2, itemsPerPage);
    } else if (windowWidth < (responsiveBreakpoints?.lg || 1024)) {
      return Math.min(3, itemsPerPage);
    }
    return itemsPerPage;
  };

  // Paginação
  const totalPages = Math.ceil(currentPeople.length / itemsPerPage);
  const paginatedPeople = showPagination ? currentPeople.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) : currentPeople;

  // Carrossel
  const itemsPerView = getItemsPerView();
  const totalCarouselPages = Math.ceil(currentPeople.length / itemsPerView);

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
        className="w-full static-birthday-list"
        style={{
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          border: `1px solid ${borderColor}`,
          ...style,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="p-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: accentColor }} />
              <p className="text-sm" style={{ color: textColor }}>
                Carregando aniversariantes...
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state with fallback data
  if (error && !useMockData && realPeople.length === 0) {
    return (
      <motion.div
        className="w-full static-birthday-list"
        style={{
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          border: `1px solid ${borderColor}`,
          ...style,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: titleColor }}>
            {showIcon && getIcon()}
            {title}
          </h3>
          <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle size={14} />
              <span className="text-sm font-medium">Erro ao carregar aniversariantes</span>
            </div>
            <p className="text-xs text-red-500 mb-2">{error}</p>
            <button onClick={loadBirthdayData} className="text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-100 transition-colors">
              Tentar novamente
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm">Usando dados de exemplo como fallback</p>
        </div>
      </motion.div>
    );
  }

  // Renderizar item individual
  const renderPersonItem = (person: BirthdayPerson) => (
    <motion.div
      key={person.id}
      className="flex items-center gap-3"
      whileHover={itemHoverEffect ? { x: 3, scale: 1.01 } : {}}
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
      <div
        className="relative flex-shrink-0 overflow-hidden flex items-center justify-center"
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
    </motion.div>
  );

  // Renderizar conteúdo com base no modo de exibição
  const renderContent = () => {
    if (currentPeople.length === 0 && showEmptyState) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          {emptyStateIcon === "gift" && <Gift size={48} className="mb-4 opacity-30" />}
          {emptyStateIcon === "cake" && <Cake size={48} className="mb-4 opacity-30" />}
          {emptyStateIcon === "calendar" && <Calendar size={48} className="mb-4 opacity-30" />}
          {emptyStateIcon === "sparkles" && <Sparkles size={48} className="mb-4 opacity-30" />}
          <p className="text-gray-500 text-sm">{emptyStateText}</p>
        </div>
      );
    }

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
      case "carousel":
        return (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${activeCarouselIndex * 100}%)`,
                  gap: `${itemSpacing}px`,
                }}
              >
                {Array.from({ length: totalCarouselPages }).map((_, pageIndex) => (
                  <div key={pageIndex} className="flex min-w-full" style={{ gap: `${itemSpacing}px` }}>
                    {currentPeople.slice(pageIndex * itemsPerView, (pageIndex + 1) * itemsPerView).map(renderPersonItem)}
                  </div>
                ))}
              </div>
            </div>

            {carouselShowArrows && totalCarouselPages > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveCarouselIndex((prev) => (prev - 1 + totalCarouselPages) % totalCarouselPages)}
                  style={{ zIndex: 10 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveCarouselIndex((prev) => (prev + 1) % totalCarouselPages)}
                  style={{ zIndex: 10 }}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {carouselShowDots && totalCarouselPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalCarouselPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${activeCarouselIndex === index ? "w-4" : "w-2 bg-gray-300"}`}
                    style={{
                      backgroundColor: activeCarouselIndex === index ? accentColor : undefined,
                    }}
                    onClick={() => setActiveCarouselIndex(index)}
                  />
                ))}
              </div>
            )}
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
    <motion.div
      className="w-full static-birthday-list"
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
        ...style,
      }}
      {...getAnimationProps()}
      id={id}
    >
      <div className="p-4">
        <h3
          className="flex items-center gap-2 mb-3"
          style={{
            color: titleColor,
            fontSize: `${titleSize}px`,
            fontWeight: titleWeight,
          }}
        >
          {showIcon && getIcon()}
          {title}
          {useMockData && <span className="text-xs ml-2 opacity-50">(dados de exemplo)</span>}
          {!useMockData && error && <span className="text-xs ml-2 opacity-50">(usando fallback)</span>}
          {!useMockData && !error && <span className="text-xs ml-2 opacity-50">(dados reais)</span>}
        </h3>

        {renderContent()}

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

        {/* Data Source Indicator */}
        {error && realPeople.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-xs text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded-full">
              ⚠️ Exibindo dados de fallback devido a erro na API
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
