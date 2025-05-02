import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import { PageRenderer } from "@/components/static-renderer/page-renderer";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const DynamicPageRenderer = dynamic(() => import("@/components/static-renderer/page-renderer").then((mod) => ({ default: mod.PageRenderer })), {
  ssr: false,
});

export default async function RootHandler() {
  console.log("_root-handler iniciado");

  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("x-tenant")?.value || cookieStore.get("tenantId")?.value;
  const workspaceId = cookieStore.get("workspaceId")?.value;

  console.log("Cookies encontrados:", {
    authToken: !!authToken,
    tenantId: !!tenantId,
    workspaceId: !!workspaceId,
  });

  if (!authToken || !tenantId) {
    console.log("Redirecionando para login por falta de credenciais");
    return redirect("/login");
  }

  try {
    console.log("Obtendo workspaces...");
    let currentWorkspaceId = workspaceId;

    if (!currentWorkspaceId) {
      const workspaces = await WorkspaceService.getWorkspaces();
      console.log("Workspaces obtidos:", workspaces?.length || 0);

      if (!workspaces || workspaces.length === 0) {
        console.log("Sem workspaces, redirecionando para onboarding");
        return redirect("/onboarding/welcome");
      }

      currentWorkspaceId = workspaces[0].id;
      console.log("Usando o primeiro workspace:", currentWorkspaceId);
    }

    console.log("Usando workspace:", currentWorkspaceId);

    try {
      console.log("Buscando páginas para o workspace:", currentWorkspaceId);
      const pages = await PageService.getAll(currentWorkspaceId, authToken, tenantId);
      console.log("Páginas obtidas:", pages?.length || 0);

      if (!pages || pages.length === 0) {
        console.log("Nenhuma página encontrada para o workspace");

        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Bem-vindo ao seu workspace</h1>
            <p className="text-lg mb-6">Você ainda não tem nenhuma página. Crie sua primeira página para começar.</p>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              onClick={() => (window.location.href = "/create-page")}
            >
              Criar Página
            </button>
          </div>
        );
      }

      console.log(
        "Páginas disponíveis:",
        pages.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))
      );

      const homePage =
        pages.find((page: any) => page.name === "Página Inicial" || page.name === "Home" || page.slug === "pagina-inicial" || page.slug === "home") ||
        pages[0];

      if (!homePage) {
        console.log("Nenhuma página inicial encontrada mesmo com páginas disponíveis");
        return notFound();
      }

      console.log("Página inicial encontrada:", homePage.id, homePage.name, homePage.slug);

      console.log("Buscando dados completos da página:", homePage.id);
      const pageData = await PageService.getById(homePage.id, currentWorkspaceId, authToken, tenantId);
      console.log("Dados da página obtidos:", !!pageData, pageData?.id);

      if (!pageData) {
        console.log("Dados da página não encontrados");
        return notFound();
      }

      if (!pageData.content) {
        console.log("A página não tem conteúdo");
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Página sem conteúdo</h1>
              <p>Esta página ainda não possui conteúdo para exibir.</p>
            </div>
          </div>
        );
      }

      cookies().set("workspaceId", currentWorkspaceId, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Renderizando página inicial");

      try {
        return <DynamicPageRenderer pageData={pageData} />;
      } catch (renderError) {
        console.error("Erro ao renderizar a página:", renderError);
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Erro ao carregar a página</h1>
              <p>Houve um problema ao renderizar esta página. Por favor, tente novamente mais tarde.</p>
            </div>
          </div>
        );
      }
    } catch (pageError) {
      console.error("Erro ao obter dados da página:", pageError);
      return notFound();
    }
  } catch (error) {
    console.error("Error in root handler:", error);
    return redirect("/login");
  }
}
