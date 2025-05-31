"use client";

import { motion } from "framer-motion";
import "@/styles/rich-text.css";

interface RichTextProps {
  content?: string;
  width?: number | string;
  height?: number | string;
  alignment?: "left" | "center" | "right" | "justify";
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  backgroundColor?: string;
  hidden?: boolean;
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
  customClasses?: string;
  id?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#e2e8f0",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

export default function StaticRichText({
  content = "<p>Texto editável</p>",
  width = "100%",
  height = "auto",
  alignment = "left",
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  padding = { top: 10, right: 10, bottom: 10, left: 10 },
  backgroundColor = "transparent",
  hidden = false,
  border = defaultBorder,
  customClasses = "",
  id,
  style,
}: RichTextProps) {
  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    backgroundColor,
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
    textAlign: alignment,
    minHeight: "60px",
    ...(style || {}),
  };

  if (hidden) return null;

  return (
    <motion.div
      className={`relative static-rich-text ${customClasses}`}
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className="rich-text-content prose max-w-none" dangerouslySetInnerHTML={{ __html: content || "<p>Conteúdo não disponível</p>" }} />
    </motion.div>
  );
}
