"use client";

import { motion } from "framer-motion";
import React from "react";

interface ResponsiveLayoutProps {
  backgroundColor?: string;
  padding?: number;
  gap?: number;
  fullWidth?: boolean;
  hidden?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  displayName?: string;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
  columnWidths?: number[];
  [key: string]: any;
}

export function StaticTwoEqualColumns({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
  nodes,
  linkedNodes,
  columnWidths = [50, 50],
  ...rest
}: ResponsiveLayoutProps) {
  if (hidden) return null;

  console.log("[StaticTwoEqualColumns] Props recebidas:", {
    id,
    nodes,
    linkedNodes,
    columnWidths,
    restKeys: Object.keys(rest),
  });

  const knownColumn0Keys = ["zHwxTGo5Hz"];
  const knownColumn1Keys = ["n-kf5m4soS", "n_kf5m4soS"];

  const column0Content = knownColumn0Keys.map((key) => rest[key]).find(Boolean);
  const column1Content = knownColumn1Keys.map((key) => rest[key]).find(Boolean);

  console.log("[StaticTwoEqualColumns] Conteúdo encontrado:", {
    column0: column0Content ? "Presente" : "Ausente",
    column1: column1Content ? "Presente" : "Ausente",
  });

  if (column0Content || column1Content) {
    console.log("[StaticTwoEqualColumns] Renderizando conteúdo encontrado");
    return (
      <motion.div
        className={`static-layout static-two-columns w-full ${className || ""}`}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor,
          padding: `${padding}px`,
          width: fullWidth ? "100%" : "auto",
        }}
        id={id}
      >
        <div
          className="flex w-full flex-wrap static-columns-container"
          style={{
            gap: `${gap}px`,
          }}
        >
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${gap / 2}px)`,
            }}
          >
            {column0Content || (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${gap / 2}px)`,
            }}
          >
            {column1Content || (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2 (Vazia)</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const renderLinkedNodes = () => {
    console.log("[StaticTwoEqualColumns] Tentando renderizar linkedNodes", { linkedNodes, nodes });

    if (linkedNodes && nodes && nodes.length > 0) {
      const nodeKey = nodes[0];

      const column0Key = `${nodeKey}-column-0`;
      const column1Key = `${nodeKey}-column-1`;

      const column0LinkedNode = linkedNodes[column0Key];
      const column1LinkedNode = linkedNodes[column1Key];

      console.log("[StaticTwoEqualColumns] Chaves das colunas:", {
        nodeKey,
        column0Key,
        column1Key,
        column0LinkedNode,
        column1LinkedNode,
        hasColumn0Content: column0LinkedNode && rest[column0LinkedNode],
        hasColumn1Content: column1LinkedNode && rest[column1LinkedNode],
      });

      return (
        <>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${gap / 2}px)`,
            }}
          >
            {column0LinkedNode && rest[column0LinkedNode] ? (
              rest[column0LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${gap / 2}px)`,
            }}
          >
            {column1LinkedNode && rest[column1LinkedNode] ? (
              rest[column1LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2 (Vazia)</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return React.Children.count(children) > 0 ? (
      children
    ) : (
      <>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[0]}% - ${gap / 2}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 1</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[1]}% - ${gap / 2}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 2</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`static-layout static-two-columns w-full ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        width: fullWidth ? "100%" : "auto",
      }}
      id={id}
    >
      <div
        className="flex w-full flex-wrap static-columns-container"
        style={{
          gap: `${gap}px`,
        }}
      >
        {renderLinkedNodes()}
      </div>
    </motion.div>
  );
}

export function StaticThreeEqualColumns({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
  nodes,
  linkedNodes,
  columnWidths = [33.33, 33.33, 33.34],
  ...rest
}: ResponsiveLayoutProps) {
  if (hidden) return null;

  const renderLinkedNodes = () => {
    if (linkedNodes && nodes && nodes.length > 0) {
      const nodeKey = nodes[0];

      const column0Key = `${nodeKey}-column-0`;
      const column1Key = `${nodeKey}-column-1`;
      const column2Key = `${nodeKey}-column-2`;

      const column0LinkedNode = linkedNodes[column0Key];
      const column1LinkedNode = linkedNodes[column1Key];
      const column2LinkedNode = linkedNodes[column2Key];

      console.log("Three Columns Linked Nodes:", linkedNodes);

      return (
        <>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column0LinkedNode && rest[column0LinkedNode] ? (
              rest[column0LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column1LinkedNode && rest[column1LinkedNode] ? (
              rest[column1LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[2]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column2LinkedNode && rest[column2LinkedNode] ? (
              rest[column2LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 3 (Vazia)</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return React.Children.count(children) > 0 ? (
      children
    ) : (
      <>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[0]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 1</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[1]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 2</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[2]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 3</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`static-layout static-three-columns w-full ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        width: fullWidth ? "100%" : "auto",
      }}
      id={id}
    >
      <div
        className="flex w-full flex-wrap static-columns-container"
        style={{
          gap: `${gap}px`,
        }}
      >
        {renderLinkedNodes()}
      </div>
    </motion.div>
  );
}

// Static version of SidebarMainLayout
export function StaticSidebarMainLayout({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
  nodes,
  linkedNodes,
  columnWidths = [33.33, 66.67],
  ...rest
}: ResponsiveLayoutProps) {
  if (hidden) return null;

  const renderLinkedNodes = () => {
    if (linkedNodes && nodes && nodes.length > 0) {
      const nodeKey = nodes[0];

      const column0Key = `${nodeKey}-column-0`;
      const column1Key = `${nodeKey}-column-1`;

      const column0LinkedNode = linkedNodes[column0Key];
      const column1LinkedNode = linkedNodes[column1Key];

      console.log("Sidebar Linked Nodes:", linkedNodes);

      return (
        <>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${gap / 2}px)`,
            }}
          >
            {column0LinkedNode && rest[column0LinkedNode] ? (
              rest[column0LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Sidebar (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${gap / 2}px)`,
            }}
          >
            {column1LinkedNode && rest[column1LinkedNode] ? (
              rest[column1LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Conteúdo Principal (Vazio)</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return React.Children.count(children) > 0 ? (
      children
    ) : (
      <>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[0]}% - ${gap / 2}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Sidebar</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[1]}% - ${gap / 2}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Conteúdo Principal</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`static-layout static-sidebar-main w-full ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        width: fullWidth ? "100%" : "auto",
      }}
      id={id}
    >
      <div
        className="flex w-full flex-wrap static-columns-container"
        style={{
          gap: `${gap}px`,
        }}
      >
        {renderLinkedNodes()}
      </div>
    </motion.div>
  );
}

// Static version of ThreeColumnsWideCenter
export function StaticThreeColumnsWideCenter({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
  nodes,
  linkedNodes,
  columnWidths = [25, 50, 25],
  ...rest
}: ResponsiveLayoutProps) {
  if (hidden) return null;

  const renderLinkedNodes = () => {
    if (linkedNodes && nodes && nodes.length > 0) {
      const nodeKey = nodes[0];

      const column0Key = `${nodeKey}-column-0`;
      const column1Key = `${nodeKey}-column-1`;
      const column2Key = `${nodeKey}-column-2`;

      const column0LinkedNode = linkedNodes[column0Key];
      const column1LinkedNode = linkedNodes[column1Key];
      const column2LinkedNode = linkedNodes[column2Key];

      console.log("Wide Center Linked Nodes:", linkedNodes);

      return (
        <>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column0LinkedNode && rest[column0LinkedNode] ? (
              rest[column0LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column1LinkedNode && rest[column1LinkedNode] ? (
              rest[column1LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna Central (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[2]}% - ${(gap * 2) / 3}px)`,
            }}
          >
            {column2LinkedNode && rest[column2LinkedNode] ? (
              rest[column2LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 3 (Vazia)</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return React.Children.count(children) > 0 ? (
      children
    ) : (
      <>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[0]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 1</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[1]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna Central</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[2]}% - ${(gap * 2) / 3}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 3</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`static-layout static-three-columns-wide-center w-full ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        width: fullWidth ? "100%" : "auto",
      }}
      id={id}
    >
      <div
        className="flex w-full flex-wrap static-columns-container"
        style={{
          gap: `${gap}px`,
        }}
      >
        {renderLinkedNodes()}
      </div>
    </motion.div>
  );
}

// Static version of FourEqualColumns
export function StaticFourEqualColumns({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
  nodes,
  linkedNodes,
  columnWidths = [25, 25, 25, 25],
  ...rest
}: ResponsiveLayoutProps) {
  if (hidden) return null;

  const renderLinkedNodes = () => {
    if (linkedNodes && nodes && nodes.length > 0) {
      const nodeKey = nodes[0];

      const column0Key = `${nodeKey}-column-0`;
      const column1Key = `${nodeKey}-column-1`;
      const column2Key = `${nodeKey}-column-2`;
      const column3Key = `${nodeKey}-column-3`;

      const column0LinkedNode = linkedNodes[column0Key];
      const column1LinkedNode = linkedNodes[column1Key];
      const column2LinkedNode = linkedNodes[column2Key];
      const column3LinkedNode = linkedNodes[column3Key];

      console.log("Four Columns Linked Nodes:", linkedNodes);

      return (
        <>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[0]}% - ${(gap * 3) / 4}px)`,
            }}
          >
            {column0LinkedNode && rest[column0LinkedNode] ? (
              rest[column0LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[1]}% - ${(gap * 3) / 4}px)`,
            }}
          >
            {column1LinkedNode && rest[column1LinkedNode] ? (
              rest[column1LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[2]}% - ${(gap * 3) / 4}px)`,
            }}
          >
            {column2LinkedNode && rest[column2LinkedNode] ? (
              rest[column2LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 3 (Vazia)</p>
              </div>
            )}
          </div>
          <div
            className="static-column"
            style={{
              width: `calc(${columnWidths[3]}% - ${(gap * 3) / 4}px)`,
            }}
          >
            {column3LinkedNode && rest[column3LinkedNode] ? (
              rest[column3LinkedNode]
            ) : (
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 4 (Vazia)</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return React.Children.count(children) > 0 ? (
      children
    ) : (
      <>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[0]}% - ${(gap * 3) / 4}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 1</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[1]}% - ${(gap * 3) / 4}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 2</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[2]}% - ${(gap * 3) / 4}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 3</p>
          </div>
        </div>
        <div
          className="static-column-placeholder"
          style={{
            width: `calc(${columnWidths[3]}% - ${(gap * 3) / 4}px)`,
          }}
        >
          <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">Coluna 4</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`static-layout static-four-columns w-full ${className || ""}`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        width: fullWidth ? "100%" : "auto",
      }}
      id={id}
    >
      <div
        className="flex w-full flex-wrap static-columns-container"
        style={{
          gap: `${gap}px`,
        }}
      >
        {renderLinkedNodes()}
      </div>
    </motion.div>
  );
}
