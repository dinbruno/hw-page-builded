"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Layers, Eye, Palette } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import StaticContainer from "./static-container";

// Interface para valores de animação
interface AnimationValue {
  type: "none" | "fadeIn" | "slideIn" | "zoomIn" | "bounceIn";
  duration: number;
  delay: number;
  easing: string;
}

// Interface para valores de background
interface BackgroundValue {
  type: "color" | "gradient" | "image";
  color: string;
  image: {
    url: string;
    size: "cover" | "contain" | "auto" | "custom";
    position: "center" | "top" | "bottom" | "left" | "right" | "custom";
    repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    customSize: string;
    customPosition: string;
  };
  gradient: {
    type: "linear" | "radial";
    angle: number;
    colors: Array<{
      color: string;
      position: number;
    }>;
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

interface TabPanelProps {
  tabs: {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    content: any[];
    color?: string;
  }[];
  activeTab?: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "default" | "material" | "bootstrap" | "card" | "vertical" | "segmented" | "pill" | "underline";
  alignment?: "start" | "center" | "end" | "stretch";
  width?: "auto" | "full" | "custom";
  customWidth?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
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
  animation?: AnimationValue;
  background?: BackgroundValue;
  hidden?: boolean;
  style?: {
    tabBackground?: string;
    tabTextColor?: string;
    activeTabBackground?: string;
    activeTabTextColor?: string;
    hoverTabBackground?: string;
    hoverTabTextColor?: string;
    disabledTabBackground?: string;
    disabledTabTextColor?: string;
    tabBorderColor?: string;
    tabBorderRadius?: number;
    tabPadding?: number;
    contentBackground?: string;
    contentTextColor?: string;
    contentBorderColor?: string;
    contentBorderRadius?: number;
    contentPadding?: number;
    indicatorColor?: string;
    indicatorHeight?: number;
    indicatorWidth?: string;
    tabGap?: number;
    tabFontSize?: number;
    tabFontWeight?: number;
    tabTransition?: string;
    tabShadow?: string;
    contentShadow?: string;
    tabHoverEffect?: "scale" | "slide" | "fade" | "none";
    tabActiveEffect?: "scale" | "slide" | "fade" | "none";
    tabIconSize?: number;
    tabIconPosition?: "left" | "right" | "top" | "bottom";
    tabIconSpacing?: number;
    tabIconColor?: string;
    tabIconActiveColor?: string;
    tabIconHoverColor?: string;
    tabIconDisabledColor?: string;
    tabIconTransition?: string;
    tabIconAnimation?: "spin" | "bounce" | "pulse" | "none";
    tabIconAnimationDuration?: number;
    tabIconAnimationDelay?: number;
    tabIconAnimationEasing?: string;
    tabIconAnimationIterationCount?: number;
    tabIconAnimationDirection?: "normal" | "reverse" | "alternate" | "alternate-reverse";
    tabIconAnimationFillMode?: "none" | "forwards" | "backwards" | "both";
    tabIconAnimationPlayState?: "running" | "paused";
  };
  children?: React.ReactNode;
  isEditable?: boolean;
  linkedNodes?: Record<string, string>;
  id?: string;
  [key: string]: any;
}

export const StaticTabPanel = ({
  tabs = [],
  activeTab,
  position = "top",
  variant = "default",
  alignment = "start",
  width = "auto",
  customWidth = 600,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  border = {
    width: 1,
    style: "solid",
    color: "#e2e8f0",
    radius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
  },
  animation,
  background,
  hidden = false,
  style = {
    tabBackground: "#ffffff",
    tabTextColor: "#1a202c",
    activeTabBackground: "#fff",
    activeTabTextColor: "#1a202c",
    hoverTabBackground: "#f9fafb",
    hoverTabTextColor: "#1a202c",
    disabledTabBackground: "#f3f4f6",
    disabledTabTextColor: "#9ca3af",
    tabBorderColor: "#e2e8f0",
    tabBorderRadius: 6,
    tabPadding: 12,
    contentBackground: "#ffffff",
    contentTextColor: "#1a202c",
    contentBorderColor: "#e2e8f0",
    contentBorderRadius: 8,
    contentPadding: 16,
    indicatorColor: "#1976d2",
    indicatorHeight: 2,
    indicatorWidth: "100%",
    tabGap: 8,
    tabFontSize: 14,
    tabFontWeight: 400,
    tabTransition: "all 0.2s ease",
    tabShadow: "none",
    contentShadow: "none",
    tabHoverEffect: "none",
    tabActiveEffect: "none",
    tabIconSize: 16,
    tabIconPosition: "left",
    tabIconSpacing: 8,
    tabIconColor: "#64748b",
    tabIconActiveColor: "#1976d2",
    tabIconHoverColor: "#1976d2",
    tabIconDisabledColor: "#94a3b8",
    tabIconTransition: "all 0.2s ease",
    tabIconAnimation: "none",
    tabIconAnimationDuration: 0.3,
    tabIconAnimationDelay: 0,
    tabIconAnimationEasing: "ease",
    tabIconAnimationIterationCount: 1,
    tabIconAnimationDirection: "normal",
    tabIconAnimationFillMode: "none",
    tabIconAnimationPlayState: "running",
  },
  children,
  isEditable = false,
  linkedNodes,
  id,
  ...otherProps
}: TabPanelProps) => {
  // Verificar se está no contexto do CraftJS
  let isInEditor = false;
  let connectors: any = null;
  let selected = false;

  try {
    const { connectors: nodeConnectors } = useNode();
    const { selected: nodeSelected } = useNode((node) => ({
      selected: node.events.selected,
    }));
    isInEditor = true;
    connectors = nodeConnectors;
    selected = nodeSelected;
  } catch {
    // Não está no contexto do Editor
    isInEditor = false;
  }

  const [activeTabId, setActiveTabId] = useState(activeTab || tabs[0]?.id || "");

  const containerStyle = {
    width: width === "full" ? "100%" : width === "custom" ? `${customWidth}px` : "auto",
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    border: `${border.width}px ${border.style} ${border.color}`,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
    backgroundColor: background?.type === "color" ? background.color : undefined,
    backgroundImage:
      background?.type === "gradient"
        ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
        : background?.type === "image"
        ? `url(${background.image.url})`
        : undefined,
    backgroundSize: background?.type === "image" ? background.image.size : undefined,
    backgroundPosition: background?.type === "image" ? background.image.position : undefined,
    backgroundRepeat: background?.type === "image" ? background.image.repeat : undefined,
    position: "relative" as const,
  };

  const getTabAnimation = (isActive: boolean) => {
    const effect = isActive ? style.tabActiveEffect : style.tabHoverEffect;

    switch (effect) {
      case "scale":
        return {
          transform: isActive ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.2s ease",
        };
      case "slide":
        return {
          transform: isActive ? "translateY(-2px)" : "translateY(0)",
          transition: "transform 0.2s ease",
        };
      case "fade":
        return {
          opacity: isActive ? 1 : 0.8,
          transition: "opacity 0.2s ease",
        };
      default:
        return {};
    }
  };

  const getIconStyle = (isActive: boolean, isDisabled: boolean) => ({
    width: style.tabIconSize,
    height: style.tabIconSize,
    color: isDisabled ? style.tabIconDisabledColor : isActive ? style.tabIconActiveColor : style.tabIconColor,
    transition: style.tabIconTransition,
    animation:
      style.tabIconAnimation !== "none"
        ? `${style.tabIconAnimation} ${style.tabIconAnimationDuration}s ${style.tabIconAnimationEasing} ${style.tabIconAnimationDelay}s ${style.tabIconAnimationIterationCount} ${style.tabIconAnimationDirection} ${style.tabIconAnimationFillMode} ${style.tabIconAnimationPlayState}`
        : "none",
  });

  const getTabListStyle = () => {
    const baseStyle = {
      display: "flex",
      gap: `${style.tabGap || 4}px`,
      width: "100%",
      borderBottom: `1px solid ${style.tabBorderColor}`,
      paddingBottom: "4px",
      marginBottom: "16px",
    };

    switch (variant) {
      case "vertical":
        return {
          ...baseStyle,
          flexDirection: "column" as const,
          borderBottom: "none",
          borderRight: `1px solid ${style.tabBorderColor}`,
          paddingBottom: 0,
          paddingRight: "4px",
          marginBottom: 0,
          marginRight: "16px",
        };
      case "segmented":
        return {
          ...baseStyle,
          backgroundColor: style.tabBackground,
          borderRadius: "8px",
          padding: "4px",
          border: "none",
        };
      case "pill":
        return {
          ...baseStyle,
          backgroundColor: style.tabBackground,
          borderRadius: "9999px",
          padding: "4px",
          border: "none",
        };
      default:
        return baseStyle;
    }
  };

  const getTabStyle = (isActive: boolean, isDisabled: boolean, color?: string) => {
    const baseStyle = {
      padding: `${style.tabPadding}px 16px`,
      backgroundColor: isActive ? color || style.activeTabBackground : style.tabBackground,
      color: isActive ? style.activeTabTextColor : style.tabTextColor,
      border: "none",
      borderRadius: `${style.tabBorderRadius}px`,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
      transition: style.tabTransition || "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: `${style.tabGap || 8}px`,
      whiteSpace: "nowrap" as const,
      position: "relative" as const,
      fontSize: `${style.tabFontSize || 14}px`,
      fontWeight: style.tabFontWeight || 400,
      boxShadow: style.tabShadow || "none",
    };

    // Variant-specific styles
    switch (variant) {
      case "material":
        return {
          ...baseStyle,
          borderBottom: isActive ? `2px solid ${style.indicatorColor || "#1976d2"}` : "none",
          borderRadius: 0,
          padding: "12px 24px",
        };
      case "bootstrap":
        return {
          ...baseStyle,
          border: `1px solid ${style.tabBorderColor || "#dee2e6"}`,
          borderBottom: isActive ? "none" : `1px solid ${style.tabBorderColor || "#dee2e6"}`,
          backgroundColor: isActive ? "#fff" : "transparent",
          marginBottom: isActive ? "-1px" : 0,
        };
      case "card":
        return {
          ...baseStyle,
          backgroundColor: isActive ? "#fff" : "transparent",
          boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
          border: `1px solid ${style.tabBorderColor || "#e2e8f0"}`,
          marginBottom: "-1px",
        };
      case "vertical":
        return {
          ...baseStyle,
          width: "100%",
          justifyContent: "flex-start",
          borderLeft: isActive ? `3px solid ${style.indicatorColor || "#1976d2"}` : "none",
          borderRadius: 0,
        };
      case "segmented":
        return {
          ...baseStyle,
          backgroundColor: isActive ? style.activeTabBackground || "#1976d2" : "transparent",
          color: isActive ? "#fff" : style.tabTextColor,
          borderRadius: "20px",
          padding: "8px 16px",
        };
      case "pill":
        return {
          ...baseStyle,
          backgroundColor: isActive ? style.activeTabBackground || "#1976d2" : "transparent",
          color: isActive ? "#fff" : style.tabTextColor,
          borderRadius: "9999px",
          padding: "8px 20px",
        };
      case "underline":
        return {
          ...baseStyle,
          borderBottom: isActive ? `2px solid ${style.indicatorColor || "#1976d2"}` : "none",
          borderRadius: 0,
          padding: "12px 16px",
        };
      default:
        return baseStyle;
    }
  };

  const getContentStyle = (color?: string) => ({
    backgroundColor: style.contentBackground,
    color: style.contentTextColor,
    border: `1px solid ${style.contentBorderColor}`,
    borderRadius: `${style.contentBorderRadius}px`,
    padding: `${style.contentPadding}px`,
    minHeight: "200px",
    boxShadow: style.contentShadow,
    transition: "all 0.3s ease",
  });

  // Função para obter o conteúdo de uma aba
  const getTabContent = (tab: TabPanelProps["tabs"][0]) => {
    if (isInEditor) {
      return (
        <Element
          canvas
          is={StaticContainer}
          id={`tab-content-${tab.id}`}
          className="w-full h-full min-h-[200px]"
          backgroundColor={style.contentBackground}
          padding={style.contentPadding}
        />
      );
    }

    // Para renderização estática, procurar o conteúdo nos linkedNodes
    console.log(`[StaticTabPanel] Buscando conteúdo para aba: ${tab.id}`);
    console.log(`[StaticTabPanel] LinkedNodes disponíveis:`, linkedNodes);
    console.log(`[StaticTabPanel] OtherProps keys:`, Object.keys(otherProps));

    let content: React.ReactNode = null;

    if (linkedNodes && linkedNodes[`tab-content-${tab.id}`]) {
      const linkedNodeId = linkedNodes[`tab-content-${tab.id}`];
      console.log(`[StaticTabPanel] LinkedNodeId para ${tab.id}:`, linkedNodeId);

      // Verificar se o conteúdo existe nas otherProps
      if (otherProps[linkedNodeId]) {
        content = otherProps[linkedNodeId];
        console.log(`[StaticTabPanel] Conteúdo encontrado para ${tab.id}:`, !!content);
      } else {
        console.log(`[StaticTabPanel] Conteúdo NÃO encontrado em otherProps para chave:`, linkedNodeId);

        // Tentar buscar em todas as props que são React elements
        for (const [key, value] of Object.entries(otherProps)) {
          if (React.isValidElement(value)) {
            console.log(`[StaticTabPanel] React element encontrado na chave:`, key);
            // Se encontrar um elemento que pode corresponder ao linkedNode
            if (key === linkedNodeId) {
              content = value;
              break;
            }
          }
        }
      }
    }

    // Se não encontrou conteúdo, usar fallback
    if (!content) {
      console.log(`[StaticTabPanel] Usando fallback para aba ${tab.id}`);
      content = children || (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">Conteúdo da aba {tab.label}</p>
        </div>
      );
    }

    // Retornar com wrapper div
    return (
      <div
        className="w-full h-full min-h-[200px]"
        style={{
          backgroundColor: style.contentBackground,
          padding: `${style.contentPadding}px`,
        }}
      >
        {content}
      </div>
    );
  };

  if (hidden) return null;

  if (tabs.length === 0) {
    return (
      <motion.div
        ref={(ref) => {
          if (ref && isInEditor && connectors) {
            connectors.connect(connectors.drag(ref));
          }
        }}
        className={`w-full ${selected ? "component-selected" : ""}`}
        style={containerStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">{isInEditor ? "Adicione abas para começar" : "Nenhuma aba configurada"}</p>
        </div>

        {background?.overlay?.enabled && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: background.overlay.color,
              opacity: background.overlay.opacity,
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={(ref) => {
        if (ref && isInEditor && connectors) {
          connectors.connect(connectors.drag(ref));
        }
      }}
      className={`w-full ${selected ? "component-selected" : ""}`}
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {background?.overlay?.enabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: background.overlay.color,
            opacity: background.overlay.opacity,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: position === "left" || position === "right" ? "row" : "column",
          width: "100%",
          gap: "16px",
        }}
      >
        <div style={getTabListStyle()}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon ? (Icons as any)[tab.icon] : null;
            const isActive = tab.id === activeTabId;
            const tabStyle = {
              ...getTabStyle(isActive, !!tab.disabled, tab.color),
              ...getTabAnimation(isActive),
            };

            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTabId(tab.id)}
                style={tabStyle}
                disabled={tab.disabled}
                className="outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {IconComponent && <IconComponent style={getIconStyle(isActive, !!tab.disabled)} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={getContentStyle(tabs.find((tab) => tab.id === activeTabId)?.color)}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              style={{
                display: tab.id === activeTabId ? "block" : "none",
                height: "100%",
                animation: tab.id === activeTabId ? "fadeIn 0.3s ease" : "none",
              }}
            >
              {getTabContent(tab)}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </motion.div>
  );
};

export const StaticTabPanelSettings = () => {
  const {
    actions: { setProp },
    tabs,
    position,
    variant,
    alignment,
    width,
    customWidth,
    margin,
    padding,
    border,
    hidden,
    style,
  } = useNode((node) => ({
    tabs: node.data.props.tabs,
    position: node.data.props.position,
    variant: node.data.props.variant,
    alignment: node.data.props.alignment,
    width: node.data.props.width,
    customWidth: node.data.props.customWidth,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    border: node.data.props.border,
    hidden: node.data.props.hidden,
    style: node.data.props.style,
  }));

  const addTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      label: "Nova Aba",
      content: [],
    };

    setProp((props: any) => {
      props.tabs = [...(props.tabs || []), newTab];
    });
  };

  const removeTab = (index: number) => {
    setProp((props: any) => {
      props.tabs = props.tabs.filter((_: any, i: number) => i !== index);
    });
  };

  const updateTab = (index: number, updates: Partial<TabPanelProps["tabs"][0]>) => {
    setProp((props: any) => {
      props.tabs[index] = { ...props.tabs[index], ...updates };
    });
  };

  const availableIcons = [
    "Home",
    "User",
    "Settings",
    "Search",
    "Bell",
    "Mail",
    "Calendar",
    "Clock",
    "Star",
    "Heart",
    "Plus",
    "Minus",
    "Edit",
    "Trash2",
    "Save",
    "Download",
    "Upload",
    "Share",
    "Copy",
    "Eye",
    "EyeOff",
    "Lock",
    "Unlock",
    "Key",
  ];

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="abas">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Abas
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-semibold">Abas</h3>
                  <p className="text-xs text-muted-foreground mt-1">Configure as abas do painel</p>
                </div>
                <Button onClick={addTab} size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar</span>
                </Button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {tabs?.map((tab: TabPanelProps["tabs"][0], index: number) => (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="border rounded-lg bg-card shadow-sm"
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value={tab.id} className="border-none">
                          <AccordionTrigger className="px-3 py-2.5 hover:no-underline group">
                            <div className="flex items-center w-full">
                              <div className="flex-1">
                                <Input
                                  value={tab.label}
                                  onChange={(e) => updateTab(index, { label: e.target.value })}
                                  className="h-8 text-sm"
                                  placeholder="Nome da aba"
                                />
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTab(index);
                                }}
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-4 px-3">
                              <div>
                                <Label className="text-xs mb-1.5 block">Ícone</Label>
                                <Select value={tab.icon || ""} onValueChange={(icon) => updateTab(index, { icon })}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um ícone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Nenhum ícone</SelectItem>
                                    {availableIcons.map((iconName) => {
                                      const IconComponent = (Icons as any)[iconName];
                                      return (
                                        <SelectItem key={iconName} value={iconName}>
                                          <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            {iconName}
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs mb-1.5 block">Cor da Aba</Label>
                                <Input
                                  type="color"
                                  value={tab.color || "#3b82f6"}
                                  onChange={(e) => updateTab(index, { color: e.target.value })}
                                  className="h-8"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`disabled-${tab.id}`}
                                  checked={tab.disabled}
                                  onCheckedChange={(checked) => updateTab(index, { disabled: checked })}
                                />
                                <Label htmlFor={`disabled-${tab.id}`} className="text-sm cursor-pointer">
                                  Desabilitar aba
                                </Label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="layout">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Layout
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Posição das Abas</Label>
                <Select
                  value={position}
                  onValueChange={(value: "top" | "bottom" | "left" | "right") => setProp((props: TabPanelProps) => (props.position = value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Superior</SelectItem>
                    <SelectItem value="bottom">Inferior</SelectItem>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Variante</Label>
                <Select
                  value={variant}
                  onValueChange={(value: "default" | "material" | "bootstrap" | "card" | "vertical" | "segmented" | "pill" | "underline") =>
                    setProp((props: TabPanelProps) => (props.variant = value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="material">Material Design</SelectItem>
                    <SelectItem value="bootstrap">Bootstrap</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="segmented">Segmented Control</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Largura</Label>
                <Select value={width} onValueChange={(value: "auto" | "full" | "custom") => setProp((props: TabPanelProps) => (props.width = value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automático</SelectItem>
                    <SelectItem value="full">Largura Total</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {width === "custom" && (
                <div>
                  <Label>Largura Personalizada (px)</Label>
                  <Input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setProp((props: TabPanelProps) => (props.customWidth = Number(e.target.value)))}
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="estilo">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Estilo
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Estilo das Abas</Label>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs">Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={style.tabBackground}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, tabBackground: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor do Texto</Label>
                    <Input
                      type="color"
                      value={style.tabTextColor}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, tabTextColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor de Fundo (Ativo)</Label>
                    <Input
                      type="color"
                      value={style.activeTabBackground}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, activeTabBackground: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor do Texto (Ativo)</Label>
                    <Input
                      type="color"
                      value={style.activeTabTextColor}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, activeTabTextColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor da Borda</Label>
                    <Input
                      type="color"
                      value={style.tabBorderColor}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, tabBorderColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label>Raio da Borda</Label>
                    <Input
                      type="number"
                      value={style.tabBorderRadius}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, tabBorderRadius: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Estilo do Conteúdo</Label>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs">Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={style.contentBackground}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, contentBackground: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor do Texto</Label>
                    <Input
                      type="color"
                      value={style.contentTextColor}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, contentTextColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Cor da Borda</Label>
                    <Input
                      type="color"
                      value={style.contentBorderColor}
                      onChange={(e) => setProp((props: TabPanelProps) => (props.style = { ...props.style, contentBorderColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label>Raio da Borda</Label>
                    <Input
                      type="number"
                      value={style.contentBorderRadius}
                      onChange={(e) =>
                        setProp((props: TabPanelProps) => (props.style = { ...props.style, contentBorderRadius: Number(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="visibilidade">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Visibilidade
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between">
              <Label>Esconder componente</Label>
              <Switch checked={hidden} onCheckedChange={(checked) => setProp((props: TabPanelProps) => (props.hidden = checked))} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

StaticTabPanel.craft = {
  displayName: "Painel de Abas",
  props: {
    tabs: [
      {
        id: "tab-1",
        label: "Aba 1",
        content: [],
      },
      {
        id: "tab-2",
        label: "Aba 2",
        content: [],
      },
    ],
    position: "top",
    variant: "default",
    alignment: "start",
    width: "auto",
    customWidth: 600,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    border: {
      width: 1,
      style: "solid",
      color: "#e2e8f0",
      radius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
    },
    animation: {
      type: "none",
      duration: 0.3,
      delay: 0,
      easing: "ease",
    },
    background: {
      type: "color",
      color: "#ffffff",
      image: {
        url: "",
        size: "cover",
        position: "center",
        repeat: "no-repeat",
        customSize: "",
        customPosition: "",
      },
      gradient: {
        type: "linear",
        angle: 90,
        colors: [
          { color: "#ffffff", position: 0 },
          { color: "#f3f4f6", position: 100 },
        ],
      },
      overlay: {
        enabled: false,
        color: "#000000",
        opacity: 0.5,
      },
    },
    hidden: false,
    style: {
      tabBackground: "#ffffff",
      tabTextColor: "#1a202c",
      activeTabBackground: "#f3f4f6",
      activeTabTextColor: "#1a202c",
      hoverTabBackground: "#f9fafb",
      hoverTabTextColor: "#1a202c",
      disabledTabBackground: "#f3f4f6",
      disabledTabTextColor: "#9ca3af",
      tabBorderColor: "#e2e8f0",
      tabBorderRadius: 6,
      tabPadding: 12,
      contentBackground: "#ffffff",
      contentTextColor: "#1a202c",
      contentBorderColor: "#e2e8f0",
      contentBorderRadius: 8,
      contentPadding: 0,
      indicatorColor: "#1976d2",
      indicatorHeight: 2,
      indicatorWidth: "100%",
      tabGap: 8,
      tabFontSize: 14,
      tabFontWeight: 400,
      tabTransition: "all 0.2s ease",
      tabShadow: "none",
      contentShadow: "none",
      tabHoverEffect: "none",
      tabActiveEffect: "none",
      tabIconSize: 16,
      tabIconPosition: "left",
      tabIconSpacing: 8,
      tabIconColor: "#64748b",
      tabIconActiveColor: "#1976d2",
      tabIconHoverColor: "#1976d2",
      tabIconDisabledColor: "#94a3b8",
      tabIconTransition: "all 0.2s ease",
      tabIconAnimation: "none",
      tabIconAnimationDuration: 0.3,
      tabIconAnimationDelay: 0,
      tabIconAnimationEasing: "ease",
      tabIconAnimationIterationCount: 1,
      tabIconAnimationDirection: "normal",
      tabIconAnimationFillMode: "none",
      tabIconAnimationPlayState: "running",
    },
  },
  related: {
    settings: StaticTabPanelSettings,
  },
};

export default StaticTabPanel;
