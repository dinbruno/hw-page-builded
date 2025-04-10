"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Workspace } from "@/services/workspace/workspace.types";
import { getWorkspacesNoSSR } from "@/services/workspace/client-side/get-workspaces";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: getWorkspacesNoSSR,
  });

  if (!sidebar) return null;

  const formattedWorkspaces =
    workspaces?.map((workspace: Workspace) => ({
      ...workspace,
      id: workspace.id,
      name: workspace.name,
      icon: workspace.thumb,
      current: false,
    })) || [];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto"
      >
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <Button
              className={cn("transition-transform ease-in-out duration-300 mb-1", sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0")}
              variant="link"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image src="/Logo.png" alt="logo" width={150} height={150} className="" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>

        <Menu workspaces={formattedWorkspaces} isOpen={sidebar?.isOpen} isLoading={isLoading} error={error} />
      </motion.div>
    </aside>
  );
}
