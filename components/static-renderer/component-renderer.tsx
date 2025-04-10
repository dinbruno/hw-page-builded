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
};

export function ComponentRenderer({ content }: { content: any }) {
  if (!content || !content.ROOT) {
    return null;
  }

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
      // Se o componente tiver filhos (como o CollapsibleSidebar, Container ou Column)
      if (node.nodes && node.nodes.length > 0) {
        return (
          <StaticComponent key={nodeId} {...node.props}>
            {node.nodes.map((childId: string) => renderNode(childId))}
          </StaticComponent>
        );
      }
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
