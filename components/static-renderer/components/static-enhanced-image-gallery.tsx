"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  width: number;
  height: number;
  size?: number;
  aspectRatio?: number;
  selected?: boolean;
}

interface EnhancedImageGalleryProps {
  images?: GalleryImage[];
  layout?: "masonry" | "grid" | "metro" | "carousel";
  carouselStyle?: "classic" | "cards" | "polaroid" | "stack";
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: number;
  borderRadius?: number;
  showTitle?: boolean;
  title?: string;
  subtitle?: string;
  titleSize?: number;
  subtitleSize?: number;
  titleColor?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  showSearchBar?: boolean;
  enableLightbox?: boolean;
  hoverEffect?: "zoom" | "darken" | "lighten" | "blur" | "grayscale" | "sepia" | "rotate" | "scale" | "none";
  hoverEffectIntensity?: number;
  showImageInfo?: boolean;
  maxHeight?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  margin?: { top: number; right: number; bottom: number; left: number };
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
  hidden?: boolean;
  imageBorder?: {
    width: number;
    style: "solid" | "dashed" | "dotted" | "none";
    color: string;
    radius: number;
  };
  imageSize?: {
    width: number;
    height: number;
  };
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerPage?: number;
  transitionDuration?: number;
  infiniteLoop?: boolean;
  pauseOnHover?: boolean;
  clotheslineColor?: string;
  customClasses?: string;
  id?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

const defaultImageBorder = {
  width: 0,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: 8,
};

const defaultImageSize = {
  width: 300,
  height: 200,
};

const defaultImages: GalleryImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Mountain View",
    createdAt: "2023-05-15T10:30:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Purple Sunset",
    createdAt: "2023-06-20T14:45:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Misty Forest",
    createdAt: "2023-07-05T09:15:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Tokyo Night",
    createdAt: "2023-08-12T22:10:00Z",
    width: 1200,
    height: 600,
    aspectRatio: 2 / 1,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "New York Sunset",
    createdAt: "2023-09-03T18:30:00Z",
    width: 800,
    height: 1200,
    aspectRatio: 2 / 3,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Red Mountains",
    createdAt: "2023-10-17T07:45:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Hallstatt Night",
    createdAt: "2023-11-22T16:20:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
];

export default function StaticEnhancedImageGallery({
  images = defaultImages,
  layout = "masonry",
  carouselStyle = "classic",
  columns = 3,
  gap = 16,
  borderRadius = 8,
  showTitle = false,
  title = "",
  subtitle = "",
  titleSize = 24,
  subtitleSize = 16,
  titleColor = "#111827",
  subtitleColor = "#6B7280",
  backgroundColor = "#FFFFFF",
  showSearchBar = false,
  enableLightbox = true,
  hoverEffect = "darken",
  hoverEffectIntensity = 0.6,
  showImageInfo = true,
  maxHeight = 0,
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  border = defaultBorder,
  hidden = false,
  imageBorder = defaultImageBorder,
  imageSize = defaultImageSize,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = true,
  itemsPerPage = 1,
  transitionDuration = 0.5,
  infiniteLoop = true,
  pauseOnHover = true,
  clotheslineColor = "#D97706",
  customClasses = "",
  id,
  style,
}: EnhancedImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter images based on search term
    if (searchTerm) {
      setFilteredImages(images.filter((image) => image.name?.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredImages(images);
    }
  }, [searchTerm, images]);

  // Handle auto play for carousel
  useEffect(() => {
    if (layout === "carousel" && autoPlay && !lightboxOpen) {
      autoPlayRef.current = setInterval(() => {
        if (itemsPerPage > 1) {
          const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
          setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
        } else {
          setSelectedImage((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
        }
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [layout, autoPlay, autoPlayInterval, lightboxOpen, filteredImages.length, itemsPerPage]);

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

  const borderStyle = {
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
  };

  const handleImageClick = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const navigateToNext = () => {
    if (layout === "carousel" && itemsPerPage > 1) {
      const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    } else {
      setSelectedImage((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
    }
  };

  const navigateToPrev = () => {
    if (layout === "carousel" && itemsPerPage > 1) {
      const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
      setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    } else {
      setSelectedImage((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
    }
  };

  // Get hover effect styles
  const getHoverStyles = (effect: string) => {
    switch (effect) {
      case "zoom":
        return {
          scale: 1.05,
          transition: { duration: 0.2 },
        };
      case "darken":
        return {
          filter: `brightness(${1 - hoverEffectIntensity})`,
          transition: { duration: 0.2 },
        };
      case "lighten":
        return {
          filter: `brightness(${1 + hoverEffectIntensity})`,
          transition: { duration: 0.2 },
        };
      case "blur":
        return {
          filter: `blur(3px)`,
          transition: { duration: 0.2 },
        };
      case "grayscale":
        return {
          filter: "grayscale(100%)",
          transition: { duration: 0.2 },
        };
      case "sepia":
        return {
          filter: "sepia(100%)",
          transition: { duration: 0.2 },
        };
      case "rotate":
        return {
          rotate: 5,
          transition: { duration: 0.2 },
        };
      case "scale":
        return {
          scale: 1.1,
          transition: { duration: 0.2 },
        };
      default:
        return {};
    }
  };

  // Calculate spans for masonry layout
  const getSpan = (image: GalleryImage) => {
    if (layout === "metro") {
      const index = images.findIndex((img) => img.id === image.id);
      if (index % 5 === 0) return "col-span-2 row-span-2"; // Large image
      if (index % 5 === 1) return "col-span-1 row-span-2"; // Tall image
      if (index % 5 === 2) return "col-span-2 row-span-1"; // Wide image
      return "col-span-1 row-span-1"; // Regular image
    }

    // For masonry, calculate based on aspect ratio
    if (!image.aspectRatio) return "";

    if (image.aspectRatio > 1.7) return "col-span-2"; // Wide images span 2 columns
    if (image.aspectRatio < 0.6) return "row-span-2"; // Tall images span 2 rows

    return ""; // Regular images
  };

  // Render carousel based on style
  const renderCarousel = () => {
    switch (carouselStyle) {
      case "polaroid":
        return renderPolaroidCarousel();
      case "cards":
        return renderCardsCarousel();
      case "stack":
        return renderStackCarousel();
      default:
        return renderClassicCarousel();
    }
  };

  // Classic carousel
  const renderClassicCarousel = () => {
    // Multi-item version for classic
    if (itemsPerPage > 1) {
      const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
      const startIndex = currentPage * itemsPerPage;
      const currentImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

      return (
        <div
          className="relative overflow-hidden w-full"
          onMouseEnter={() => {
            if (pauseOnHover && autoPlayRef.current) {
              clearInterval(autoPlayRef.current);
            }
          }}
          onMouseLeave={() => {
            if (pauseOnHover && autoPlay && !lightboxOpen) {
              autoPlayRef.current = setInterval(() => {
                const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
                setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
              }, autoPlayInterval);
            }
          }}
        >
          <div className="flex items-center justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="flex gap-6 items-center justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: transitionDuration }}
              >
                {currentImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{
                      width: itemsPerPage === 1 ? "400px" : itemsPerPage === 2 ? "320px" : "260px",
                      aspectRatio: "4/5",
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="relative h-4/5 overflow-hidden">
                      <Image src={image.url || "/placeholder.svg"} alt={image.name || "Imagem"} fill className="object-cover" />
                      {enableLightbox && (
                        <button
                          onClick={() => handleImageClick(startIndex + index)}
                          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                          aria-label="Abrir em tela cheia"
                        >
                          <Maximize size={16} />
                        </button>
                      )}
                    </div>
                    {showImageInfo && (
                      <div className="p-4 h-1/5 flex flex-col justify-center space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">{image.name}</h3>
                        <p className="text-xs text-gray-600 leading-tight">{formatDate(image.createdAt)}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {showArrows && filteredImages.length > itemsPerPage && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white z-30"
                onClick={navigateToPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white z-30"
                onClick={navigateToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Dots indicator */}
          {showDots && filteredImages.length > itemsPerPage && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {Array.from({ length: Math.ceil(filteredImages.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPage ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Single item version (original)
    return (
      <div className="relative w-full">
        <div className="flex items-center justify-center py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              className="relative w-full max-w-2xl"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: transitionDuration }}
            >
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={filteredImages[selectedImage]?.url || "/placeholder.svg"}
                  alt={filteredImages[selectedImage]?.name || "Imagem"}
                  fill
                  className="object-cover"
                />

                {enableLightbox && (
                  <button
                    onClick={() => handleImageClick(selectedImage)}
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
                    aria-label="Abrir em tela cheia"
                  >
                    <Maximize size={20} />
                  </button>
                )}

                {showImageInfo && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white text-lg font-semibold">{filteredImages[selectedImage]?.name}</h3>
                    <p className="text-white/80 text-sm">{formatDate(filteredImages[selectedImage]?.createdAt)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {showArrows && (
          <>
            <button
              onClick={navigateToPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={navigateToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {showDots && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? "bg-white" : "bg-white bg-opacity-50"}`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Cards carousel
  const renderCardsCarousel = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentImages = filteredImages.slice(startIndex, endIndex);

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => {
          if (pauseOnHover && autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
          }
        }}
        onMouseLeave={() => {
          if (pauseOnHover && autoPlay && !lightboxOpen) {
            autoPlayRef.current = setInterval(() => {
              const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
              setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
            }, autoPlayInterval);
          }
        }}
      >
        <div className="h-full flex items-center justify-center overflow-hidden py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="flex gap-6 items-center justify-center h-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: transitionDuration }}
            >
              {currentImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{
                    width: itemsPerPage === 1 ? "350px" : itemsPerPage === 2 ? "280px" : "220px",
                    aspectRatio: "4/5",
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="relative h-4/5 overflow-hidden">
                    <Image src={image.url || "/placeholder.svg"} alt={image.name || "Imagem"} fill className="object-cover" />
                    {enableLightbox && (
                      <button
                        onClick={() => handleImageClick(startIndex + index)}
                        className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                        aria-label="Abrir em tela cheia"
                      >
                        <Maximize size={16} />
                      </button>
                    )}
                  </div>
                  {showImageInfo && (
                    <div className="p-4 h-1/5 flex flex-col justify-center space-y-1">
                      <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">{image.name}</h3>
                      <p className="text-xs text-gray-600 leading-tight">{formatDate(image.createdAt)}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {showArrows && filteredImages.length > itemsPerPage && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-30"
              onClick={navigateToPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-30"
              onClick={navigateToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dots indicator */}
        {showDots && filteredImages.length > itemsPerPage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {Array.from({ length: Math.ceil(filteredImages.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Stack carousel
  const renderStackCarousel = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentImages = filteredImages.slice(startIndex, endIndex);

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => {
          if (pauseOnHover && autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
          }
        }}
        onMouseLeave={() => {
          if (pauseOnHover && autoPlay && !lightboxOpen) {
            autoPlayRef.current = setInterval(() => {
              const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
              setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
            }, autoPlayInterval);
          }
        }}
      >
        <div className="h-full flex items-center justify-center overflow-hidden py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="relative flex gap-8 items-center justify-center h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: transitionDuration }}
            >
              {currentImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative"
                  style={{
                    width: itemsPerPage === 1 ? "350px" : itemsPerPage === 2 ? "280px" : "220px",
                    aspectRatio: "4/5",
                    zIndex: currentImages.length - index,
                  }}
                  initial={{ opacity: 0, rotateY: -45, x: -100 }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    rotateZ: index * 2 - 2,
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateZ: 0, zIndex: 50 }}
                >
                  <div className="w-full h-full bg-white rounded-lg overflow-hidden border-4 border-white">
                    <div className="relative h-4/5">
                      <Image src={image.url || "/placeholder.svg"} alt={image.name || "Imagem"} fill className="object-cover" />
                      {enableLightbox && (
                        <button
                          onClick={() => handleImageClick(startIndex + index)}
                          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                          aria-label="Abrir em tela cheia"
                        >
                          <Maximize size={14} />
                        </button>
                      )}
                    </div>
                    {showImageInfo && (
                      <div className="p-3 h-1/5 flex flex-col justify-center bg-gray-50 space-y-1">
                        <h3 className="text-xs font-semibold text-gray-800 truncate leading-tight">{image.name}</h3>
                        <p className="text-xs text-gray-600 leading-tight">{formatDate(image.createdAt)}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {showArrows && filteredImages.length > itemsPerPage && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-30"
              onClick={navigateToPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-30"
              onClick={navigateToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dots indicator */}
        {showDots && filteredImages.length > itemsPerPage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {Array.from({ length: Math.ceil(filteredImages.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Polaroid style carousel (varal de polaroids)
  const renderPolaroidCarousel = () => {
    // Multi-item version for polaroid
    if (itemsPerPage > 1) {
      const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
      const startIndex = currentPage * itemsPerPage;
      const currentImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

      return (
        <div className="relative w-full">
          {/* Clothesline */}
          <div
            className="absolute top-12 left-0 right-0 h-1 shadow-md z-10"
            style={{
              background: `linear-gradient(to right, ${clotheslineColor}, ${clotheslineColor}CC, ${clotheslineColor})`,
            }}
          ></div>

          <div className="relative pt-16 pb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="flex justify-center items-start"
                style={{
                  gap: itemsPerPage === 1 ? "0px" : itemsPerPage === 2 ? "32px" : itemsPerPage === 3 ? "24px" : itemsPerPage === 4 ? "16px" : "12px",
                }}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: transitionDuration, ease: "easeInOut" }}
              >
                {currentImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="relative"
                    initial={{ rotateZ: -15, y: 50, opacity: 0 }}
                    animate={{ rotateZ: Math.random() * 10 - 5, y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                    whileHover={{ rotateZ: 0, scale: 1.05 }}
                  >
                    {/* Clothespin - positioned exactly on the clothesline */}
                    <div
                      className="absolute z-30"
                      style={{
                        top: "-20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="relative">
                        {/* Clothespin body */}
                        <div className="w-3 h-6 bg-gradient-to-b from-amber-200 to-amber-400 rounded-sm transform rotate-12 border border-amber-300"></div>
                        {/* Clothespin spring/metal part */}
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full opacity-60"></div>
                      </div>
                    </div>

                    {/* Polaroid frame */}
                    <div
                      className="bg-white transform transition-all duration-300 border-2 border-gray-200"
                      style={{
                        width:
                          itemsPerPage === 1
                            ? "320px"
                            : itemsPerPage === 2
                            ? "260px"
                            : itemsPerPage === 3
                            ? "210px"
                            : itemsPerPage === 4
                            ? "170px"
                            : "140px",
                        maxWidth: "100%",
                        padding:
                          itemsPerPage === 1
                            ? "18px 18px 52px 18px"
                            : itemsPerPage === 2
                            ? "14px 14px 44px 14px"
                            : itemsPerPage === 3
                            ? "12px 12px 36px 12px"
                            : itemsPerPage === 4
                            ? "10px 10px 28px 10px"
                            : "8px 8px 24px 8px",
                      }}
                    >
                      {/* Image area */}
                      <div
                        className="relative bg-gray-100 overflow-hidden border border-gray-300"
                        style={{
                          width:
                            itemsPerPage === 1
                              ? "284px"
                              : itemsPerPage === 2
                              ? "232px"
                              : itemsPerPage === 3
                              ? "186px"
                              : itemsPerPage === 4
                              ? "150px"
                              : "124px",
                          height:
                            itemsPerPage === 1
                              ? "213px"
                              : itemsPerPage === 2
                              ? "174px"
                              : itemsPerPage === 3
                              ? "140px"
                              : itemsPerPage === 4
                              ? "113px"
                              : "93px",
                          aspectRatio: "4/3",
                        }}
                      >
                        <Image src={image.url || "/placeholder.svg"} alt={image.name || "Imagem"} fill className="object-cover" />

                        {enableLightbox && (
                          <button
                            onClick={() => handleImageClick(startIndex + index)}
                            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                            aria-label="Abrir em tela cheia"
                          >
                            <Maximize size={itemsPerPage === 1 ? 16 : itemsPerPage === 2 ? 14 : itemsPerPage === 3 ? 12 : 10} />
                          </button>
                        )}
                      </div>

                      {/* Polaroid text area */}
                      <div className="text-center">
                        {showImageInfo && (
                          <div className="space-y-1">
                            <h3
                              className="text-gray-800 leading-tight truncate"
                              style={{
                                fontFamily: "'Kalam', 'Comic Sans MS', cursive",
                                fontWeight: 400,
                                transform: "rotate(-1deg)",
                                fontSize:
                                  itemsPerPage === 1
                                    ? "14px"
                                    : itemsPerPage === 2
                                    ? "12px"
                                    : itemsPerPage === 3
                                    ? "10px"
                                    : itemsPerPage === 4
                                    ? "9px"
                                    : "8px",
                              }}
                            >
                              {image.name || "Memória especial"}
                            </h3>
                            <p
                              className="text-gray-600"
                              style={{
                                fontFamily: "'Kalam', 'Comic Sans MS', cursive",
                                fontWeight: 300,
                                transform: "rotate(0.5deg)",
                                fontSize:
                                  itemsPerPage === 1
                                    ? "11px"
                                    : itemsPerPage === 2
                                    ? "10px"
                                    : itemsPerPage === 3
                                    ? "9px"
                                    : itemsPerPage === 4
                                    ? "8px"
                                    : "7px",
                              }}
                            >
                              {formatDate(image.createdAt) || "Um momento único"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {showArrows && totalPages > 1 && (
              <>
                <button
                  onClick={navigateToPrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-all z-10"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={navigateToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-all z-10"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {showDots && totalPages > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentPage === index ? "bg-amber-600" : "bg-amber-300 hover:bg-amber-400"}`}
                  aria-label={`Ir para página ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Single item version (original)
    return (
      <div className="relative w-full" style={{ minHeight: "550px", height: "auto" }}>
        {/* Clothesline */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 shadow-md z-10"></div>

        <div className="relative pt-16 pb-8 flex justify-center items-start overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              className="relative"
              initial={{ rotateZ: -15, y: 50, opacity: 0 }}
              animate={{ rotateZ: Math.random() * 10 - 5, y: 0, opacity: 1 }}
              exit={{ rotateZ: 15, y: -50, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ rotateZ: 0, scale: 1.05 }}
            >
              {/* Clothespin - positioned exactly on the clothesline */}
              <div
                className="absolute z-30"
                style={{
                  top: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <div className="relative">
                  {/* Clothespin body */}
                  <div className="w-4 h-8 bg-gradient-to-b from-amber-200 to-amber-400 rounded-sm transform rotate-12 border border-amber-300"></div>
                  {/* Clothespin spring/metal part */}
                  <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-5 bg-gray-400 rounded-full opacity-60"></div>
                </div>
              </div>

              {/* Polaroid frame */}
              <div
                className="bg-white transform transition-all duration-300 border-2 border-gray-200"
                style={{
                  width: "360px",
                  maxWidth: "100%",
                  padding: "22px 22px 66px 22px",
                }}
              >
                {/* Image area */}
                <div
                  className="relative bg-gray-100 overflow-hidden border border-gray-300"
                  style={{
                    width: "316px",
                    height: "237px",
                    aspectRatio: "4/3",
                  }}
                >
                  <Image
                    src={filteredImages[selectedImage]?.url || "/placeholder.svg"}
                    alt={filteredImages[selectedImage]?.name || "Imagem"}
                    fill
                    className="object-cover"
                  />

                  {enableLightbox && (
                    <button
                      onClick={() => handleImageClick(selectedImage)}
                      className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                      aria-label="Abrir em tela cheia"
                    >
                      <Maximize size={16} />
                    </button>
                  )}
                </div>

                {/* Polaroid text area */}
                <div className="text-center">
                  {showImageInfo && (
                    <div className="space-y-2">
                      <h3
                        className="text-gray-800 leading-tight"
                        style={{
                          fontFamily: "'Kalam', 'Comic Sans MS', cursive",
                          fontWeight: 400,
                          transform: "rotate(-1deg)",
                          fontSize: "16px",
                        }}
                      >
                        {filteredImages[selectedImage]?.name || "Memória especial"}
                      </h3>
                      <p
                        className="text-gray-600"
                        style={{
                          fontFamily: "'Kalam', 'Comic Sans MS', cursive",
                          fontWeight: 300,
                          transform: "rotate(0.5deg)",
                          fontSize: "12px",
                        }}
                      >
                        {formatDate(filteredImages[selectedImage]?.createdAt) || "Um momento único"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {showArrows && (
            <>
              <button
                onClick={navigateToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-all z-10"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={navigateToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-all z-10"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {showDots && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? "bg-amber-600" : "bg-amber-300 hover:bg-amber-400"}`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render gallery based on layout
  const renderGallery = () => {
    const getGridCols = () => {
      switch (columns) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-1 sm:grid-cols-2";
        case 3:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
        case 4:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
        case 5:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
        default:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      }
    };

    switch (layout) {
      case "carousel":
        return renderCarousel();
      case "grid":
        return (
          <div className={`grid ${getGridCols()}`} style={{ gap: `${gap}px` }}>
            {filteredImages.map((image, index) => (
              <div key={image.id} className="relative group w-full">
                <motion.div
                  className="relative overflow-hidden w-full"
                  style={{
                    borderWidth: `${imageBorder.width}px`,
                    borderStyle: imageBorder.style,
                    borderColor: imageBorder.color,
                    borderRadius: `${imageBorder.radius}px`,
                  }}
                  whileHover={getHoverStyles(hoverEffect)}
                >
                  <div className="w-full cursor-pointer" onClick={() => handleImageClick(index)}>
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      width={image.width}
                      height={image.height}
                      className="w-full h-auto object-fill"
                      style={{
                        borderRadius: `${imageBorder.radius}px`,
                      }}
                    />
                  </div>

                  {showImageInfo && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-sm text-white font-medium truncate">{image.name}</p>
                      <p className="text-xs text-white/80">{formatDate(image.createdAt)}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        );

      case "metro":
        return (
          <div className="grid grid-cols-3 auto-rows-min" style={{ gap: `${gap}px` }}>
            {filteredImages.map((image, index) => (
              <div key={image.id} className={`relative group ${getSpan(image)}`} style={{ minHeight: "200px" }}>
                <motion.div
                  className="relative h-full overflow-hidden w-full"
                  style={{
                    borderWidth: `${imageBorder.width}px`,
                    borderStyle: imageBorder.style,
                    borderColor: imageBorder.color,
                    borderRadius: `${imageBorder.radius}px`,
                  }}
                  whileHover={getHoverStyles(hoverEffect)}
                >
                  <div className="w-full h-full cursor-pointer" onClick={() => handleImageClick(index)}>
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      fill
                      className="object-cover"
                      style={{
                        borderRadius: `${imageBorder.radius}px`,
                      }}
                    />
                  </div>

                  {showImageInfo && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-sm text-white font-medium truncate">{image.name}</p>
                      <p className="text-xs text-white/80">{formatDate(image.createdAt)}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        );

      case "masonry":
      default:
        return (
          <div className={`grid ${getGridCols()} auto-rows-max`} style={{ gap: `${gap}px` }}>
            {filteredImages.map((image, index) => (
              <div key={image.id} className={`relative group w-full ${getSpan(image)}`}>
                <motion.div
                  className="relative overflow-hidden h-full w-full"
                  style={{
                    borderWidth: `${imageBorder.width}px`,
                    borderStyle: imageBorder.style,
                    borderColor: imageBorder.color,
                    borderRadius: `${imageBorder.radius}px`,
                  }}
                  whileHover={getHoverStyles(hoverEffect)}
                >
                  <div className="w-full cursor-pointer" onClick={() => handleImageClick(index)}>
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      width={image.width}
                      height={image.height}
                      className="w-full h-auto object-fill"
                      style={{
                        borderRadius: `${imageBorder.radius}px`,
                      }}
                    />
                  </div>

                  {showImageInfo && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-sm text-white font-medium truncate">{image.name}</p>
                      <p className="text-xs text-white/80">{formatDate(image.createdAt)}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        );
    }
  };

  // Render lightbox
  const renderLightbox = () => {
    if (!lightboxOpen) return null;

    const currentImage = filteredImages[lightboxIndex];

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              className="text-white hover:text-gray-300 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <Image
                src={currentImage.url || "/placeholder.svg"}
                alt={currentImage.name}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-fill"
              />
            </div>
          </div>

          <div className="p-4 bg-black/50 text-white">
            <h3 className="text-xl font-semibold">{currentImage.name}</h3>
            <p className="text-sm opacity-80">{formatDate(currentImage.createdAt)}</p>
          </div>

          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <button
              className="text-white hover:text-gray-300 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              onClick={navigateToPrev}
              aria-label="Imagem anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              className="text-white hover:text-gray-300 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              onClick={navigateToNext}
              aria-label="Próxima imagem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className={`w-full static-enhanced-image-gallery ${customClasses}`}
      style={{
        backgroundColor,
        ...borderStyle,
        ...marginStyle,
        ...paddingStyle,
        maxHeight: maxHeight > 0 ? `${maxHeight}px` : "none",
        overflow: maxHeight > 0 ? "auto" : "visible",
        ...(style || {}),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      {/* Header */}
      {(showTitle || showSearchBar) && (
        <div className="mb-6 flex flex-col gap-4">
          {showTitle && (
            <div>
              <h2
                className="font-semibold"
                style={{
                  fontSize: `${titleSize}px`,
                  color: titleColor,
                }}
              >
                {title}
              </h2>
              <p
                className="mt-1"
                style={{
                  fontSize: `${subtitleSize}px`,
                  color: subtitleColor,
                }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {showSearchBar && (
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar imagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gallery */}
      <div className="w-full">{renderGallery()}</div>

      {/* Lightbox */}
      {renderLightbox()}
    </motion.div>
  );
}
