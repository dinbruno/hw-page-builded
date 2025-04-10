"use client";

import { motion } from "framer-motion";
import type React from "react";

interface ColumnProps {
  width?: string;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg";
  borderColor?: string;
  borderWidth?: number;
  hidden?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function StaticColumn({
  width = "100%",
  padding = 8,
  backgroundColor = "transparent",
  borderRadius = 0,
  shadow = "none",
  borderColor = "transparent",
  borderWidth = 0,
  hidden = false,
  children,
  className,
}: ColumnProps) {
  if (hidden) return null;

  const shadowClass = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  }[shadow];

  return (
    <motion.div
      className={`relative ${shadowClass} ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width,
        padding: `${padding}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        borderColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: borderWidth > 0 ? "solid" : "none",
        minHeight: "50px",
      }}
    >
      {children}
      {!children && (
        <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-sm text-gray-500">Área de conteúdo</p>
        </div>
      )}
    </motion.div>
  );
}
