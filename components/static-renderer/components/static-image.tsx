"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Maximize2, Download, Loader, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StaticImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  caption?: string;
  showCaption?: boolean;
  alignment?: "left" | "center" | "right";
  filter?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
  grayscale?: boolean;
  sepia?: boolean;
  hoverEffect?: "none" | "zoom" | "brighten" | "darken" | "blur" | "scale" | "rotate";
  animation?: "none" | "fade" | "slide" | "zoom" | "pulse" | "bounce";
  animationDuration?: number;
  animationDelay?: number;
  lazyLoad?: boolean;
  clickAction?: "none" | "zoom" | "download" | "link";
  linkUrl?: string;
  linkTarget?: "_blank" | "_self";
  hidden?: boolean;
  customClasses?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  border?: {
    width: number;
    style: "none" | "solid" | "dashed" | "dotted";
    color: string;
  };
}

const defaultProps: StaticImageProps = {
  src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
  alt: "Imagem",
  width: "100%",
  height: "auto",
  objectFit: "cover",
  borderRadius: 0,
  shadow: "none",
  caption: "Legenda da imagem",
  showCaption: false,
  alignment: "center",
  filter: "none",
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: false,
  sepia: false,
  hoverEffect: "none",
  animation: "none",
  animationDuration: 500,
  animationDelay: 0,
  lazyLoad: true,
  clickAction: "none",
  linkUrl: "",
  linkTarget: "_blank",
  hidden: false,
  customClasses: "",
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  border: {
    width: 0,
    style: "none",
    color: "#000000",
  },
};

export default function StaticImage(props: StaticImageProps) {
  const mergedProps = { ...defaultProps, ...props };
  const {
    src,
    alt,
    width,
    height,
    objectFit,
    borderRadius,
    shadow,
    caption,
    showCaption,
    alignment,
    filter,
    brightness,
    contrast,
    saturation,
    blur,
    grayscale,
    sepia,
    hoverEffect,
    animation,
    animationDuration,
    animationDelay,
    lazyLoad,
    clickAction,
    linkUrl,
    linkTarget,
    hidden,
    customClasses,
    margin,
    padding,
    border,
  } = mergedProps;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazyLoad);

  useEffect(() => {
    if (!lazyLoad) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad]);

  // Handle click for zoom or download
  const handleClick = () => {
    if (clickAction === "zoom") {
      setIsZoomed(!isZoomed);
    } else if (clickAction === "download" && isLoaded && !hasError) {
      const link = document.createElement("a");
      link.href = src || "";
      link.download = alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoaded(false);
    setHasError(true);
  };

  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[alignment || "center"];

  const shadowClass = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }[shadow || "none"];

  // Construct CSS filters
  const getFilterStyle = () => {
    const filters: string[] = [];

    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
    if ((blur || 0) > 0) filters.push(`blur(${blur || 0}px)`);
    if (grayscale) filters.push("grayscale(1)");
    if (sepia) filters.push("sepia(1)");

    return filters.length > 0 ? filters.join(" ") : "none";
  };

  // Construct hover effect class
  const getHoverEffectClass = () => {
    switch (hoverEffect) {
      case "zoom":
        return "transition-transform duration-300 hover:scale-110";
      case "brighten":
        return "transition-filter duration-300 hover:brightness-125";
      case "darken":
        return "transition-filter duration-300 hover:brightness-75";
      case "blur":
        return "transition-filter duration-300 hover:blur-sm";
      case "scale":
        return "transition-transform duration-300 hover:scale-95";
      case "rotate":
        return "transition-transform duration-300 hover:rotate-3";
      default:
        return "";
    }
  };

  // Construct animation props
  const getAnimationProps = () => {
    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: (animationDuration || 500) / 1000,
        delay: (animationDelay || 0) / 1000,
      },
    };

    switch (animation) {
      case "fade":
        return {
          ...baseAnimation,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "slide":
        return {
          ...baseAnimation,
          initial: { x: -20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "zoom":
        return {
          ...baseAnimation,
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "pulse":
        return {
          ...baseAnimation,
          animate: { scale: [1, 1.05, 1] },
          transition: {
            ...baseAnimation.transition,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse" as const,
          },
        };
      case "bounce":
        return {
          ...baseAnimation,
          animate: { y: [0, -10, 0] },
          transition: {
            ...baseAnimation.transition,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse" as const,
          },
        };
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
        };
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

  const borderStyle =
    border?.style !== "none"
      ? {
          borderWidth: `${border?.width || 0}px`,
          borderStyle: border?.style || "none",
          borderColor: border?.color || "#000000",
        }
      : {};

  if (hidden) return null;

  const imageContent = (
    <div className="relative overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-600">Falha ao carregar imagem</p>
        </div>
      )}

      {isInView && (
        <motion.div className="relative w-full h-full" {...getAnimationProps()}>
          <img
            ref={imageRef}
            src={src || "/placeholder.svg"}
            alt={alt || ""}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn("transition-all duration-300", shadowClass, getHoverEffectClass(), customClasses, hasError ? "opacity-0" : "opacity-100")}
            style={{
              width: width || "100%",
              height: height || "auto",
              objectFit: objectFit as any,
              borderRadius: `${borderRadius}px`,
              filter: getFilterStyle(),
              ...borderStyle,
            }}
          />
        </motion.div>
      )}

      {clickAction === "zoom" && (
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const renderImage = () => {
    if (clickAction === "link" && linkUrl) {
      return (
        <a href={linkUrl} target={linkTarget} className="block">
          {imageContent}
        </a>
      );
    } else if (clickAction === "zoom" || clickAction === "download") {
      return (
        <div onClick={handleClick} className="cursor-pointer">
          {imageContent}
        </div>
      );
    }
    return imageContent;
  };

  return (
    <>
      <div
        className={cn("relative group", alignmentClass)}
        style={{
          width,
          ...marginStyle,
          ...paddingStyle,
        }}
      >
        {renderImage()}

        {showCaption && <figcaption className="text-center text-sm text-gray-600 mt-2">{caption}</figcaption>}
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-[90vw] max-h-[90vh]">
              <img src={src || "/placeholder.svg"} alt={alt || ""} className="max-w-full max-h-[90vh] object-contain" />
              <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full" onClick={() => setIsZoomed(false)}>
                <Maximize2 className="w-6 h-6 text-white" />
              </button>
              {showCaption && caption && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{caption}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
