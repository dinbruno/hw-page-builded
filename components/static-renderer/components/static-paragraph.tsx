"use client";

import { motion } from "framer-motion";

interface ParagraphProps {
  text?: string;
  color?: string;
  hidden?: boolean;
  fontSize?: number;
  alignment?: "left" | "center" | "right" | "justify";
  marginTop?: number;
  lineHeight?: number;
  marginBottom?: number;
}

export default function StaticParagraph({
  text = "Texto padrão",
  color = "#111928",
  hidden = false,
  fontSize = 16,
  alignment = "left",
  marginTop = 0,
  lineHeight = 1.5,
  marginBottom = 16,
}: ParagraphProps) {
  if (hidden) return null;

  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[alignment];

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${textAlignClass}`}
      style={{
        color,
        fontSize: `${fontSize}px`,
        lineHeight,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
