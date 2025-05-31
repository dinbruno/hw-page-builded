"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
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
  layout?: "masonry" | "grid" | "metro";
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
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Purple Sunset",
    createdAt: "2023-06-20T14:45:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Misty Forest",
    createdAt: "2023-07-05T09:15:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Tokyo Night",
    createdAt: "2023-08-12T22:10:00Z",
    width: 1200,
    height: 600,
    aspectRatio: 2 / 1,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "New York Sunset",
    createdAt: "2023-09-03T18:30:00Z",
    width: 800,
    height: 1200,
    aspectRatio: 2 / 3,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Red Mountains",
    createdAt: "2023-10-17T07:45:00Z",
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  },
];

export default function StaticEnhancedImageGallery({
  images = defaultImages,
  layout = "masonry",
  columns = 3,
  gap = 16,
  borderRadius = 8,
  showTitle = true,
  title = "Galeria",
  subtitle = "Veja nossas fotos",
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
  customClasses = "",
  id,
  style,
}: EnhancedImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter images based on search term
    if (searchTerm) {
      setFilteredImages(images.filter((image) => image.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredImages(images);
    }
  }, [searchTerm, images]);

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
                      className="w-full h-auto object-cover"
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
                      className="w-full h-auto object-cover"
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
                className="max-w-full max-h-[80vh] object-contain"
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
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))}
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
              onClick={() => setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))}
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
