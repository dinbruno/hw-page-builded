"use client";

import { motion } from "framer-motion";

interface AnimationValue {
  type: "none" | "fade" | "slide" | "zoom" | "flip" | "bounce";
  duration: number;
  delay: number;
  easing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  repeat: number;
}

interface ParagraphProps {
  text?: string;
  fontSize?: number;
  color?: string;
  alignment?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  fontFamily?: string;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  hidden?: boolean;
  className?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  animation?: AnimationValue;
  width?: "auto" | "full";
  overflow?: "visible" | "hidden" | "ellipsis";
  maxLines?: number;
  customClasses?: string;
  background?: {
    color: string;
    opacity: number;
  };
}

const defaultAnimation: AnimationValue = {
  type: "none",
  duration: 500,
  delay: 0,
  easing: "ease",
  repeat: 0,
};

export default function StaticParagraph({
  text = "Clique para editar este texto. Você pode adicionar qualquer conteúdo aqui.",
  fontSize = 16,
  color = "#111928",
  alignment = "left",
  lineHeight = 1.5,
  fontWeight = "normal",
  fontFamily = "inherit",
  letterSpacing = 0,
  textTransform = "none",
  textDecoration = "none",
  hidden = false,
  className = "",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  animation = defaultAnimation,
  width = "full",
  overflow = "visible",
  maxLines = 0,
  customClasses = "",
  background = { color: "transparent", opacity: 1 },
}: ParagraphProps) {
  if (hidden) return null;

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

  const textAlignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[alignment];

  const fontWeightClass = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }[fontWeight];

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

  const widthClass = width === "full" ? "w-full" : "w-auto";

  const overflowStyles: React.CSSProperties = {
    overflow: overflow === "ellipsis" ? "hidden" : overflow,
    textOverflow: overflow === "ellipsis" ? "ellipsis" : "initial",
    whiteSpace: overflow === "ellipsis" ? "nowrap" : "normal",
  };

  // Add max lines if specified
  if (maxLines > 0 && overflow === "ellipsis") {
    overflowStyles.display = "-webkit-box";
    overflowStyles.WebkitLineClamp = maxLines;
    overflowStyles.WebkitBoxOrient = "vertical";
    overflowStyles.whiteSpace = "normal";
  }

  const backgroundStyle = background.color !== "transparent" ? { backgroundColor: background.color, opacity: background.opacity } : {};

  return (
    <motion.div className={`${widthClass} ${className} ${customClasses}`} style={marginStyle} {...getAnimationProps()}>
      <p
        style={{
          fontSize: `${fontSize}px`,
          color,
          lineHeight,
          fontWeight,
          fontFamily,
          letterSpacing: `${letterSpacing}px`,
          textTransform,
          textDecoration,
          ...paddingStyle,
          ...overflowStyles,
          ...backgroundStyle,
        }}
        className={`${textAlignmentClass} ${fontWeightClass} w-full min-h-[1em]`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </motion.div>
  );
}
