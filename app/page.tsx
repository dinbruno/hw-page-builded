import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import dynamic from "next/dynamic";
import { setWorkspaceIdCookie } from "./actions/cookie-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página Inicial",
  description: "Bem-vindo ao seu workspace. Gerencie suas páginas e conteúdo aqui.",
  openGraph: {
    title: "Página Inicial",
    description: "Bem-vindo ao seu workspace. Gerencie suas páginas e conteúdo aqui.",
    type: "website",
  },
};

const DynamicPageRenderer = dynamic(() => import("@/components/static-renderer/page-renderer").then((mod) => ({ default: mod.PageRenderer })), {
  ssr: false,
});

export default async function Home() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("x-tenant")?.value || cookieStore.get("tenantId")?.value;
  const workspaceId = cookieStore.get("workspaceId")?.value;

  if (!authToken || !tenantId) {
    return redirect("/login");
  }

  try {
    let currentWorkspaceId = workspaceId;

    if (!currentWorkspaceId) {
      const workspaces = await WorkspaceService.getWorkspaces();

      if (!workspaces || workspaces.length === 0) {
        return redirect("/onboarding/welcome");
      }

      currentWorkspaceId = workspaces[0].id;

      setWorkspaceIdCookie(currentWorkspaceId).catch((err) => console.error("Erro ao definir cookie workspaceId:", err));
    }

    const pages = await PageService.getAll(currentWorkspaceId, authToken, tenantId);

    if (!pages || pages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao seu workspace</h1>
          <p className="text-lg mb-6">Você ainda não tem nenhuma página. Crie sua primeira página para começar.</p>
        </div>
      );
    }

    const homePage =
      pages.find((page) => page.name === "Página Inicial" || page.name === "Home" || page.slug === "pagina-inicial" || page.slug === "home") ||
      pages[0];

    const pageData = await PageService.getById(homePage.id, currentWorkspaceId, authToken, tenantId);

    if (!pageData) {
      return notFound();
    }

    return <DynamicPageRenderer pageData={pageData} />;
  } catch (error) {
    console.error("Erro ao carregar a página inicial:", error);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar a página</h1>
          <p>Houve um problema ao carregar a página inicial. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }
}
