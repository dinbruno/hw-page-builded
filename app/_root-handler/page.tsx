import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import { TenantBuildsService } from "@/services/tenant-builds/tenant-builds.service";

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
      // Verificar se já existe um build específico para este tenant
      console.log("Verificando se existe build para o tenant:", tenantId);

      // Verificar ambiente atual
      const isProduction = process.env.NODE_ENV === "production";

      // Se for produção, verificar se existe build específico para o tenant
      if (isProduction) {
        // Verificar se este é o build principal ou um build específico do tenant
        const isTenantBuild = process.env.NEXT_PUBLIC_IS_TENANT_BUILD === "true";

        if (!isTenantBuild) {
          // Este é o build principal, precisamos verificar/criar um build específico
          const tenantBuildUrl = await TenantBuildsService.getOrCreateTenantBuildUrl(tenantId, workspaces[0].id);

          if (tenantBuildUrl) {
            console.log("Redirecionando para build específico do tenant:", tenantBuildUrl);

            // Construir a URL completa com a rota da página inicial
            try {
              // Get all pages for the workspace
              const pages = await PageService.getAll(workspaces[0].id);
              const homePage = pages.find((page: any) => page.name === "Página Inicial");

              if (homePage) {
                // Redirect to tenant build with the home page path
                const fullUrl = `${tenantBuildUrl}/${homePage.slug}?workspaceId=${workspaces[0].id}`;
                console.log("Redirecionando para URL completa:", fullUrl);
                return redirect(fullUrl);
              } else {
                // No home page found, redirect to tenant build root
                return redirect(tenantBuildUrl);
              }
            } catch (pageError) {
              console.error("Erro ao buscar página inicial:", pageError);
              // Falha ao buscar página, redirecionar para a raiz do build
              return redirect(tenantBuildUrl);
            }
          }
        }
      }

      // Este é um build específico do tenant ou estamos em desenvolvimento
      // Continuar com o fluxo normal para redirecionar para a página inicial
      console.log("Obtendo páginas para workspace:", workspaces[0].id);
      // Try to find the "Página Inicial" page
      const pages = await PageService.getAll(workspaces[0].id);
      console.log("Páginas obtidas:", pages?.length || 0);

      const homePage = pages.find((page: any) => page.name === "Página Inicial");
      console.log("Página inicial encontrada:", homePage?.slug || "não encontrada");

      if (homePage) {
        // Redirect to the home page with workspaceId
        const redirectUrl = `/${homePage.slug}?workspaceId=${workspaces[0].id}`;
        console.log("Redirecionando para:", redirectUrl);
        return redirect(redirectUrl);
      } else {
        // Fallback to workspace if homepage not found
        const redirectUrl = `/workspace/${workspaces[0].slug}`;
        console.log("Redirecionando para workspace:", redirectUrl);
        return redirect(redirectUrl);
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
