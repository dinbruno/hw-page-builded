import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import { mockPages, mockWorkspaces } from "@/services/mock";

// Para builds estáticos
export const dynamic = "force-static";

// This is an internal route handler for the root route (/)
// It's accessed via middleware rewrite, not directly by users
export default async function RootHandler() {
  // Verificar se estamos durante a build estática
  const isBuildTime = process.env.NODE_ENV === "production" && typeof window === "undefined";

  if (isBuildTime) {
    console.log("Build estático, usando mock data");
    // Durante a build, simplesmente redirecionar para a página inicial mock
    return redirect(`/pagina-inicial?workspaceId=${mockWorkspaces[0].id}`);
  }

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

      // Em ambiente de desenvolvimento, continuar com o fluxo normal
      console.log("Ambiente de desenvolvimento, continuando fluxo normal");
      console.log("Obtendo páginas para workspace:", workspace.id);

      const pages = await PageService.getAll(workspace.id);
      console.log("Páginas obtidas:", pages?.length || 0);

      const homePage = pages.find((page: any) => page.name === "Página Inicial");
      console.log("Página inicial encontrada:", homePage?.slug || "não encontrada");

      if (homePage) {
        // Redirect to the home page with workspaceId
        const redirectUrl = `/${homePage.slug}?workspaceId=${workspace.id}`;
        console.log("Redirecionando para:", redirectUrl);
        return redirect(redirectUrl);
      } else {
        // Fallback to workspace if homepage not found
        const redirectUrl = `/workspace/${workspace.slug}`;
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
