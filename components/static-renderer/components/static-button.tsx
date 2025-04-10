"use client";

import type React from "react";

import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  text?: string;
  url?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  width?: "auto" | "full";
  marginTop?: number;
  marginBottom?: number;
  alignment?: "left" | "center" | "right";
  hidden?: boolean;
}

export default function StaticButton({
  text = "Botão",
  url = "#",
  backgroundColor = "#014973",
  textColor = "#ffffff",
  borderRadius = 4,
  size = "md",
  variant = "solid",
  width = "auto",
  marginTop = 0,
  marginBottom = 0,
  alignment = "left",
  hidden = false,
}: ButtonProps) {
  if (hidden) return null;

  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }[size];

  const widthClass = width === "full" ? "w-full" : "w-auto";

  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[alignment];

  let buttonStyle: React.CSSProperties = {};

  if (variant === "solid") {
    buttonStyle = {
      backgroundColor,
      color: textColor,
      borderRadius: `${borderRadius}px`,
    };
  } else if (variant === "outline") {
    buttonStyle = {
      backgroundColor: "transparent",
      color: backgroundColor,
      borderRadius: `${borderRadius}px`,
      border: `1px solid ${backgroundColor}`,
    };
  } else if (variant === "ghost") {
    buttonStyle = {
      backgroundColor: "transparent",
      color: backgroundColor,
      borderRadius: `${borderRadius}px`,
    };
  }

  return (
    <motion.div
      className="relative"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px` }}
    >
      <div className={`${alignmentClass} ${widthClass}`}>
        <Link href={url}>
          <button className={`${sizeClass} ${widthClass} transition-colors`} style={buttonStyle}>
            {text}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
