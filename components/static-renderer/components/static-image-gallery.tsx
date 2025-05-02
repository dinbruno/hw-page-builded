"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface BackgroundValue {
  type: "color" | "gradient" | "image";
  color: string;
  image: {
    url: string;
    size: "cover" | "contain" | "auto" | "custom";
    position: "center" | "top" | "bottom" | "left" | "right" | "custom";
    repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  };
  gradient: {
    type: "linear" | "radial";
    angle: number;
    colors: { color: string; position: number }[];
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

interface ImageGalleryProps {
  images?: GalleryImage[];
  imagesToShow?: number;
  layout?: "grid" | "flex" | "masonry" | "main-with-thumbnails" | "carousel" | "filmstrip";
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "3:2" | "auto";
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  selectedBorderColor?: string;
  backgroundColor?: string;
  showOverlayText?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  textColor?: string;
  hoverEffect?: "zoom" | "fade" | "slide" | "rotate" | "blur" | "none";
  hoverEffectIntensity?: number;
  mainImageHeight?: number;
  thumbnailSize?: number;
  enableLightbox?: boolean;
  enableFullscreen?: boolean;
  enableInfiniteScroll?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  lazyLoad?: boolean;
  imageQuality?: number;
  imageObjectFit?: "cover" | "contain" | "fill" | "none";
  imageObjectPosition?: string;
  animationDuration?: number;
  animationType?: "fade" | "slide" | "zoom" | "none";
  hidden?: boolean;
  alignment?: "left" | "center" | "right";
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
  animation?: {
    type: "none" | "fade" | "slide" | "zoom" | "flip" | "bounce";
    duration: number;
    delay: number;
  };
  background?: BackgroundValue;
}

const defaultImages: GalleryImage[] = [
  {
    id: "1",
    src: "/images/card-image.avif",
    alt: "Imagem 1",
    title: "Apple Watch",
    description: "Vista frontal do relógio",
  },
  {
    id: "2",
    src: "/images/card-image.avif",
    alt: "Imagem 2",
    title: "Detalhe da tela",
    description: "Mostrando o mostrador personalizado",
  },
  {
    id: "3",
    src: "/images/card-image.avif",
    alt: "Imagem 3",
    title: "Lateral",
    description: "Vista lateral com botões",
  },
  {
    id: "4",
    src: "/images/card-image.avif",
    alt: "Imagem 4",
    title: "No pulso",
    description: "Como fica no pulso",
  },
  {
    id: "5",
    src: "/images/card-image.avif",
    alt: "Imagem 5",
    title: "Com laptop",
    description: "Conectado ao laptop",
  },
  {
    id: "6",
    src: "/images/card-image.avif",
    alt: "Imagem 6",
    title: "Ao ar livre",
    description: "Uso ao ar livre",
  },
];

// Default border
const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#000000",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

// Default background
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

export default function StaticImageGallery({
  images = defaultImages,
  imagesToShow,
  layout = "grid",
  columns = 3,
  gap = 8,
  aspectRatio = "1:1",
  borderColor = "#e5e7eb",
  borderWidth = 1,
  borderRadius = 10,
  selectedBorderColor = "#3b82f6",
  backgroundColor = "#ffffff",
  showOverlayText = false,
  overlayColor = "#000000",
  overlayOpacity = 0.5,
  textColor = "#ffffff",
  hoverEffect = "zoom",
  hoverEffectIntensity = 1.02,
  mainImageHeight = 400,
  thumbnailSize = 80,
  enableLightbox = false,
  enableFullscreen = false,
  enableInfiniteScroll = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = true,
  lazyLoad = true,
  imageQuality = 80,
  imageObjectFit = "cover",
  imageObjectPosition = "center",
  animationDuration = 0.3,
  animationType = "fade",
  hidden = false,
  alignment = "left",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  border = defaultBorder,
  animation = {
    type: "none",
    duration: 0,
    delay: 0,
  },
  background = defaultBackground,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localImages, setLocalImages] = useState<GalleryImage[]>(images || []);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  // Update local images when props change
  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  // Handle auto play
  useEffect(() => {
    if (autoPlay && !isLightboxOpen) {
      autoPlayRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev === localImages.length - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isLightboxOpen, localImages.length]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerEl) return;

    if (!document.fullscreenElement) {
      try {
        await containerEl.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const navigateToNext = () => {
    setSelectedImage((prev) => (prev === localImages.length - 1 ? 0 : prev + 1));
  };

  const navigateToPrev = () => {
    setSelectedImage((prev) => (prev === 0 ? localImages.length - 1 : prev - 1));
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Get aspect ratio CSS value
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "1:1":
        return "aspect-square";
      case "4:3":
        return "aspect-[4/3]";
      case "16:9":
        return "aspect-[16/9]";
      case "3:2":
        return "aspect-[3/2]";
      case "auto":
        return "";
      default:
        return "aspect-square";
    }
  };

  // Get hover effect CSS classes and styles
  const getHoverEffectProps = () => {
    switch (hoverEffect) {
      case "zoom":
        return {
          whileHover: { scale: hoverEffectIntensity },
          transition: { duration: animationDuration },
        };
      case "fade":
        return {
          whileHover: { opacity: 0.8 },
          transition: { duration: animationDuration },
        };
      case "slide":
        return {
          whileHover: { y: -5 },
          transition: { duration: animationDuration },
        };
      case "rotate":
        return {
          whileHover: { rotate: 5 },
          transition: { duration: animationDuration },
        };
      case "blur":
        return {
          whileHover: { filter: "blur(2px)" },
          transition: { duration: animationDuration },
        };
      case "none":
        return {};
      default:
        return {};
    }
  };

  // Get grid columns CSS class
  const getGridColumnsClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      case 6:
        return "grid-cols-6";
      default:
        return "grid-cols-3";
    }
  };

  // Get animation variants for different animation types
  const getAnimationVariants = () => {
    switch (animationType) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "slide":
        return {
          hidden: { x: 100, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 },
        };
      case "zoom":
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case "none":
        return {
          hidden: {},
          visible: {},
          exit: {},
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // Filter images based on imagesToShow
  const displayImages = useMemo(() => {
    if (!imagesToShow || imagesToShow >= localImages.length) {
      return localImages;
    }
    return localImages.slice(0, imagesToShow);
  }, [localImages, imagesToShow]);

  if (hidden) return null;

  // Render lightbox
  const renderLightbox = () => {
    if (!isLightboxOpen) return null;

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            )}
            <button
              onClick={closeLightbox}
              className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                className="relative w-full h-full flex items-center justify-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={getAnimationVariants()}
                transition={{ duration: animationDuration }}
              >
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={localImages[selectedImage]?.src || "/images/card-image.avif"}
                    alt={localImages[selectedImage]?.alt || "Imagem"}
                    width={1200}
                    height={800}
                    quality={imageQuality}
                    className="max-w-full max-h-[80vh] object-contain"
                    priority
                  />
                  {showOverlayText && (
                    <div
                      className="absolute inset-x-0 bottom-0 p-4"
                      style={{
                        backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                          .toString(16)
                          .padStart(2, "0")}`,
                        color: textColor,
                      }}
                    >
                      <h3 className="text-xl font-semibold">{localImages[selectedImage]?.title}</h3>
                      <p className="text-base">{localImages[selectedImage]?.description}</p>
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={navigateToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {showDots && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {localImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? "bg-white" : "bg-white bg-opacity-50"}`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Render main image with thumbnails layout
  const renderMainWithThumbnails = () => (
    <>
      <div
        className="relative overflow-hidden border"
        style={{
          height: `${mainImageHeight}px`,
          borderColor,
          borderWidth: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            className="relative w-full h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={getAnimationVariants()}
            transition={{ duration: animationDuration }}
          >
            <Image
              src={localImages[selectedImage]?.src || "/images/card-image.avif"}
              alt={localImages[selectedImage]?.alt || "Imagem principal"}
              fill
              quality={imageQuality}
              priority={!lazyLoad}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />

            {showOverlayText && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: textColor,
                }}
              >
                <h3 className="text-lg font-semibold">{localImages[selectedImage]?.title}</h3>
                <p className="text-sm">{localImages[selectedImage]?.description}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {enableLightbox && (
          <button
            onClick={() => openLightbox(selectedImage)}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            aria-label="Abrir em tela cheia"
          >
            <Maximize size={20} />
          </button>
        )}

        {showArrows && (
          <>
            <button
              onClick={navigateToPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={navigateToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div
        className="grid gap-2 mt-4"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {displayImages.map((image, index) => (
          <motion.button
            key={image.id}
            className="relative w-full overflow-hidden border"
            style={{
              height: `${thumbnailSize}px`,
              borderColor: selectedImage === index ? selectedBorderColor : borderColor,
              borderRadius: `${borderRadius}px`,
              borderWidth: selectedImage === index ? "2px" : `${borderWidth}px`,
            }}
            onClick={() => handleThumbnailClick(index)}
            {...getHoverEffectProps()}
          >
            <Image
              src={image.src || "/images/card-image.avif"}
              alt={image.alt}
              fill
              quality={imageQuality}
              loading={lazyLoad ? "lazy" : "eager"}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />
          </motion.button>
        ))}
      </div>
    </>
  );

  // Render carousel layout
  const renderCarousel = () => (
    <div className="relative overflow-hidden" style={{ height: `${mainImageHeight}px` }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedImage}
          className="relative w-full h-full"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getAnimationVariants()}
          transition={{ duration: animationDuration }}
        >
          <div
            className="relative w-full h-full border overflow-hidden"
            style={{
              borderColor,
              borderWidth: `${borderWidth}px`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <Image
              src={localImages[selectedImage]?.src || "/images/card-image.avif"}
              alt={localImages[selectedImage]?.alt || "Imagem"}
              fill
              quality={imageQuality}
              priority={!lazyLoad}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />

            {showOverlayText && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: textColor,
                }}
              >
                <h3 className="text-lg font-semibold">{localImages[selectedImage]?.title}</h3>
                <p className="text-sm">{localImages[selectedImage]?.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {enableLightbox && (
        <button
          onClick={() => openLightbox(selectedImage)}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
          aria-label="Abrir em tela cheia"
        >
          <Maximize size={20} />
        </button>
      )}

      {showArrows && (
        <>
          <button
            onClick={navigateToPrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={navigateToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {localImages.map((_, index) => (
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

  // Render filmstrip layout
  const renderFilmstrip = () => (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden border"
        style={{
          height: `${mainImageHeight}px`,
          borderColor,
          borderWidth: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            className="relative w-full h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={getAnimationVariants()}
            transition={{ duration: animationDuration }}
          >
            <Image
              src={localImages[selectedImage]?.src || "/images/card-image.avif"}
              alt={localImages[selectedImage]?.alt || "Imagem principal"}
              fill
              quality={imageQuality}
              priority={!lazyLoad}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />

            {showOverlayText && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: textColor,
                }}
              >
                <h3 className="text-lg font-semibold">{localImages[selectedImage]?.title}</h3>
                <p className="text-sm">{localImages[selectedImage]?.description}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {enableLightbox && (
          <button
            onClick={() => openLightbox(selectedImage)}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            aria-label="Abrir em tela cheia"
          >
            <Maximize size={20} />
          </button>
        )}
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar" style={{ gap: `${gap}px` }}>
          {localImages.map((image, index) => (
            <motion.div key={image.id} className="flex-shrink-0" style={{ width: `${thumbnailSize}px` }} {...getHoverEffectProps()}>
              <button
                className="relative w-full overflow-hidden border"
                style={{
                  height: `${thumbnailSize}px`,
                  borderColor: selectedImage === index ? selectedBorderColor : borderColor,
                  borderRadius: `${borderRadius}px`,
                  borderWidth: selectedImage === index ? "2px" : `${borderWidth}px`,
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image.src || "/images/card-image.avif"}
                  alt={image.alt}
                  fill
                  quality={imageQuality}
                  loading={lazyLoad ? "lazy" : "eager"}
                  className={`object-${imageObjectFit}`}
                  style={{ objectPosition: imageObjectPosition }}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {showArrows && (
          <>
            <button
              onClick={navigateToPrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={navigateToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Render grid layout
  const renderGrid = () => (
    <div className={`grid ${getGridColumnsClass()} gap-4`} style={{ gap: `${gap}px` }}>
      {displayImages.map((image, index) => (
        <motion.div
          key={image.id}
          className={`relative overflow-hidden border ${getAspectRatioStyle()}`}
          style={{
            borderColor,
            borderWidth: `${borderWidth}px`,
            borderRadius: `${borderRadius}px`,
          }}
          onClick={() => (enableLightbox ? openLightbox(index) : handleThumbnailClick(index))}
          {...getHoverEffectProps()}
        >
          <Image
            src={image.src || "/images/card-image.avif"}
            alt={image.alt}
            fill
            quality={imageQuality}
            loading={lazyLoad ? "lazy" : "eager"}
            className={`object-${imageObjectFit}`}
            style={{ objectPosition: imageObjectPosition }}
          />

          {showOverlayText && (
            <div
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{
                backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                  .toString(16)
                  .padStart(2, "0")}`,
                color: textColor,
              }}
            >
              <h3 className="text-lg font-semibold">{image.title}</h3>
              <p className="text-sm">{image.description}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Render flex layout
  const renderFlex = () => (
    <div className="flex flex-wrap" style={{ gap: `${gap}px` }}>
      {displayImages.map((image, index) => (
        <div
          key={image.id}
          style={{
            flexBasis: `calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px)`,
          }}
        >
          <motion.div
            className={`relative overflow-hidden border ${getAspectRatioStyle()}`}
            style={{
              borderColor,
              borderWidth: `${borderWidth}px`,
              borderRadius: `${borderRadius}px`,
              marginBottom: `${gap}px`,
            }}
            onClick={() => (enableLightbox ? openLightbox(index) : handleThumbnailClick(index))}
            {...getHoverEffectProps()}
          >
            <Image
              src={image.src || "/images/card-image.avif"}
              alt={image.alt}
              fill
              quality={imageQuality}
              loading={lazyLoad ? "lazy" : "eager"}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />

            {showOverlayText && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: textColor,
                }}
              >
                <h3 className="text-lg font-semibold">{image.title}</h3>
                <p className="text-sm">{image.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );

  // Render masonry layout (simulated with different heights)
  const renderMasonry = () => (
    <div className={`grid ${getGridColumnsClass()} gap-4`} style={{ gap: `${gap}px` }}>
      {displayImages.map((image, index) => {
        // Simulate masonry by varying heights based on index
        const heightMultiplier = 1 + (index % 3) * 0.25;

        return (
          <motion.div
            key={image.id}
            className="relative overflow-hidden border"
            style={{
              borderColor,
              borderWidth: `${borderWidth}px`,
              borderRadius: `${borderRadius}px`,
              height: `${200 * heightMultiplier}px`,
            }}
            onClick={() => (enableLightbox ? openLightbox(index) : handleThumbnailClick(index))}
            {...getHoverEffectProps()}
          >
            <Image
              src={image.src || "/images/card-image.avif"}
              alt={image.alt}
              fill
              quality={imageQuality}
              loading={lazyLoad ? "lazy" : "eager"}
              className={`object-${imageObjectFit}`}
              style={{ objectPosition: imageObjectPosition }}
            />

            {showOverlayText && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  backgroundColor: `${overlayColor}${Math.round(overlayOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: textColor,
                }}
              >
                <h3 className="text-lg font-semibold">{image.title}</h3>
                <p className="text-sm">{image.description}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  // Render layout based on layout prop
  const renderLayout = () => {
    switch (layout) {
      case "main-with-thumbnails":
        return renderMainWithThumbnails();
      case "grid":
        return renderGrid();
      case "flex":
        return renderFlex();
      case "masonry":
        return renderMasonry();
      case "carousel":
        return renderCarousel();
      case "filmstrip":
        return renderFilmstrip();
      default:
        return renderMainWithThumbnails();
    }
  };

  return (
    <motion.div
      ref={(el) => {
        if (el) {
          setContainerEl(el);
        }
      }}
      className="w-full"
      style={{
        backgroundColor: background.type === "color" ? background.color : backgroundColor,
        backgroundImage:
          background.type === "gradient"
            ? `linear-gradient(to right, ${background.gradient.colors[0].color}, ${
                background.gradient.colors[background.gradient.colors.length - 1].color
              })`
            : background.type === "image"
            ? `url(${background.image.url})`
            : "none",
        backgroundSize: background.type === "image" ? background.image.size : "cover",
        backgroundPosition: background.type === "image" ? background.image.position : "center",
        backgroundRepeat: background.type === "image" ? background.image.repeat : "no-repeat",
        position: "relative",
        marginTop: margin.top,
        marginRight: margin.right,
        marginBottom: margin.bottom,
        marginLeft: margin.left,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        borderWidth: border.width,
        borderStyle: border.style,
        borderColor: border.color,
        borderTopLeftRadius: border.radius.topLeft,
        borderTopRightRadius: border.radius.topRight,
        borderBottomRightRadius: border.radius.bottomRight,
        borderBottomLeftRadius: border.radius.bottomLeft,
      }}
      initial={
        animation?.type !== "none"
          ? {
              opacity: animation.type === "fade" ? 0 : 1,
              x: animation.type === "slide" ? 50 : 0,
              scale: animation.type === "zoom" ? 0.8 : 1,
              rotateY: animation.type === "flip" ? 90 : 0,
              y: animation.type === "bounce" ? 10 : 0,
            }
          : undefined
      }
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        y: 0,
        transition: {
          duration: animation?.duration || 0.3,
          delay: animation?.delay || 0,
          ease: animation?.type === "bounce" ? "backOut" : "easeOut",
        },
      }}
    >
      {background?.type === "image" && background.overlay.enabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: background.overlay.color,
            opacity: background.overlay.opacity,
            zIndex: 0,
          }}
        />
      )}
      <div className="relative z-10">{renderLayout()}</div>

      <AnimatePresence>{isLightboxOpen && renderLightbox()}</AnimatePresence>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </motion.div>
  );
}
