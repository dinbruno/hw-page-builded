import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import { TenantDomainsClient } from "@/services/tenant-domains/tenant-domains-client";

// This is an internal route handler for the root route (/)
// It's accessed via middleware rewrite, not directly by users
export default async function RootHandler() {
  // Verificar cookies para garantir autenticação
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("tenantId")?.value;

  if (!authToken || !tenantId) {
    console.log("Redirecionando para login por falta de credenciais");
    return redirect("/login");
  }

  try {
    console.log("Obtendo workspaces...");
    // Get the user's workspaces
    const workspaces = await WorkspaceService.getWorkspaces();
    console.log("Workspaces obtidos:", workspaces?.length || 0);

    if (workspaces && workspaces.length > 0) {
      const workspace = workspaces[0];
      console.log("Obtendo páginas para workspace:", workspace.id);

      // Obter todas as páginas do workspace
      const pages = await PageService.getAll(workspace.id);
      console.log("Páginas obtidas:", pages?.length || 0);

      // Encontrar a página inicial do workspace
      const homePage = pages.find((page: any) => page.name === "Página Inicial");
      console.log("Página inicial encontrada:", homePage?.slug || "não encontrada");

      // Verificar se já existe um domínio para este tenant ou criar um novo
      console.log("Verificando/criando domínio para tenant...");
      const domainUrl = await TenantDomainsClient.getOrRegisterTenantDomain(
        workspace.name || workspace.slug,
        tenantId,
        true // Forçar criação do domínio se necessário
      );

      console.log("Domínio obtido:", domainUrl);

      if (homePage) {
        // Redirecionar para a página inicial no domínio do tenant
        const fullUrl = `${domainUrl}/${homePage.slug}?workspaceId=${workspace.id}`;
        console.log("Redirecionando para página inicial no domínio do tenant:", fullUrl);
        return redirect(fullUrl);
      } else {
        // Caso não tenha encontrado a página inicial, redirecionar para o fallback no subdomínio do tenant
        const fallbackUrl = `${domainUrl}/workspace/${workspace.slug}`;
        console.log("Página inicial não encontrada. Redirecionando para workspace no domínio do tenant:", fallbackUrl);
        return redirect(fallbackUrl);
      }
    } else {
      // No workspaces, redirect to onboarding
      console.log("Sem workspaces, redirecionando para onboarding");
      return redirect("/onboarding/welcome");
    }
  } catch (error) {
    console.error("Error in root handler redirection:", error);
    // Fallback to login page if any error occurs
    return redirect("/login");
  }
}
