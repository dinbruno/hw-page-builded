"use client";

import { motion } from "framer-motion";

interface IframeProps {
  url?: string;
  width?: number | string;
  height?: number | string;
  alignment?: "left" | "center" | "right";
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
  allowFullscreen?: boolean;
  sandbox?: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "custom";
  customAspectRatio?: string;
  scrolling?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 1,
  style: "solid" as const,
  color: "#e2e8f0",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

export default function StaticIframe({
  url = "https://example.com",
  width = "100%",
  height = "auto",
  alignment = "center",
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  backgroundColor = "transparent",
  hidden = false,
  border = defaultBorder,
  customClasses = "",
  allowFullscreen = true,
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms",
  title = "Embedded content",
  aspectRatio = "16:9",
  customAspectRatio = "",
  scrolling = true,
  id,
  style,
}: IframeProps) {
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case "16:9":
        return "56.25%"; // 9/16 * 100
      case "4:3":
        return "75%"; // 3/4 * 100
      case "1:1":
        return "100%";
      case "custom":
        return customAspectRatio || "56.25%";
      default:
        return "56.25%";
    }
  };

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: aspectRatio === "custom" && height !== "auto" ? (typeof height === "number" ? `${height}px` : height) : "auto",
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
    display: "flex",
    justifyContent: alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center",
    position: "relative" as const,
    minHeight: "60px",
    ...(style || {}),
  };

  if (hidden) return null;

  return (
    <motion.div
      className={`relative static-iframe ${customClasses}`}
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className="relative w-full" style={{ paddingTop: getAspectRatio() }}>
        <iframe
          src={url}
          className="absolute top-0 left-0 w-full h-full"
          title={title}
          frameBorder={border.width === 0 ? "0" : "1"}
          allowFullScreen={allowFullscreen}
          sandbox={sandbox}
          scrolling={scrolling ? "yes" : "no"}
        />
      </div>
    </motion.div>
  );
}
