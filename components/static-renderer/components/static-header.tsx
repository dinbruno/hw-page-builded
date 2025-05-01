"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface StaticHeaderProps {
  logo?: string;
  logoText?: string;
  logoHeight?: number;
  navItems?: { id: string; label: string; url: string }[];
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  hoverTextColor?: string;
  transparent?: boolean;
  sticky?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  containerWidth?: "full" | "container" | "custom";
  customWidth?: number;
  customClasses?: string;
  mobileBreakpoint?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  border?: {
    width: number;
    style: string;
    color: string;
    radius?: {
      topLeft: number;
      topRight: number;
      bottomLeft: number;
      bottomRight: number;
    };
  };
  hidden?: boolean;
}

export default function StaticHeader({
  logo = "",
  logoText = "",
  logoHeight = 40,
  navItems = [],
  backgroundColor = "#ffffff",
  textColor = "#111827",
  activeColor = "#3b82f6",
  hoverTextColor = "#4b5563",
  transparent = false,
  sticky = false,
  shadow = "none",
  containerWidth = "container",
  customWidth = 1280,
  customClasses = "",
  mobileBreakpoint = 768,
  margin,
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  border,
  hidden = false,
}: StaticHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (hidden) return null;

  // Generate style object from props
  const containerStyle: React.CSSProperties = {
    backgroundColor: transparent ? "transparent" : backgroundColor,
    position: sticky ? "sticky" : "relative",
    top: sticky ? 0 : undefined,
    zIndex: sticky ? 50 : undefined,
  };

  // Apply shadow
  if (shadow && shadow !== "none") {
    const shadowMap: Record<string, string> = {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    };
    containerStyle.boxShadow = shadowMap[shadow];
  }

  // Apply margins
  if (margin) {
    containerStyle.marginTop = `${margin.top}px`;
    containerStyle.marginRight = `${margin.right}px`;
    containerStyle.marginBottom = `${margin.bottom}px`;
    containerStyle.marginLeft = `${margin.left}px`;
  }

  // Apply padding
  if (padding) {
    containerStyle.paddingTop = `${padding.top}px`;
    containerStyle.paddingRight = `${padding.right}px`;
    containerStyle.paddingBottom = `${padding.bottom}px`;
    containerStyle.paddingLeft = `${padding.left}px`;
  }

  // Apply border
  if (border && border.width > 0) {
    containerStyle.borderWidth = `${border.width}px`;
    containerStyle.borderStyle = border.style || "solid";
    containerStyle.borderColor = border.color;

    if (border.radius) {
      containerStyle.borderTopLeftRadius = `${border.radius.topLeft}px`;
      containerStyle.borderTopRightRadius = `${border.radius.topRight}px`;
      containerStyle.borderBottomLeftRadius = `${border.radius.bottomLeft}px`;
      containerStyle.borderBottomRightRadius = `${border.radius.bottomRight}px`;
    }
  }

  // Container width styles
  const innerContainerStyle: React.CSSProperties = {};

  if (containerWidth === "full") {
    innerContainerStyle.width = "100%";
  } else if (containerWidth === "container") {
    innerContainerStyle.maxWidth = "1280px";
    innerContainerStyle.marginLeft = "auto";
    innerContainerStyle.marginRight = "auto";
    innerContainerStyle.paddingLeft = "1rem";
    innerContainerStyle.paddingRight = "1rem";
  } else if (containerWidth === "custom") {
    innerContainerStyle.maxWidth = `${customWidth}px`;
    innerContainerStyle.marginLeft = "auto";
    innerContainerStyle.marginRight = "auto";
    innerContainerStyle.paddingLeft = "1rem";
    innerContainerStyle.paddingRight = "1rem";
  }

  return (
    <motion.header
      className={`w-full ${customClasses}`}
      style={containerStyle}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between" style={innerContainerStyle}>
        <div className="flex items-center">
          {logo && (
            <div className="mr-4">
              <Image src={logo} alt="Logo" width={logoHeight * 1.5} height={logoHeight} priority className="object-contain" />
            </div>
          )}
          {logoText && (
            <div className="text-xl font-bold" style={{ color: textColor }}>
              {logoText}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex space-x-6`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="transition-colors duration-200 font-medium"
              style={{ color: textColor }}
              onMouseOver={(e) => (e.currentTarget.style.color = hoverTextColor)}
              onMouseOut={(e) => (e.currentTarget.style.color = textColor)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          style={{ color: textColor }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden py-4"
          style={{ backgroundColor: transparent ? backgroundColor : "transparent" }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col space-y-4 px-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="transition-colors duration-200 font-medium"
                style={{ color: textColor }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
