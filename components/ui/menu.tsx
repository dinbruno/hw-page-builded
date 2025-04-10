"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Ellipsis, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/ui/collapse-menu-button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "zustand";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import { WorkspaceSwitcher } from "./workspace-switcher";
import type { Workspace } from "@/services/workspace/workspace.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "./alert";
import { getMenuList } from "@/lib/menu-list";

interface MenuProps {
  isOpen: boolean | undefined;
  workspaces: Workspace[];
  isLoading: boolean;
  error: unknown;
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function Menu({ isOpen, workspaces, isLoading, error }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  const showWorkspaces = !pathname.includes("/configurations");

  const renderWorkspaceSection = () => {
    if (!showWorkspaces) return null;

    if (isLoading) {
      return <Skeleton className="h-10 w-full" />;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load workspaces</AlertDescription>
        </Alert>
      );
    }

    return <WorkspaceSwitcher workspaces={workspaces} />;
  };

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        className="mt-4 h-full w-full"
      >
        <AnimatePresence>
          {isOpen && showWorkspaces && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 mb-4"
            >
              {renderWorkspaceSection()}
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, groupIndex) => (
            <motion.li variants={menuItemVariants} className={cn("w-full", groupLabel ? "pt-4" : "")} key={groupIndex}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-xs font-medium text-[#8899a8] px-4 pb-2 max-w-[248px] truncate uppercase tracking-wider">{groupLabel}</p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-4 w-4 text-[#8899a8]" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs font-medium">{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, menuIndex) =>
                submenus.length === 0 ? (
                  <motion.div variants={menuItemVariants} className="w-full" key={menuIndex}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start h-9 mb-1 text-sm font-medium transition-all duration-200 ease-in-out",
                              active
                                ? "bg-[#e2e1e7] text-[#072c66] dark:bg-[#2d2f39] dark:text-[#8ea0c6]"
                                : "text-[#1f272f] hover:bg-[#f3f4f6] dark:text-[#dfe4ea] dark:hover:bg-[#111928]"
                            )}
                            asChild
                          >
                            <Link href={href}>
                              <span className={cn("flex items-center", isOpen === false ? "" : "mr-3")}>
                                <Icon size={18} />
                              </span>
                              <AnimatePresence>
                                {isOpen !== false && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="truncate"
                                  >
                                    {label}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ) : (
                  <motion.div variants={menuItemVariants} className="w-full" key={menuIndex}>
                    <CollapseMenuButton icon={Icon} label={label} active={active} submenus={submenus} isOpen={isOpen} />
                  </motion.div>
                )
              )}
            </motion.li>
          ))}
          <motion.li variants={menuItemVariants} className="w-full grow flex items-end mt-auto">
            <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
          </motion.li>
        </ul>
      </motion.nav>
    </ScrollArea>
  );
}
