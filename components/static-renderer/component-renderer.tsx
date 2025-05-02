"use client";

import { Fragment } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const StaticBanner = dynamic(() => import("./components/static-banner"));
const StaticParagraph = dynamic(() => import("./components/static-paragraph"));
const StaticCalendar = dynamic(() => import("./components/static-calendar"));
const StaticBirthdayList = dynamic(() => import("./components/static-birthday-list"));
const StaticButton = dynamic(() => import("./components/static-button"));
const StaticCollapsibleSidebar = dynamic(() => import("./components/static-collapsible-sidebar"));
const StaticCollaboratorsList = dynamic(() => import("./components/static-collaborators-list"));
const StaticColumn = dynamic(() => import("./components/static-column"));
const StaticContainer = dynamic(() => import("./components/static-container"));
const StaticCommentsSection = dynamic(() => import("./components/static-comments-section"));
const StaticDocumentsList = dynamic(() => import("./components/static-documents-list"));
const StaticHeader = dynamic(() => import("./components/static-header"));
const StaticKanbanBoard = dynamic(() => import("./components/static-kanban-board"));
const StaticTable = dynamic(() => import("./components/static-table"));
const StaticProductCarousel = dynamic(() => import("./components/static-product-carousel"));
const StaticProductCard = dynamic(() => import("./components/static-product-card"));
const StaticHeroCarousel = dynamic(() => import("./components/static-hero-carousel"));

import {
  StaticTwoEqualColumns,
  StaticThreeEqualColumns,
  StaticSidebarMainLayout,
  StaticThreeColumnsWideCenter,
} from "./components/static-responsive-layouts";

const componentMap: Record<string, any> = {
  Banner: StaticBanner,
  Paragraph: StaticParagraph,
  Calendar: StaticCalendar,
  BirthdayList: StaticBirthdayList,
  Button: StaticButton,
  CollapsibleSidebar: StaticCollapsibleSidebar,
  CollaboratorsList: StaticCollaboratorsList,
  Column: StaticColumn,
  Container: StaticContainer,
  CommentsSection: StaticCommentsSection,
  DocumentsList: StaticDocumentsList,
  TwoEqualColumns: StaticTwoEqualColumns,
  ThreeEqualColumns: StaticThreeEqualColumns,
  SidebarMainLayout: StaticSidebarMainLayout,
  ThreeColumnsWideCenter: StaticThreeColumnsWideCenter,
  Header: StaticHeader,
  KanbanBoard: StaticKanbanBoard,
  DynamicTable: StaticTable,
  ProductCarousel: StaticProductCarousel,
  ProductCard: StaticProductCard,
  HeroSection: StaticHeroCarousel,
};

export function ComponentRenderer({ content }: { content: any }) {
  if (!content || !content.ROOT) {
    return null;
  }

  const debugContent = (nodeId: string, depth = 0) => {
    const node = content[nodeId];
    if (!node) return;

    const indent = " ".repeat(depth * 2);
    console.log(`${indent}Node ${nodeId}: type=${node.type?.resolvedName || node.type || "unknown"}`);

    if (node.nodes && node.nodes.length > 0) {
      console.log(`${indent}Children: ${node.nodes.length}`);
      node.nodes.forEach((childId: string) => debugContent(childId, depth + 1));
    }

    if (node.linkedNodes) {
      console.log(`${indent}LinkedNodes:`, node.linkedNodes);
    }
  };

  console.log("=== DEBUG DA ESTRUTURA DE CONTEÚDO ===");
  debugContent("ROOT");
  console.log("=====================================");

  const isColumnNode = (node: any) => {
    return (
      node && (node.type?.resolvedName === "Column" || node.type === "Column" || (node.props && node.props.canvas) || node.displayName === "Column")
    );
  };

  const renderColumnContents = (columnId: string) => {
    const columnNode = content[columnId];

    if (!columnNode) return null;

    if (columnNode.nodes && columnNode.nodes.length > 0) {
      return columnNode.nodes.map((childId: string) => {
        if (!content[childId]) return null;
        return renderNode(childId);
      });
    }

    return null;
  };

  const renderNode = (nodeId: string) => {
    const node = content[nodeId];

    if (!node) return null;

    // Helper function to extract layout styles from props
    const extractLayoutStyles = (props: any) => {
      const styles: Record<string, any> = {};

      // Apply margins if defined
      if (props.margin) {
        styles.marginTop = `${props.margin.top}px`;
        styles.marginRight = `${props.margin.right}px`;
        styles.marginBottom = `${props.margin.bottom}px`;
        styles.marginLeft = `${props.margin.left}px`;
      }

      // Apply borders if defined
      if (props.border && props.border.width > 0) {
        styles.borderWidth = `${props.border.width}px`;
        styles.borderStyle = props.border.style || "solid";
        styles.borderColor = props.border.color || "#e5e7eb";

        if (props.border.radius) {
          styles.borderTopLeftRadius = `${props.border.radius.topLeft}px`;
          styles.borderTopRightRadius = `${props.border.radius.topRight}px`;
          styles.borderBottomLeftRadius = `${props.border.radius.bottomLeft}px`;
          styles.borderBottomRightRadius = `${props.border.radius.bottomRight}px`;
        }
      }

      // Apply shadow if defined
      if (props.shadow && props.shadow !== "none") {
        const shadowMap: Record<string, string> = {
          sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        };
        styles.boxShadow = shadowMap[props.shadow] || "none";
      }

      return styles;
    };

    if (node.type?.resolvedName === "Element" || node.type === "div" || (typeof node.type === "string" && node.type === "div")) {
      return (
        <motion.div
          key={nodeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={node.props?.className || ""}
          style={{ ...(node.props?.style || {}), ...extractLayoutStyles(node.props) }}
          id={node.props?.id}
        >
          {node.nodes?.map((childId: string) => renderNode(childId))}
        </motion.div>
      );
    }

    const componentType = node.type?.resolvedName;
    const StaticComponent = componentMap[componentType];

    if (StaticComponent) {
      // Special handling for layout components
      if (
        componentType === "TwoEqualColumns" ||
        componentType === "ThreeEqualColumns" ||
        componentType === "SidebarMainLayout" ||
        componentType === "ThreeColumnsWideCenter"
      ) {
        const layoutStyles = extractLayoutStyles(node.props);
        console.log(`SOLUÇÂO GENÉRICA: Renderizando o layout ${componentType} com ID ${nodeId}`);

        if (node.linkedNodes && Object.keys(node.linkedNodes).length > 0) {
          console.log("Encontrado linkedNodes para processar:", node.linkedNodes);

          const columnKeys = Object.entries(node.linkedNodes)
            .sort(([keyA], [keyB]) => {
              const indexA = keyA.includes("-column-") ? parseInt(keyA.split("-column-")[1]) : 0;
              const indexB = keyB.includes("-column-") ? parseInt(keyB.split("-column-")[1]) : 0;
              return indexA - indexB;
            })
            .map(([_, nodeId]) => nodeId as string);

          console.log("Chaves de coluna ordenadas:", columnKeys);

          let columnWidths: string[] = [];

          if (componentType === "TwoEqualColumns") {
            columnWidths = ["calc(50% - 8px)", "calc(50% - 8px)"];
          } else if (componentType === "ThreeEqualColumns") {
            columnWidths = ["calc(33.33% - 11px)", "calc(33.33% - 11px)", "calc(33.33% - 11px)"];
          } else if (componentType === "SidebarMainLayout") {
            columnWidths = ["calc(33.33% - 11px)", "calc(66.67% - 5px)"];
          } else if (componentType === "ThreeColumnsWideCenter") {
            columnWidths = ["calc(25% - 12px)", "calc(50% - 8px)", "calc(25% - 12px)"];
          }

          if (columnKeys.length > 0 && columnWidths.length > 0) {
            const columnContents = columnKeys.map((columnKey, index) => {
              const columnNode = content[columnKey];
              const columnChildNodes = columnNode?.nodes?.map((childId: string) => renderNode(childId)) || [];
              const columnWidth = index < columnWidths.length ? columnWidths[index] : columnWidths[0];
              const columnName = `Coluna ${index + 1}`;

              return (
                <div key={`column-${index}`} className="static-column" style={{ width: columnWidth }}>
                  {columnChildNodes.length > 0 ? (
                    <div className="column-content h-full">{columnChildNodes}</div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                      <p className="text-sm text-gray-500">{columnName} (Vazia)</p>
                    </div>
                  )}
                </div>
              );
            });

            return (
              <div
                className={`static-layout static-${componentType.toLowerCase()} w-full ${node.props?.className || ""}`}
                id={nodeId}
                style={{
                  backgroundColor: node.props?.backgroundColor || "transparent",
                  padding: `${node.props?.padding || 16}px`,
                  width: node.props?.fullWidth ? "100%" : "auto",
                  ...layoutStyles,
                }}
              >
                <div className="flex w-full flex-wrap static-columns-container" style={{ gap: `${node.props?.gap || 16}px` }}>
                  {columnContents}
                </div>
              </div>
            );
          }
        } else {
          console.log("Layout não tem linkedNodes, verificando nós filhos diretamente");

          const columnNodes = node.nodes
            .map((nodeId: string) => ({ id: nodeId, node: content[nodeId] }))
            .filter(({ node }) => node?.type?.resolvedName === "Column" || node?.custom?.layoutType === "column" || node?.displayName === "Coluna");

          console.log(
            `Encontradas ${columnNodes.length} possíveis colunas nos nós filhos:`,
            columnNodes.map((col) => col.id)
          );

          if (columnNodes.length > 0) {
            let columnWidths: string[] = [];

            if (componentType === "TwoEqualColumns") {
              columnWidths = ["calc(50% - 8px)", "calc(50% - 8px)"];
            } else if (componentType === "ThreeEqualColumns") {
              columnWidths = ["calc(33.33% - 11px)", "calc(33.33% - 11px)", "calc(33.33% - 11px)"];
            } else if (componentType === "SidebarMainLayout") {
              columnWidths = ["calc(33.33% - 11px)", "calc(66.67% - 5px)"];
            } else if (componentType === "ThreeColumnsWideCenter") {
              columnWidths = ["calc(25% - 12px)", "calc(50% - 8px)", "calc(25% - 12px)"];
            }

            // Renderizar cada coluna
            const columnContents = columnNodes.map(({ id, node }, index) => {
              // Renderizar os filhos da coluna
              const columnChildNodes = node?.nodes?.map((childId: string) => renderNode(childId)) || [];

              // Definir a largura da coluna
              const columnWidth = index < columnWidths.length ? columnWidths[index] : columnWidths[0];

              // Nome padrão da coluna
              const columnName = `Coluna ${index + 1}`;

              // Renderizar a coluna
              return (
                <div key={`column-${index}`} className="static-column" style={{ width: columnWidth }}>
                  {columnChildNodes.length > 0 ? (
                    <div className="column-content h-full">{columnChildNodes}</div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                      <p className="text-sm text-gray-500">{columnName} (Vazia)</p>
                    </div>
                  )}
                </div>
              );
            });

            // Renderizar a estrutura final
            return (
              <div
                className={`static-layout static-${componentType.toLowerCase()} w-full ${node.props?.className || ""}`}
                id={nodeId}
                style={{
                  backgroundColor: node.props?.backgroundColor || "transparent",
                  padding: `${node.props?.padding || 16}px`,
                  width: node.props?.fullWidth ? "100%" : "auto",
                  ...layoutStyles,
                }}
              >
                <div className="flex w-full flex-wrap static-columns-container" style={{ gap: `${node.props?.gap || 16}px` }}>
                  {columnContents}
                </div>
              </div>
            );
          }
        }

        // Special handling for specific layout case
        if (node.nodes && node.nodes.length > 0) {
          if (nodeId === "S6ijSJt_KB" && componentType === "TwoEqualColumns") {
            console.log("ATENÇÃO: Renderizando TwoEqualColumns específico");

            // Get column nodes directly
            const column0Key = "zHwxTGo5Hz";
            const column1Key = "n-kf5m4soS";

            // Render column contents
            const column0Content = content[column0Key] ? renderNode(column0Key) : null;
            const column1Content = content[column1Key] ? renderNode(column1Key) : null;

            // Build correct linkedNodes
            const correctLinkedNodes = {
              "S6ijSJt_KB-column-0": column0Key,
              "S6ijSJt_KB-column-1": column1Key,
            };

            // Convert second ID to avoid hyphen issues
            const validColumn1Key = "n_kf5m4soS"; // Replace hyphen with underscore

            // Create props object
            const columnContent: Record<string, React.ReactNode> = {
              [column0Key]: column0Content,
            };

            // Add second column with converted name
            columnContent[validColumn1Key] = column1Content;

            // Pass props directly
            return (
              <StaticComponent
                key={nodeId}
                {...node.props}
                style={{ ...(node.props?.style || {}), ...layoutStyles }}
                id={nodeId}
                nodes={["S6ijSJt_KB"]}
                linkedNodes={correctLinkedNodes}
                {...columnContent}
              />
            );
          }
        }
      }

      // Handle other components, applying layout styles
      const layoutStyles = extractLayoutStyles(node.props);
      const mergedProps = {
        ...node.props,
        style: { ...(node.props?.style || {}), ...layoutStyles },
      };

      // For components with children
      if (node.nodes && node.nodes.length > 0) {
        return (
          <StaticComponent key={nodeId} {...mergedProps}>
            {node.nodes.map((childId: string) => renderNode(childId))}
          </StaticComponent>
        );
      }

      // For components without children
      return <StaticComponent key={nodeId} {...mergedProps} />;
    }

    // Fallback for unrecognized components
    return (
      <div key={nodeId} className="p-4 border border-dashed border-gray-300 rounded-md">
        <p className="text-sm text-gray-500">
          Tipo de componente não implementado: {componentType || (typeof node.type === "string" ? node.type : "Desconhecido")}
        </p>
      </div>
    );
  };

  // Começar a renderização a partir do nó ROOT
  return <Fragment>{renderNode("ROOT")}</Fragment>;
}
