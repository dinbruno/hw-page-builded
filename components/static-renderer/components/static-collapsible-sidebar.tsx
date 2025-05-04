"use client";

import React from "react";

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
  sidebarItems?: Array<{
    id: string;
    iconName: keyof typeof IconComponents;
    label: string;
    href: string;
  }>;
  linkedNodes?: Record<string, string>;
  nodes?: string[];
  [key: string]: any;
}

// Valores padrão para espaçamento
const defaultMargin: SpacingValue = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultPadding: SpacingValue = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultContentPadding: SpacingValue = { top: 16, right: 16, bottom: 16, left: 16 };

const defaultItems = [
  { id: "home", iconName: "Home" as const, label: "Página Inicial", href: "/" },
  { id: "users", iconName: "Users" as const, label: "Usuários", href: "/usuarios" },
  { id: "departments", iconName: "Briefcase" as const, label: "Departamentos", href: "/departamentos" },
  { id: "projects", iconName: "FolderClosed" as const, label: "Projetos", href: "/projetos" },
  { id: "documents", iconName: "FileText" as const, label: "Documentos", href: "/documentos" },
  { id: "groups", iconName: "Users2" as const, label: "Grupos", href: "/grupos" },
];

export default function StaticCollapsibleSidebar({
  logoSrc = "/images/hycloud-logo.png",
  logoAlt = "HyWork Cloud",
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
  sidebarItems = defaultItems,
  linkedNodes = {},
  nodes = [],
  ...rest
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState("home");

  // Debug para verificar props
  useEffect(() => {
    console.log("[StaticCollapsibleSidebar] Props recebidas:", {
      children: Boolean(children),
      linkedNodes,
      nodes,
      restKeys: Object.keys(rest),
    });
  }, [children, linkedNodes, nodes, rest]);

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
        return "top-1/2 -translate-y-1/2";
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

  // Renderizar o conteúdo da área de conteúdo com melhorias de debugging
  const renderContent = () => {
    console.log("[StaticCollapsibleSidebar] Tentando renderizar conteúdo com:", {
      linkedNodes,
      propsKeys: Object.keys(rest),
    });

    // 1. Verificar se existe linkedNode para content-area (prioridade máxima)
    if (linkedNodes && linkedNodes["content-area"]) {
      const contentNodeId = linkedNodes["content-area"];
      console.log("[StaticCollapsibleSidebar] Encontrou content-area com ID:", contentNodeId);

      if (rest[contentNodeId]) {
        console.log("[StaticCollapsibleSidebar] Renderizando conteúdo do nó:", contentNodeId);
        return rest[contentNodeId];
      }
    }

    // 2. Verificar nós específicos para o JSON fornecido
    const specificIds = ["YF9E8eUcGG", "pRMJxV-KZO"];
    for (const id of specificIds) {
      if (rest[id]) {
        console.log("[StaticCollapsibleSidebar] Renderizando nó específico:", id);
        return rest[id];
      }
    }

    // 3. Verificar propriedades que possam conter conteúdo baseado em nomes comuns
    for (const key of Object.keys(rest)) {
      const keyLower = key.toLowerCase();
      if (keyLower.includes("column") || keyLower.includes("content") || keyLower.includes("container") || keyLower.includes("area")) {
        console.log("[StaticCollapsibleSidebar] Renderizando pelo nome da propriedade:", key);
        return rest[key];
      }
    }

    // 4. Usar children se disponível
    if (children) {
      console.log("[StaticCollapsibleSidebar] Renderizando children");
      return children;
    }

    // 5. Placeholder como último recurso
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
        <p className="text-sm text-gray-500">Área de Conteúdo (Vazia)</p>
      </div>
    );
  };

  return (
    <div
      data-component-type="navigation"
      className="gap-5 flex h-screen w-full"
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const IconComponent = IconComponents[item.iconName];
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <button
                      className={`flex items-center w-full p-2 rounded-md transition-colors ${isActive ? "bg-opacity-10" : ""} ${
                        collapsed ? "justify-center" : ""
                      } hover:bg-opacity-5`}
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

      {/* Content Area - usando a estrutura original */}
      <div className="w-full h-full">
        <div
          id="content-area"
          className="flex-1 h-full overflow-auto"
          style={{
            backgroundColor: contentBackgroundColor,
          }}
        >
          <div
            id="content-container"
            className="w-full h-full"
            style={{
              backgroundColor: contentBackgroundColor,
              padding: `${contentPadding.top}px ${contentPadding.right}px ${contentPadding.bottom}px ${contentPadding.left}px`,
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
