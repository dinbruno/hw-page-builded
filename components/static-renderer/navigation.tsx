"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Page } from "./page-renderer";

interface NavigationProps {
  workspaceId: string;
}

export function Navigation({ workspaceId }: NavigationProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Simular uma chamada à API para obter as páginas
        // Em produção, você substituiria isso por uma chamada real à API
        const response = await fetch(`/api/pages?workspaceId=${workspaceId}`);

        if (!response.ok) {
          throw new Error("Falha ao carregar páginas");
        }

        const data = await response.json();
        setPages(data);
      } catch (err) {
        console.error("Erro ao carregar páginas:", err);
        setError("Não foi possível carregar o menu de navegação");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-md animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-md shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-3">Navegação</h3>
      <ul className="space-y-1">
        {pages.map((page) => {
          const isActive = pathname === `/${page.slug}`;

          return (
            <li key={page.id}>
              <Link
                href={`/${page.slug}`}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                <span>{page.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
