"use client";

import { Fragment } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Importar componentes dinamicamente para reduzir o tamanho inicial do bundle
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

// Importar os layouts responsivos
import {
  StaticTwoEqualColumns,
  StaticThreeEqualColumns,
  StaticSidebarMainLayout,
  StaticThreeColumnsWideCenter,
} from "./components/static-responsive-layouts";

// Mapear tipos de componentes para suas implementações estáticas
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
};

export function ComponentRenderer({ content }: { content: any }) {
  if (!content || !content.ROOT) {
    return null;
  }

  // Debug helper
  const debugContent = (nodeId: string, depth = 0) => {
    const node = content[nodeId];
    if (!node) return;

    const indent = " ".repeat(depth * 2);
    console.log(`${indent}Node ${nodeId}: type=${node.type?.resolvedName || node.type || "unknown"}`);

    if (node.nodes && node.nodes.length > 0) {
      console.log(`${indent}Children: ${node.nodes.length}`);
      node.nodes.forEach((childId: string) => debugContent(childId, depth + 1));
    }
  };

  // Função auxiliar para determinar se um nó é uma coluna
  const isColumnNode = (node: any) => {
    return (
      node && (node.type?.resolvedName === "Column" || node.type === "Column" || (node.props && node.props.canvas) || node.displayName === "Column")
    );
  };

  // Função para encontrar e renderizar todos os componentes dentro de uma coluna
  const renderColumnContents = (columnId: string) => {
    const columnNode = content[columnId];

    if (!columnNode) return null;

    // Identificar todos os componentes que são filhos desta coluna
    if (columnNode.nodes && columnNode.nodes.length > 0) {
      return columnNode.nodes.map((childId: string) => {
        // Verificar se este nó filho existe
        if (!content[childId]) return null;

        // Renderizar cada componente filho
        return renderNode(childId);
      });
    }

    return null;
  };

  // Função para renderizar recursivamente os componentes
  const renderNode = (nodeId: string) => {
    const node = content[nodeId];

    if (!node) return null;

    // Lidar com tipo Element (contêiner) ou div
    if (node.type?.resolvedName === "Element" || node.type === "div" || (typeof node.type === "string" && node.type === "div")) {
      return (
        <motion.div
          key={nodeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={node.props?.className || ""}
          style={node.props?.style || {}}
          id={node.props?.id}
        >
          {node.nodes?.map((childId: string) => renderNode(childId))}
        </motion.div>
      );
    }

    // Lidar com tipos específicos de componentes
    const componentType = node.type?.resolvedName;
    const StaticComponent = componentMap[componentType];

    if (StaticComponent) {
      // Se o componente tiver filhos
      if (node.nodes && node.nodes.length > 0) {
        // Para layouts responsivos
        if (
          componentType === "TwoEqualColumns" ||
          componentType === "ThreeEqualColumns" ||
          componentType === "SidebarMainLayout" ||
          componentType === "ThreeColumnsWideCenter"
        ) {
          // Definir larguras de acordo com o tipo de layout
          const columnWidths =
            componentType === "TwoEqualColumns"
              ? ["50%", "50%"]
              : componentType === "ThreeEqualColumns"
              ? ["33.33%", "33.33%", "33.33%"]
              : componentType === "SidebarMainLayout"
              ? ["33.33%", "66.67%"]
              : ["25%", "50%", "25%"]; // ThreeColumnsWideCenter

          // Tentar abordagem mais flexível para encontrar colunas no layout
          let columnNodes = node.nodes;

          // Tentar encontrar colunas diretamente, se não achar, pode ser que tenhamos uma estrutura diferente
          const hasColumns = columnNodes.some((childId: string) => {
            const childNode = content[childId];
            return childNode && isColumnNode(childNode);
          });

          // Se não encontrar colunas, tentar verificar se há uma estrutura de "data" intermediária
          if (!hasColumns && columnNodes.length === 1) {
            const firstChild = content[columnNodes[0]];
            if (firstChild && firstChild.nodes) {
              // Usar os filhos deste nó intermediário como colunas
              columnNodes = firstChild.nodes;
            }
          }

          // Renderizar cada coluna com seus conteúdos
          const columnContainers = columnNodes.map((columnId: string, index: number) => {
            // Obter informações da coluna
            const columnNode = content[columnId];
            if (!columnNode) return null;

            // Definir largura da coluna
            const columnWidth = columnWidths[index % columnWidths.length];
            const columnGap = node.props?.gap || 16;

            // Ajustar a largura para considerar as margens/gap
            let adjustedWidth = columnWidth;
            if (columnWidth.includes("%")) {
              // Ajustar baseado no número de colunas e o gap
              if (columnNodes.length > 1) {
                const totalGapWidth = (columnNodes.length - 1) * columnGap;
                const gapPerColumn = totalGapWidth / columnNodes.length;
                const percentValue = parseFloat(columnWidth);
                adjustedWidth = `calc(${columnWidth} - ${gapPerColumn}px)`;
              }
            }

            // Se for uma coluna real, usamos StaticColumn para renderizá-la
            if (isColumnNode(columnNode)) {
              return (
                <div
                  key={columnId}
                  className="column-wrapper"
                  style={{
                    width: adjustedWidth,
                    flex: `0 0 ${adjustedWidth}`,
                  }}
                >
                  <StaticColumn {...columnNode.props} key={columnId}>
                    {/* Renderizar todos os componentes que estão dentro dessa coluna */}
                    {columnNode.nodes && columnNode.nodes.map((childId: string) => renderNode(childId))}
                  </StaticColumn>
                </div>
              );
            }

            // Se não for reconhecido como coluna, renderizamos normalmente
            return (
              <div
                key={columnId}
                className="column-wrapper"
                style={{
                  width: adjustedWidth,
                  flex: `0 0 ${adjustedWidth}`,
                }}
              >
                {renderNode(columnId)}
              </div>
            );
          });

          // Se tivermos colunas para renderizar
          if (columnContainers.some(Boolean)) {
            return (
              <StaticComponent key={nodeId} {...node.props} id={nodeId}>
                {columnContainers}
              </StaticComponent>
            );
          }

          // Fallback para o caso da estrutura do layout não ser reconhecida
          return (
            <StaticComponent key={nodeId} {...node.props} id={nodeId}>
              {node.nodes.map((childId: string) => renderNode(childId))}
            </StaticComponent>
          );
        }

        // Para outros componentes com filhos
        return (
          <StaticComponent key={nodeId} {...node.props}>
            {node.nodes.map((childId: string) => renderNode(childId))}
          </StaticComponent>
        );
      }

      // Componentes sem filhos
      return <StaticComponent key={nodeId} {...node.props} />;
    }

    // Fallback para componentes não reconhecidos
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
