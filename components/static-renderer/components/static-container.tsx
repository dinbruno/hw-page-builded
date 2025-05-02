"use client";

import { motion } from "framer-motion";
import type React from "react";

interface ContainerProps {
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg";
  width?: string;
  maxWidth?: string;
  marginTop?: number;
  marginBottom?: number;
  borderColor?: string;
  borderWidth?: number;
  hidden?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function StaticContainer({
  backgroundColor = "transparent",
  padding = 16,
  borderRadius = 0,
  shadow = "none",
  width = "100%",
  maxWidth = "100%",
  marginTop = 0,
  marginBottom = 0,
  borderColor = "transparent",
  borderWidth = 0,
  hidden = false,
  children,
  className,
}: ContainerProps) {
  if (hidden) return null;

  const shadowClass = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  }[shadow];

  // Container style with handling for border radius even when border width is 0
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    width,
    maxWidth,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    borderColor,
    borderWidth: `${borderWidth}px`,
    borderStyle: borderWidth > 0 ? "solid" : "none",
  };

  // If border radius is specified but border width is 0, add a transparent border
  // to ensure border radius is visible
  if (borderRadius > 0 && borderWidth === 0) {
    containerStyle.borderStyle = "solid";
  }

  return (
    <motion.div
      className={`relative ${shadowClass} ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={containerStyle}
    >
      {children}
    </motion.div>
  );
}
