"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceService } from "../services/workspaces/workspaces.service";

interface WorkspaceContextType {
  currentWorkspace: any;
  workspaces: any[];
  tenantId: string | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeWorkspace = async () => {
      try {
        setIsLoading(true);

        // Verificar se há token de autenticação
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        // Obter tenant ID do localStorage
        const storedTenantId = localStorage.getItem("tenantId");
        if (storedTenantId) {
          setTenantId(storedTenantId);
        }

        // Obter workspaces do usuário
        const userWorkspaces = await WorkspaceService.getWorkspaces();

        if (userWorkspaces && userWorkspaces.length > 0) {
          setWorkspaces(userWorkspaces);

          // Verificar se há um workspace atual no localStorage
          const storedWorkspace = localStorage.getItem("currentWorkspace");
          if (storedWorkspace) {
            setCurrentWorkspace(JSON.parse(storedWorkspace));
          } else {
            // Usar o primeiro workspace como padrão
            setCurrentWorkspace(userWorkspaces[0]);
            localStorage.setItem("currentWorkspace", JSON.stringify(userWorkspaces[0]));
          }
        } else if (!window.location.pathname.startsWith("/onboarding")) {
          // Redirecionar para onboarding se não houver workspaces
          router.push("/onboarding/welcome");
        }
      } catch (error) {
        console.error("Erro ao inicializar workspace:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkspace();
  }, [router]);

  const switchWorkspace = async (workspaceId: string) => {
    try {
      setIsLoading(true);

      // Encontrar o workspace pelo ID
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (!workspace) {
        throw new Error("Workspace não encontrado");
      }

      // Atualizar workspace atual
      setCurrentWorkspace(workspace);
      localStorage.setItem("currentWorkspace", JSON.stringify(workspace));

      // Redirecionar para a página inicial do workspace
      router.push(`/workspace/${workspace.slug}`);
    } catch (error) {
      console.error("Erro ao trocar de workspace:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        tenantId,
        isLoading,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (context === undefined) {
    throw new Error("useWorkspace deve ser usado dentro de um WorkspaceProvider");
  }

  return context;
}
