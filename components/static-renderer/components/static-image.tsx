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
  captionPosition?: "below" | "overlay" | "hover";
  captionBackground?: string;
  captionColor?: string;
  captionOpacity?: number;
  alignment?: "left" | "center" | "right";
  hidden?: boolean;
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
    type: "none" | "fade" | "slide" | "zoom" | "pulse" | "bounce";
    duration: number;
    delay: number;
    easing: string;
    repeat: number;
  };
  background?: {
    type: "image" | "color" | "gradient";
    color: string;
    image: {
      url: string;
      size: "cover" | "contain" | "auto" | "custom";
      customSize?: string;
      position: "center" | "top" | "bottom" | "left" | "right" | "custom";
      customPosition?: string;
      repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
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
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: boolean;
    sepia: boolean;
    hueRotate: number;
    invert: boolean;
  };
  hoverEffect?: {
    enabled: boolean;
    type: "zoom" | "brighten" | "darken" | "blur" | "grayscale" | "none";
    intensity: number;
    scale: number;
    transition: number;
  };
  overlay?: {
    enabled: boolean;
    color: string;
    opacity: number;
    text?: string;
    textColor?: string;
    textSize?: number;
    textAlignment?: "left" | "center" | "right";
  };
  aspectRatio?: string;
  fitParent?: boolean;
  customClasses?: string;
}

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

const defaultAnimation = {
  type: "none" as const,
  duration: 500,
  delay: 0,
  easing: "ease",
  repeat: 0,
};

const defaultBackground = {
  type: "image" as const,
  color: "#f0f0f0",
  image: {
    url: "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "cover" as const,
    position: "center" as const,
    repeat: "no-repeat" as const,
  },
  gradient: {
    type: "linear" as const,
    angle: 90,
    colors: [
      { color: "#e2e8f0", position: 0 },
      { color: "#cbd5e1", position: 100 },
    ],
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
  },
};

const defaultFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: false,
  sepia: false,
  hueRotate: 0,
  invert: false,
};

const defaultHoverEffect = {
  enabled: false,
  type: "zoom" as const,
  intensity: 20,
  scale: 1.1,
  transition: 300,
};

const defaultOverlay = {
  enabled: false,
  color: "#000000",
  opacity: 0.5,
  text: "",
  textColor: "#ffffff",
  textSize: 24,
  textAlignment: "center" as const,
};

const defaultProps: StaticImageProps = {
  src: "https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "Imagem",
  width: "100%",
  height: "auto",
  objectFit: "cover",
  borderRadius: 8,
  shadow: "sm",
  caption: "Legenda da imagem",
  showCaption: false,
  captionPosition: "below",
  captionBackground: "rgba(0, 0, 0, 0.7)",
  captionColor: "#ffffff",
  captionOpacity: 0.7,
  alignment: "center",
  hidden: false,
  margin: { top: 16, right: 0, bottom: 16, left: 0 },
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  border: defaultBorder,
  animation: defaultAnimation,
  background: defaultBackground,
  filters: defaultFilters,
  hoverEffect: defaultHoverEffect,
  overlay: defaultOverlay,
  aspectRatio: "16/9",
  fitParent: false,
  customClasses: "",
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
    captionPosition,
    captionBackground,
    captionColor,
    captionOpacity,
    alignment,
    hidden,
    margin,
    padding,
    border,
    animation,
    background,
    filters,
    hoverEffect,
    overlay,
    aspectRatio,
    fitParent,
    customClasses,
  } = mergedProps;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

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

  // Função auxiliar para converter hex para rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
  };

  const getImageSrc = () => {
    const bg = background || defaultBackground;
    if (bg.type === "image" && bg.image.url) {
      return bg.image.url;
    } else if (src && src.trim() !== "") {
      return src;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23718096'%3EImagem%3C/text%3E%3C/svg%3E";
  };

  const getBackgroundStyle = () => {
    const bg = background || defaultBackground;
    if (bg.type === "color") {
      return { backgroundColor: bg.color };
    } else if (bg.type === "image" && bg.image.url) {
      const overlayStyle = bg.overlay.enabled
        ? `linear-gradient(rgba(${hexToRgb(bg.overlay.color)}, ${bg.overlay.opacity}), rgba(${hexToRgb(bg.overlay.color)}, ${bg.overlay.opacity}))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${bg.image.url})`,
        backgroundSize: bg.image.size === "custom" ? bg.image.customSize : bg.image.size,
        backgroundPosition: bg.image.position === "custom" ? bg.image.customPosition : bg.image.position,
        backgroundRepeat: bg.image.repeat,
      };
    } else if (bg.type === "gradient") {
      const gradientType =
        bg.gradient.type === "linear"
          ? `linear-gradient(${bg.gradient.angle}deg, ${bg.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${bg.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return { backgroundImage: gradientType };
    }

    // Fallback para imagem simples
    return {
      backgroundImage: `url(${getImageSrc()})`,
      backgroundSize: objectFit,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  const getFilterStyle = () => {
    const filterProps: string[] = [];

    if (filters) {
      if (filters.brightness !== 100) filterProps.push(`brightness(${filters.brightness}%)`);
      if (filters.contrast !== 100) filterProps.push(`contrast(${filters.contrast}%)`);
      if (filters.saturation !== 100) filterProps.push(`saturate(${filters.saturation}%)`);
      if (filters.blur > 0) filterProps.push(`blur(${filters.blur}px)`);
      if (filters.grayscale) filterProps.push(`grayscale(1)`);
      if (filters.sepia) filterProps.push(`sepia(1)`);
      if (filters.hueRotate !== 0) filterProps.push(`hue-rotate(${filters.hueRotate}deg)`);
      if (filters.invert) filterProps.push(`invert(1)`);
    }

    return filterProps.length > 0 ? filterProps.join(" ") : "none";
  };

  // Estilo para efeitos hover
  const getHoverStyle = () => {
    if (!hoverEffect?.enabled) return {};

    const { type, intensity, scale, transition } = hoverEffect;

    if (type === "zoom") {
      return {
        transition: `transform ${transition}ms ease-in-out`,
        transform: isHovered ? `scale(${scale})` : "scale(1)",
      };
    } else if (type === "brighten") {
      return {
        transition: `filter ${transition}ms ease-in-out`,
        filter: isHovered ? `brightness(${100 + intensity}%)` : "brightness(100%)",
      };
    } else if (type === "darken") {
      return {
        transition: `filter ${transition}ms ease-in-out`,
        filter: isHovered ? `brightness(${100 - intensity}%)` : "brightness(100%)",
      };
    } else if (type === "blur") {
      return {
        transition: `filter ${transition}ms ease-in-out`,
        filter: isHovered ? `blur(${intensity / 10}px)` : "blur(0px)",
      };
    } else if (type === "grayscale") {
      return {
        transition: `filter ${transition}ms ease-in-out`,
        filter: isHovered ? `grayscale(${intensity / 100})` : "grayscale(0)",
      };
    }

    return {};
  };

  // Configurar animações com Framer Motion
  const getAnimationProps = () => {
    const anim = animation || defaultAnimation;
    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: (anim.duration || 500) / 1000,
        delay: (anim.delay || 0) / 1000,
        ease: anim.easing || "ease",
        repeat: anim.repeat || 0,
        repeatType: anim.repeat ? ("loop" as const) : undefined,
      },
    };

    switch (anim.type) {
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

  const borderStyle = {
    borderWidth: border?.width && border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border?.style || "none",
    borderColor: border?.color || "#000000",
    borderRadius: border?.radius
      ? `${border.radius.topLeft || 0}px ${border.radius.topRight || 0}px ${border.radius.bottomRight || 0}px ${border.radius.bottomLeft || 0}px`
      : "0",
  };

  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};

  const fitParentStyle = fitParent
    ? {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: objectFit || "cover",
      }
    : {};

  // Definir caption position styles
  const captionStyles = {
    below: {
      position: "relative" as const,
      backgroundColor: "transparent",
      color: captionColor,
      padding: "0.5rem",
    },
    overlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: captionBackground,
      color: captionColor,
      padding: "0.5rem",
      opacity: captionOpacity,
    },
    hover: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: captionBackground,
      color: captionColor,
      padding: "0.5rem",
      opacity: isHovered ? captionOpacity : 0,
      transition: "opacity 0.3s ease-in-out",
    },
  };

  // Corrigir definição do captionPosition
  const captionPos = captionPosition || ("below" as const);

  // Definir bg como constante acessível globalmente
  const bg = background || defaultBackground;

  if (hidden) return null;

  return (
    <motion.div
      className={cn("relative group", alignmentClass, customClasses)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...getAnimationProps()}
      style={{
        width,
        height,
        ...aspectRatioStyle,
        ...marginStyle,
        ...paddingStyle,
        ...borderStyle,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        className={cn("relative h-full w-full overflow-hidden", shadowClass)}
        style={{
          ...getBackgroundStyle(),
          ...getHoverStyle(),
        }}
      >
        {bg.type !== "image" && (
          <img
            ref={imageRef}
            src={getImageSrc()}
            alt={alt || "Imagem"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn("transition-all duration-300", hasError ? "opacity-0" : "opacity-100")}
            style={{
              width: "100%",
              height: "100%",
              objectFit,
              filter: getFilterStyle(),
              ...fitParentStyle,
            }}
          />
        )}

        {overlay?.enabled && (
          <div
            className={cn("absolute inset-0 flex items-center justify-center")}
            style={{
              backgroundColor: overlay.color,
              opacity: overlay.opacity,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {overlay.text && (
              <div
                className="z-10 px-2 py-1"
                style={{
                  color: overlay.textColor,
                  fontSize: `${overlay.textSize}px`,
                  textAlign: overlay.textAlignment as any,
                  width: "100%",
                }}
              >
                {overlay.text}
              </div>
            )}
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-600">Falha ao carregar imagem</p>
          </div>
        )}
      </div>

      {showCaption && (
        <div
          className={cn("text-center text-sm", captionPos !== "below" ? "absolute" : "")}
          style={captionStyles[captionPos as keyof typeof captionStyles]}
        >
          <span>{caption}</span>
        </div>
      )}
    </motion.div>
  );
}
