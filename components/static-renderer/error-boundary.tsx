"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Erro capturado pelo ErrorBoundary:", event.error);
      setHasError(true);

      event.preventDefault();
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      fallback || (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-red-50 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado</h2>
          <p className="text-gray-700 mb-6">Ocorreu um erro ao renderizar esta página. Por favor, tente novamente mais tarde.</p>
          <button onClick={() => setHasError(false)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Tentar novamente
          </button>
        </motion.div>
      )
    );
  }

  return <>{children}</>;
}
