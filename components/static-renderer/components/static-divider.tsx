"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import * as Icons from "lucide-react";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  lineType?: "solid" | "dashed" | "dotted" | "double";
  thickness?: number;
  length?: number;
  color?: string;
  position?: "start" | "center" | "end";

  // Icon properties
  showIcon?: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconBorderRadius?: number;
  iconPadding?: number;

  // Text properties
  showText?: boolean;
  text?: string;
  textColor?: string;
  textSize?: number;
  textWeight?: "normal" | "medium" | "semibold" | "bold";
  textBackgroundColor?: string;
  textPadding?: number;
  textBorderRadius?: number;

  // Gradient properties
  useGradient?: boolean;
  gradientDirection?: number;
  gradientColors?: Array<{ color: string; position: number }>;

  // Animation properties
  animationType?: "none" | "pulse" | "glow" | "slide" | "fade";
  animationDuration?: number;
  animationDelay?: number;

  // Shadow properties
  showShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Spacing
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  hidden?: boolean;

  // Common component props
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

const defaultGradientColors = [
  { color: "#3b82f6", position: 0 },
  { color: "#8b5cf6", position: 100 },
];

export default function StaticDivider({
  orientation = "horizontal",
  lineType = "solid",
  thickness = 1,
  length = 100,
  color = "#e5e7eb",
  position = "center",
  showIcon = false,
  iconName = "Minus",
  iconSize = 16,
  iconColor = "#6b7280",
  iconBackgroundColor = "#ffffff",
  iconBorderRadius = 50,
  iconPadding = 8,
  showText = false,
  text = "Divider",
  textColor = "#6b7280",
  textSize = 14,
  textWeight = "medium",
  textBackgroundColor = "#ffffff",
  textPadding = 12,
  textBorderRadius = 4,
  useGradient = false,
  gradientDirection = 90,
  gradientColors = defaultGradientColors,
  animationType = "none",
  animationDuration = 1000,
  animationDelay = 0,
  showShadow = false,
  shadowColor = "#000000",
  shadowBlur = 4,
  shadowOffsetX = 0,
  shadowOffsetY = 2,
  margin = { top: 20, right: 0, bottom: 20, left: 0 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  hidden = false,
  id,
  style,
  customClasses = "",
}: DividerProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (hidden) return null;

  const handleTextEdit = () => {
    setIsEditing(true);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const getContainerStyle = () => {
    const styles: React.CSSProperties = {
      margin: `${margin?.top || 0}px ${margin?.right || 0}px ${margin?.bottom || 0}px ${margin?.left || 0}px`,
      padding: `${padding?.top || 0}px ${padding?.right || 0}px ${padding?.bottom || 0}px ${padding?.left || 0}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: position === "start" ? "flex-start" : position === "end" ? "flex-end" : "center",
      position: "relative",
    };

    if (orientation === "vertical") {
      styles.flexDirection = "column";
      styles.height = `${length}%`;
      styles.width = "auto";
    } else {
      styles.flexDirection = "row";
      styles.width = `${length}%`;
      styles.height = "auto";
    }

    if (showShadow) {
      styles.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}40)`;
    }

    return styles;
  };

  const getAnimationProps = () => {
    const baseProps = {
      transition: {
        duration: animationDuration / 1000,
        delay: animationDelay / 1000,
        repeat: animationType !== "none" ? Infinity : 0,
        repeatType: "reverse" as const,
      },
    };

    switch (animationType) {
      case "pulse":
        return {
          ...baseProps,
          animate: { scale: [1, 1.05, 1] },
        };
      case "glow":
        return {
          ...baseProps,
          animate: { opacity: [0.7, 1, 0.7] },
        };
      case "slide":
        return {
          ...baseProps,
          animate: orientation === "horizontal" ? { x: [-5, 5, -5] } : { y: [-5, 5, -5] },
        };
      case "fade":
        return {
          ...baseProps,
          animate: { opacity: [0.5, 1, 0.5] },
        };
      default:
        return {};
    }
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    const IconComponent = (Icons as any)[iconName] || Icons.Minus;

    return (
      <div
        style={{
          backgroundColor: iconBackgroundColor,
          borderRadius: `${iconBorderRadius}px`,
          padding: `${iconPadding}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <IconComponent size={iconSize} style={{ color: iconColor }} />
      </div>
    );
  };

  const renderText = () => {
    if (!showText) return null;

    return (
      <div
        style={{
          backgroundColor: textBackgroundColor,
          borderRadius: `${textBorderRadius}px`,
          padding: `${textPadding}px`,
          zIndex: 1,
        }}
        onClick={handleTextEdit}
      >
        {isEditing ? (
          <input
            type="text"
            defaultValue={text}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: textColor,
              fontSize: `${textSize}px`,
              fontWeight: textWeight,
              textAlign: "center",
              minWidth: "100px",
            }}
            autoFocus
          />
        ) : (
          <span
            style={{
              color: textColor,
              fontSize: `${textSize}px`,
              fontWeight: textWeight,
              cursor: "pointer",
            }}
          >
            {text}
          </span>
        )}
      </div>
    );
  };

  const renderLine = () => {
    const lineStyles: React.CSSProperties = {
      flex: 1,
      height: orientation === "horizontal" ? `${thickness}px` : "100%",
      width: orientation === "vertical" ? `${thickness}px` : "100%",
    };

    if (useGradient) {
      const gradientString = `linear-gradient(${gradientDirection}deg, ${gradientColors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;
      lineStyles.background = gradientString;
    } else {
      lineStyles.backgroundColor = color;
    }

    // Apply line type for non-gradient lines
    if (!useGradient && lineType !== "solid") {
      if (orientation === "horizontal") {
        lineStyles.borderTop = `${thickness}px ${lineType} ${color}`;
        lineStyles.backgroundColor = "transparent";
        lineStyles.height = "0px";
      } else {
        lineStyles.borderLeft = `${thickness}px ${lineType} ${color}`;
        lineStyles.backgroundColor = "transparent";
        lineStyles.width = "0px";
      }
    }

    return <div style={lineStyles} />;
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

  return (
    <div className="w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>
      <motion.div
        className={`static-divider ${customClasses}`}
        style={{
          width: `calc(100% - ${margin?.left || 0}px - ${margin?.right || 0}px)`,
          ...marginStyle,
          ...paddingStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: position === "start" ? "flex-start" : position === "end" ? "flex-end" : "center",
          position: "relative",
          flexDirection: orientation === "vertical" ? "column" : "row",
          height: orientation === "vertical" ? `${length}%` : "auto",
          filter: showShadow ? `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}40)` : undefined,
          ...(style || {}),
        }}
        id={id}
        {...getAnimationProps()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {showIcon || showText ? (
          <>
            {position !== "start" && renderLine()}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderIcon()}
              {renderText()}
            </div>
            {position !== "end" && renderLine()}
          </>
        ) : (
          renderLine()
        )}
      </motion.div>
    </div>
  );
}
