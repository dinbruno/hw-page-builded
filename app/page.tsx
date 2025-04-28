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

// Dynamic import with no SSR to prevent hydration issues
const DynamicPageRenderer = dynamic(() => import("@/components/static-renderer/page-renderer").then((mod) => ({ default: mod.PageRenderer })), {
  ssr: false,
});

// Página principal que mostra diretamente a página inicial
export default async function Home() {
  // Verificar cookies para garantir autenticação
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("x-tenant")?.value || cookieStore.get("tenantId")?.value;
  const workspaceId = cookieStore.get("workspaceId")?.value;

  if (!authToken || !tenantId) {
    return redirect("/login");
  }

  try {
    // Se já temos o workspaceId nos cookies, usamos ele
    let currentWorkspaceId = workspaceId;

    if (!currentWorkspaceId) {
      // Se não temos workspaceId, buscamos os workspaces do usuário
      const workspaces = await WorkspaceService.getWorkspaces();

      if (!workspaces || workspaces.length === 0) {
        return redirect("/onboarding/welcome");
      }

      // Usar o primeiro workspace
      currentWorkspaceId = workspaces[0].id;

      // Definir o cookie usando Server Action
      // Nota: continuamos e confiamos que o cookie será definido para futuras requisições
      setWorkspaceIdCookie(currentWorkspaceId).catch((err) => console.error("Erro ao definir cookie workspaceId:", err));
    }

    // Buscar todas as páginas do workspace
    const pages = await PageService.getAll(currentWorkspaceId, authToken, tenantId);

    if (!pages || pages.length === 0) {
      // Se não houver páginas, mostrar página de boas-vindas
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao seu workspace</h1>
          <p className="text-lg mb-6">Você ainda não tem nenhuma página. Crie sua primeira página para começar.</p>
        </div>
      );
    }

    // Encontrar a página inicial ou usar a primeira disponível
    const homePage =
      pages.find((page) => page.name === "Página Inicial" || page.name === "Home" || page.slug === "pagina-inicial" || page.slug === "home") ||
      pages[0];

    // Obter dados completos da página
    const pageData = await PageService.getById(homePage.id, currentWorkspaceId, authToken, tenantId);

    if (!pageData) {
      return notFound();
    }

    // Renderizar a página inicial
    return <DynamicPageRenderer pageData={pageData} />;
  } catch (error) {
    console.error("Erro ao carregar a página inicial:", error);

    // Mostrar página de erro em caso de falha
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
