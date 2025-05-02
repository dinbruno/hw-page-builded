"use client";

import React from "react";
import { motion } from "framer-motion";

interface StaticGridLayoutProps {
  columns?: {
    id: string;
    width: string;
    minWidth?: number;
    maxWidth?: number;
  }[];
  gap?: number;
  backgroundColor?: string;
  padding?: number;
  fullWidth?: boolean;
  maxColumns?: number;
  hidden?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  displayName?: string;
  linkedNodes?: Record<string, string>;
  [key: string]: any;
}

export default function StaticGridLayout({
  columns = [
    { id: "col1", width: "50%" },
    { id: "col2", width: "50%" },
  ],
  gap = 16,
  backgroundColor = "transparent",
  padding = 16,
  fullWidth = true,
  maxColumns = 6,
  hidden = false,
  className = "",
  children,
  id,
  linkedNodes,
  ...rest
}: StaticGridLayoutProps) {
  if (hidden) return null;

  console.log("[StaticGridLayout] Props:", {
    id,
    linkedNodes,
    columns,
    restKeys: Object.keys(rest).length > 0 ? Object.keys(rest).slice(0, 5) : [],
  });

  const renderColumns = () => {
    // First check if we have direct children to render
    if (React.Children.count(children) > 0) {
      console.log("[StaticGridLayout] Rendering direct children");
      return children;
    }

    // Check if we have linkedNodes to process
    if (linkedNodes && Object.keys(linkedNodes).length > 0) {
      console.log("[StaticGridLayout] Processing linkedNodes:", linkedNodes);

      // Get all linkedNodes entries
      const columnsEntries = Object.entries(linkedNodes);

      if (columnsEntries.length > 0) {
        // Extract nodeIds from linkedNodes
        return columnsEntries.map(([key, nodeId], index) => {
          // Determine which column config to use based on the key pattern
          const columnIndex = key.includes("column-") ? parseInt(key.split("-")[2]) : index;

          // Use the column config if available, otherwise use default
          const columnConfig =
            columnIndex < columns.length
              ? columns[columnIndex]
              : {
                  id: `col${index + 1}`,
                  width: `${Math.floor(100 / columnsEntries.length)}%`,
                };

          console.log(`[StaticGridLayout] Rendering column ${key} -> ${nodeId} with config:`, columnConfig);

          return (
            <div
              key={`grid-column-${index}`}
              className="static-column"
              style={{
                flex: `0 0 ${columnConfig.width}`,
                width: columnConfig.width,
                minWidth: columnConfig.minWidth ? `${columnConfig.minWidth}px` : undefined,
                maxWidth: columnConfig.maxWidth ? `${columnConfig.maxWidth}px` : undefined,
              }}
            >
              {rest[nodeId] ? (
                Array.isArray(rest[nodeId]) ? (
                  <div className="column-content h-full">{rest[nodeId]}</div>
                ) : (
                  rest[nodeId]
                )
              ) : (
                <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">Coluna {index + 1} (Vazia)</p>
                </div>
              )}
            </div>
          );
        });
      }
    }

    // Fallback: render column structure based on props
    console.log("[StaticGridLayout] Rendering default columns structure");
    return columns.map((column, index) => {
      // Try to find any content with matching column ID patterns
      const columnKey = `column-${column.id}-${index}`;
      const columnContent = rest[columnKey];

      return (
        <div
          key={`${column.id}-${index}`}
          className="static-column"
          style={{
            flex: `0 0 ${column.width}`,
            width: column.width,
            minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
            maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
          }}
        >
          {columnContent ? (
            Array.isArray(columnContent) ? (
              <div className="column-content h-full">{columnContent}</div>
            ) : (
              columnContent
            )
          ) : (
            <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
              <p className="text-sm text-gray-500">Coluna {index + 1} (Vazia)</p>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <motion.div
      className={`static-layout static-grid-layout w-full ${className || ""}`}
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
        {renderColumns()}
      </div>
    </motion.div>
  );
}
