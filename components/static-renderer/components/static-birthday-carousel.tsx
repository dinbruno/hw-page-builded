"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { BirthdayCard } from "./birthday-card";
import { CollabsService } from "@/services/collabs/collabs.service";
import type { Collab } from "@/services/collabs/collabs.types";

interface BirthdayPerson {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  role?: string;
}

interface StaticBirthdayCarouselProps {
  // Data Source
  dataSource?: "today" | "mock";
  useMockData?: boolean;

  // Carousel Settings
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  cardSpacing?: number;
  backgroundColor?: string;
  accentColor?: string;
  hidden?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

const defaultPeople: BirthdayPerson[] = [
  {
    id: "1",
    name: "Luiza Vieira",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740473796650-1aa512e71b83?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "17/11",
    role: "CTO",
  },
  {
    id: "2",
    name: "Bruno Dino",
    date: "22/03",
    role: "Designer",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740097670023-338a3d290b4a?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    date: "10/04",
    role: "Desenvolvedor",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    date: "05/05",
    role: "Marketing",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740011638726-fbee21cb3f36?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function StaticBirthdayCarousel({
  // Data Source
  dataSource = "today",
  useMockData = false,

  // Carousel Settings
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  cardWidth = 300,
  cardHeight = 400,
  cardSpacing = 20,
  backgroundColor = "#f9f9f9",
  accentColor = "#d345f8",
  hidden = false,
  id,
  style,
}: StaticBirthdayCarouselProps) {
  // State
  const [realPeople, setRealPeople] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Load birthday data
  useEffect(() => {
    loadBirthdayData();
  }, [dataSource, useMockData]);

  const loadBirthdayData = async () => {
    if (useMockData) {
      console.log("🎂 Birthday Carousel: Usando dados mock");
      setRealPeople(defaultPeople);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Birthday Carousel: Carregando dados reais...");

      let collaborators: Collab[] = [];

      if (dataSource === "today") {
        collaborators = await CollabsService.getTodayBirthdays();
      }

      console.log("✅ Birthday Carousel: Colaboradores carregados:", collaborators.length, "total");

      // Transform Collab data to BirthdayPerson format
      const birthdayPeople: BirthdayPerson[] = collaborators.map((collaborator) => ({
        id: collaborator.id,
        name: collaborator.name,
        avatar: collaborator.thumbnail?.url || collaborator.thumb,
        date: collaborator.birthday ? formatBirthdayDate(collaborator.birthday) : "Data não informada",
        role: collaborator.position || collaborator.access_level?.name,
      }));

      setRealPeople(birthdayPeople);
    } catch (err) {
      console.error("❌ Birthday Carousel: Erro ao carregar aniversariantes:", err);
      setError(err instanceof Error ? err.message : "Failed to load birthday data");
      // Fallback to mock data
      console.log("🔄 Birthday Carousel: Usando dados mock como fallback");
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

  // Autoplay
  useEffect(() => {
    if (autoplay && currentPeople.length > 0) {
      const autoplayInterval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % currentPeople.length);
      }, interval);
      return () => clearInterval(autoplayInterval);
    }
  }, [autoplay, interval, currentPeople.length]);

  if (hidden) return null;

  // Loading state
  if (loading) {
    return (
      <motion.div
        className="relative w-full static-birthday-carousel"
        style={{ backgroundColor, ...style }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="relative overflow-hidden py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: accentColor }} />
              <p className="text-lg" style={{ color: "#666" }}>
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
        className="relative w-full static-birthday-carousel"
        style={{ backgroundColor, ...style }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="relative overflow-hidden py-8">
          <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50 mx-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle size={16} />
              <span className="font-medium">Erro ao carregar aniversariantes</span>
            </div>
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={loadBirthdayData} className="text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-100 transition-colors">
              Tentar novamente
            </button>
          </div>
          <p className="text-center text-gray-500 mb-4">Usando dados de exemplo como fallback</p>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (currentPeople.length === 0) {
    return (
      <motion.div
        className="relative w-full static-birthday-carousel"
        style={{ backgroundColor, ...style }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        id={id}
      >
        <div className="relative overflow-hidden py-12">
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accentColor}20` }}>
                <PartyPopper size={32} style={{ color: accentColor }} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum aniversário hoje! 🎉</h3>
            <p className="text-gray-600 max-w-md mx-auto">Não há colaboradores fazendo aniversário hoje. Volte outro dia para ver as celebrações!</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + currentPeople.length) % currentPeople.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % currentPeople.length);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  // Calcular se há conteúdo suficiente para scroll
  const totalContentWidth = currentPeople.length * (cardWidth + cardSpacing) - cardSpacing;
  const shouldScroll = totalContentWidth > windowWidth;

  return (
    <motion.div
      className="relative w-full static-birthday-carousel"
      style={{ backgroundColor, ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className="relative overflow-hidden py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar size={24} style={{ color: accentColor }} />
            <h2 className="text-2xl font-bold text-gray-800">Aniversariantes de Hoje</h2>
          </div>
          <p className="text-gray-600">
            {currentPeople.length === 1 ? "1 pessoa fazendo aniversário" : `${currentPeople.length} pessoas fazendo aniversário`}
          </p>
        </div>

        {/* Carousel */}
        <div
          className="flex transition-transform duration-500 ease-in-out px-4"
          style={{
            transform: shouldScroll ? `translateX(-${activeIndex * (cardWidth + cardSpacing)}px)` : "none",
            gap: `${cardSpacing}px`,
            justifyContent: shouldScroll ? "flex-start" : "center",
          }}
        >
          {currentPeople.map((person) => (
            <div key={person.id} className="flex-shrink-0" style={{ width: `${cardWidth}px` }}>
              <BirthdayCard
                name={person.name}
                role={person.role || ""}
                date={person.date}
                avatar={person.avatar || ""}
                backgroundColor={accentColor}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
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
      </div>

      {/* Dots Navigation */}
      {showDots && currentPeople.length > 1 && shouldScroll && (
        <div className="flex justify-center mt-4 gap-2 pb-4">
          {currentPeople.map((_, index) => (
            <button
              key={index}
              className={`h-3 rounded-full transition-all ${activeIndex === index ? "w-6" : "w-3 bg-gray-300"}`}
              style={{
                backgroundColor: activeIndex === index ? accentColor : undefined,
              }}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}

      {/* Data Source Indicator */}
      {error && realPeople.length > 0 && (
        <div className="text-center mt-4">
          <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full">⚠️ Exibindo dados de fallback devido a erro na API</p>
        </div>
      )}
    </motion.div>
  );
}
