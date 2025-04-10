"use client"

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { Sheet, SheetHeader, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Workspace } from "@/services/workspace/workspace.types";
import { useQuery } from "@tanstack/react-query";
import { getWorkspacesNoSSR } from "@/services/workspace/client-side/get-workspaces";

export function SheetMenu() {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: getWorkspacesNoSSR,
  });

  const formattedWorkspaces =
    workspaces?.map((workspace: Workspace) => ({
      ...workspace,
      id: workspace.id,
      name: workspace.name,
      icon: workspace.thumb,
      current: false,
    })) || [];

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button className="flex justify-center items-center pb-2 pt-1" variant="link" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src={"/Logo.png"} alt="Logo.png" width={150} height={150} className="" />
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen workspaces={formattedWorkspaces} isLoading={isLoading} error={error} />
      </SheetContent>
    </Sheet>
  );
}
