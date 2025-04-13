import { notFound } from "next/navigation";
import { PageService, type Page } from "../../services/page-constructor/page-constructor.service";
import { PageRenderer } from "../../components/static-renderer/page-renderer";
import { cookies } from "next/headers";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const workspaceIdFromUrl = searchParams.get("workspaceId");

  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("tenantId")?.value;

  // Se não há token ou tenantId, retorna página não encontrada (será redirecionado pelo middleware)
  if (!authToken || !tenantId) {
    return notFound();
  }

  try {
    let workspaceId = workspaceIdFromUrl || "";

    // Se não temos workspaceId, devemos mostrar página de carregamento
    // O middleware vai redirecionar para a página correta
    if (!workspaceId) {
      return <PageLoading />;
    }

    return <PageContent slug={slug} workspaceId={workspaceId} tenantId={tenantId} />;
  } catch (error) {
    console.error("Error in SlugPage:", error);
    return notFound();
  }
}

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

async function PageContent({ slug, workspaceId, tenantId }: { slug: string; workspaceId: string; tenantId: string }) {
  let pageData: Page | any = null;

  try {
    pageData = await PageService.getBySlug(slug, workspaceId);

    if (!pageData) {
      return notFound();
    }
  } catch (error) {
    console.error("Error loading page:", error);
    return notFound();
  }

  return <PageRenderer pageData={pageData} />;
}

export async function generateStaticParams() {
  // Retornar parâmetros vazios para evitar pré-renderização estática
  return [];
}
