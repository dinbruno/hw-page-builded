"use client";

import { motion } from "framer-motion";
import React from "react";

// Interface comum para todos os layouts responsivos
interface ResponsiveLayoutProps {
  backgroundColor?: string;
  padding?: number;
  gap?: number;
  fullWidth?: boolean;
  hidden?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  // Props para compatibilidade com o sistema de renderização
  displayName?: string;
  nodes?: string[];
  [key: string]: any;
}

// Static version of TwoEqualColumns
export function StaticTwoEqualColumns({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
}: ResponsiveLayoutProps) {
  if (hidden) return null;

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
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <>
            <div className="static-column-placeholder w-[calc(50%-8px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(50%-8px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2</p>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Static version of ThreeEqualColumns
export function StaticThreeEqualColumns({
  backgroundColor = "transparent",
  padding = 16,
  gap = 16,
  fullWidth = true,
  hidden = false,
  className = "",
  children,
  id,
}: ResponsiveLayoutProps) {
  if (hidden) return null;

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
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <>
            <div className="static-column-placeholder w-[calc(33.33%-11px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(33.33%-11px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 2</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(33.33%-11px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 3</p>
              </div>
            </div>
          </>
        )}
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
}: ResponsiveLayoutProps) {
  if (hidden) return null;

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
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <>
            <div className="static-column-placeholder w-[calc(33.33%-11px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Sidebar</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(66.67%-5px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Conteúdo Principal</p>
              </div>
            </div>
          </>
        )}
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
}: ResponsiveLayoutProps) {
  if (hidden) return null;

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
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <>
            <div className="static-column-placeholder w-[calc(25%-12px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 1</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(50%-8px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna Central</p>
              </div>
            </div>
            <div className="static-column-placeholder w-[calc(25%-12px)]">
              <div className="flex items-center justify-center h-full min-h-[100px] w-full border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">Coluna 3</p>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
