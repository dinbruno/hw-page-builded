"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Home, Users, Briefcase, FolderClosed, FileText, Users2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Definindo os ícones diretamente para evitar problemas de renderização
const IconComponents = {
  Home,
  Users,
  Briefcase,
  FolderClosed,
  FileText,
  Users2,
};

// Interface para valores de espaçamento
interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface CollapsibleSidebarProps {
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  titleColor?: string;
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  hoverColor?: string;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  hidden?: boolean;
  contentBackgroundColor?: string;
  showToggleButton?: boolean;
  toggleButtonPosition?: "top" | "middle" | "bottom";
  toggleButtonColor?: string;
  toggleButtonSize?: number;
  animationDuration?: number;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: "none" | "sm" | "md" | "lg";
  margin: SpacingValue;
  padding: SpacingValue;
  contentPadding: SpacingValue;
  children?: React.ReactNode;
}

interface SidebarItem {
  id: string;
  iconName: keyof typeof IconComponents;
  label: string;
  href: string;
}

const defaultItems: SidebarItem[] = [
  { id: "home", iconName: "Home", label: "Página Inicial", href: "/" },
  { id: "users", iconName: "Users", label: "Usuários", href: "/usuarios" },
  { id: "departments", iconName: "Briefcase", label: "Departamentos", href: "/departamentos" },
  { id: "projects", iconName: "FolderClosed", label: "Projetos", href: "/projetos" },
  { id: "documents", iconName: "FileText", label: "Documentos", href: "/documentos" },
  { id: "groups", iconName: "Users2", label: "Grupos", href: "/grupos" },
];

// Valores padrão para espaçamento
const defaultMargin: SpacingValue = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultPadding: SpacingValue = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultContentPadding: SpacingValue = { top: 16, right: 16, bottom: 16, left: 16 };

export default function StaticCollapsibleSidebar({
  logoSrc = "/images/hycloud-logo.png",
  logoAlt = "HyWork Cloud",
  title = "work cloud",
  titleColor = "#1f272f",
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  activeColor = "#e8f0fe",
  hoverColor = "#f5f5f5",
  defaultCollapsed = false,
  width = 240,
  collapsedWidth = 64,
  hidden = false,
  contentBackgroundColor = "#f9f9f9",
  showToggleButton = true,
  toggleButtonPosition = "middle",
  toggleButtonColor = "#1f272f",
  toggleButtonSize = 14,
  animationDuration = 0.3,
  borderStyle = "solid",
  borderWidth = 1,
  borderColor = "#e5e7eb",
  boxShadow = "none",
  margin = defaultMargin,
  padding = defaultPadding,
  contentPadding = defaultContentPadding,
  children,
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState("home");
  const items = defaultItems;

  // Update collapsed state when defaultCollapsed prop changes
  useEffect(() => {
    setCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  if (hidden) return null;

  // Determinar a posição do botão de toggle
  const getToggleButtonPosition = () => {
    switch (toggleButtonPosition) {
      case "top":
        return "top-4";
      case "bottom":
        return "bottom-4";
      case "middle":
      default:
        return "top-20";
    }
  };

  // Determinar a sombra
  const getShadowClass = () => {
    switch (boxShadow) {
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow";
      case "lg":
        return "shadow-lg";
      case "none":
      default:
        return "";
    }
  };

  return (
    <div
      className="flex h-screen w-full"
      style={{
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
      }}
    >
      {/* Sidebar */}
      <motion.div
        className={`h-full relative flex flex-col ${getShadowClass()}`}
        style={{
          backgroundColor,
          color: textColor,
          width: collapsed ? collapsedWidth : width,
          minWidth: collapsed ? collapsedWidth : width,
          borderRight: borderStyle !== "none" ? `${borderWidth}px ${borderStyle} ${borderColor}` : "none",
          transition: `width ${animationDuration}s ease`,
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        }}
        animate={{ width: collapsed ? collapsedWidth : width }}
        transition={{ duration: animationDuration }}
      >
        {/* Toggle button */}
        {showToggleButton && (
          <button
            className={`absolute -right-3 ${getToggleButtonPosition()} h-6 w-6 rounded-full border bg-white shadow-md z-10 flex items-center justify-center`}
            onClick={toggleSidebar}
            style={{ color: toggleButtonColor }}
          >
            {collapsed ? <ChevronRight size={toggleButtonSize} /> : <ChevronLeft size={toggleButtonSize} />}
          </button>
        )}

        {/* Logo */}
        <div className={`flex items-center p-4 ${collapsed ? "justify-center" : ""}`}>
          <div className={`relative ${collapsed ? "w-8 h-8" : "w-10 h-10"} transition-all duration-300`}>
            <Image src={logoSrc || "/placeholder.svg?height=40&width=40"} alt={logoAlt} fill className="object-contain" />
          </div>
          {!collapsed && (
            <span className="ml-2 font-semibold text-lg" style={{ color: titleColor }}>
              {title}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {items.map((item) => {
              const IconComponent = IconComponents[item.iconName];
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <button
                      className={`flex items-center w-full p-2 rounded-md transition-colors ${isActive ? "bg-opacity-10" : ""} ${
                        collapsed ? "justify-center" : ""
                      }`}
                      style={{
                        backgroundColor: isActive ? activeColor : "transparent",
                        color: textColor,
                      }}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <IconComponent className={`${collapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>

      {/* Content Area */}
      <div
        className="flex-1 h-full overflow-auto w-full"
        style={{
          backgroundColor: contentBackgroundColor,
          width: "100%",
          flex: "1 1 auto",
          padding: `${contentPadding.top}px ${contentPadding.right}px ${contentPadding.bottom}px ${contentPadding.left}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
