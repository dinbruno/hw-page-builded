"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimationValue {
  type: string;
  duration: number;
  delay: number;
  easing: string;
  repeat: number;
}

interface BackgroundImageValue {
  url: string;
  size: string;
  position: string;
  repeat: string;
  customSize?: string;
  customPosition?: string;
}

interface BackgroundGradientColor {
  color: string;
  position: number;
}

interface BackgroundGradientValue {
  type: string;
  angle: number;
  colors: BackgroundGradientColor[];
}

interface BackgroundOverlayValue {
  enabled: boolean;
  color: string;
  opacity: number;
}

interface BackgroundValue {
  type: string;
  color: string;
  image: BackgroundImageValue;
  gradient: BackgroundGradientValue;
  overlay: BackgroundOverlayValue;
}

interface StaticContentBlockProps {
  title?: string;
  titleSize?: number;
  titleColor?: string;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";

  text?: string;
  textSize?: number;
  textColor?: string;

  showImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "top" | "left" | "right";
  imageRadius?: number;
  imageHeight?: number;
  imageFit?: "cover" | "contain" | "fill" | "none";

  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonRadius?: number;
  buttonPadding?: { x: number; y: number };
  buttonWidth?: "auto" | "full";
  buttonTextWeight?: "normal" | "medium" | "semibold" | "bold";

  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
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
  animation?: AnimationValue;
  background?: BackgroundValue;
  hidden?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 1,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

const defaultAnimation: AnimationValue = {
  type: "none",
  duration: 500,
  delay: 0,
  easing: "ease",
  repeat: 0,
};

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

export default function StaticContentBlock({
  title = "Título da Seção",
  titleSize = 24,
  titleColor = "#111827",
  titleWeight = "semibold",

  text = "Este é um bloco de conteúdo que combina título, texto, imagem e botão. Clique para editar o texto.",
  textSize = 16,
  textColor = "#374151",

  showImage = true,
  imageSrc = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
  imageAlt = "Imagem",
  imagePosition = "right",
  imageRadius = 8,
  imageHeight = 300,
  imageFit = "cover",

  showButton = true,
  buttonText = "Saiba Mais",
  buttonUrl = "#",
  buttonColor = "#2563eb",
  buttonTextColor = "#ffffff",
  buttonRadius = 8,
  buttonPadding = { x: 16, y: 8 },
  buttonWidth = "auto",
  buttonTextWeight = "medium",

  backgroundColor = "#ffffff",
  alignment = "left",
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  border = defaultBorder,
  animation = defaultAnimation,
  background = defaultBackground,
  hidden = false,
  id,
  className = "",
  style,
}: StaticContentBlockProps) {
  if (hidden) return null;

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
  };

  // Get background style based on background type
  const getBackgroundStyle = () => {
    if (background?.type === "color") {
      return { backgroundColor: background.color || backgroundColor };
    } else if (background?.type === "image" && background.image?.url) {
      const overlayStyle = background.overlay?.enabled
        ? `linear-gradient(rgba(${hexToRgb(background.overlay.color)}, ${background.overlay.opacity}), rgba(${hexToRgb(background.overlay.color)}, ${
            background.overlay.opacity
          }))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${background.image.url})`,
        backgroundSize: background.image.size === "custom" ? background.image.customSize : background.image.size,
        backgroundPosition: background.image.position === "custom" ? background.image.customPosition : background.image.position,
        backgroundRepeat: background.image.repeat,
      };
    } else if (background?.type === "gradient" && background.gradient) {
      const gradientType =
        background.gradient.type === "linear"
          ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return { backgroundImage: gradientType };
    }

    return { backgroundColor };
  };

  // Animation props
  const getAnimationProps = () => {
    if (animation.type === "none") {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }

    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: animation.duration / 1000,
        delay: animation.delay / 1000,
        ease: animation.easing,
        repeat: animation.repeat,
        repeatType: "loop" as const,
      },
    };

    switch (animation.type) {
      case "fade":
        return {
          ...baseAnimation,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "slide":
        return {
          ...baseAnimation,
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "zoom":
        return {
          ...baseAnimation,
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "flip":
        return {
          ...baseAnimation,
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
        };
      case "bounce":
        return {
          ...baseAnimation,
          animate: { y: [0, -10, 0] },
          transition: {
            ...baseAnimation.transition,
            times: [0, 0.5, 1],
          },
        };
      default:
        return baseAnimation;
    }
  };

  // Style objects
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

  const textAlignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  // Component parts rendering functions
  const renderImageContent = () => {
    if (!showImage) return null;

    return (
      <div
        className={`${
          imagePosition === "top"
            ? "w-full mb-4"
            : imagePosition === "left"
            ? "md:w-1/3 md:pr-4 w-full mb-4 md:mb-0"
            : "md:w-1/3 md:pl-4 w-full mb-4 md:mb-0 md:order-last"
        }`}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          className="w-full h-auto"
          style={{
            maxHeight: `${imageHeight}px`,
            borderRadius: `${imageRadius}px`,
            objectFit: imageFit,
          }}
        />
      </div>
    );
  };

  const renderTextContent = () => {
    return (
      <div className={`${showImage && (imagePosition === "left" || imagePosition === "right") ? "md:w-2/3 mb-4" : "w-full"}`}>
        <h2
          style={{
            fontSize: `${titleSize}px`,
            color: titleColor,
            fontWeight: titleWeight === "normal" ? 400 : titleWeight === "medium" ? 500 : titleWeight === "semibold" ? 600 : 700,
          }}
          className="mb-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <p
          style={{
            fontSize: `${textSize}px`,
            color: textColor,
          }}
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: text }}
        />

        {showButton && (
          <a
            href={buttonUrl}
            className={`inline-block transition-colors ${buttonWidth === "full" ? "w-full text-center" : ""}`}
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
              borderRadius: `${buttonRadius}px`,
              padding: `${buttonPadding.y}px ${buttonPadding.x}px`,
              fontWeight: buttonTextWeight === "normal" ? 400 : buttonTextWeight === "medium" ? 500 : buttonTextWeight === "semibold" ? 600 : 700,
              textDecoration: "none",
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`w-full ${textAlignmentClass} ${className} static-content-block overflow-hidden`}
      style={{
        ...getBackgroundStyle(),
        ...borderStyle,
        ...marginStyle,
        ...(style || {}),
      }}
      {...getAnimationProps()}
      id={id}
    >
      <div className={`w-full ${imagePosition !== "top" ? "md:flex items-start" : ""}`} style={paddingStyle}>
        {imagePosition === "top" && renderImageContent()}
        {imagePosition === "left" && renderImageContent()}
        {renderTextContent()}
        {imagePosition === "right" && renderImageContent()}
      </div>
    </motion.div>
  );
}
