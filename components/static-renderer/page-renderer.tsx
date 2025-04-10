"use client";

import { motion } from "framer-motion";
import { ComponentRenderer } from "./component-renderer";
import { useEffect, useState } from "react";

export interface Page {
  id: string;
  name: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export function PageRenderer({ pageData }: { pageData: Page }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to ensure all components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pageData || !pageData.content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Content</h1>
          <p>This page has no content to display.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="static-page-container">
      <ComponentRenderer content={pageData.content} />
    </motion.div>
  );
}
