import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Page, PageRenderer } from "../../components/static-renderer/page-renderer";
import { PageService } from "../../services/page-constructor/page-constructor.service";
import { mockPages } from "../../services/mock";

// Configuração para build estática
export const dynamic = "force-static";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("slug", slug);

  // Se não houver slug, assumimos que é a página inicial
  const currentSlug = slug || "pagina-inicial";

  const workspaceId = process.env.NEXT_PUBLIC_WORKSPACE_ID || "4a1b7d73-7e51-47f5-9572-78d973f95c08";
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "2KXgoF4G6heP4SzudoRtcr7vUbM2";

  return (
    <Suspense fallback={<PageLoading />}>
      <PageContent slug={currentSlug} workspaceId={workspaceId} tenantId={tenantId} />
    </Suspense>
  );
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

  // Verificar se estamos durante a build estática
  const isBuildTime = process.env.NODE_ENV === "production" && typeof window === "undefined";

  if (isBuildTime) {
    console.log("Build estático, usando mock data para:", slug);
    // Durante o build, usar dados mockados
    pageData = mockPages.find((p) => p.slug === slug);

    if (!pageData) {
      console.log("Página mock não encontrada, usando fallback");
      pageData = mockPages[0]; // Usar a primeira página como fallback
    }

    return <PageRenderer pageData={pageData} />;
  }

  // Em runtime normal, acessar a API
  try {
    pageData = await PageService.getBySlug(slug, workspaceId);

    if (!pageData) {
      return notFound();
    }
  } catch (error) {
    console.error("Error loading page:", error);

    // Fallback para dados mockados em caso de erro
    pageData = mockPages.find((p) => p.slug === slug);

    if (!pageData) {
      return notFound();
    }
  }

  return <PageRenderer pageData={pageData} />;
}

export async function generateStaticParams() {
  // Sempre retorne as rotas estáticas conhecidas para evitar chamadas de API durante a build
  return [{ slug: "pagina-inicial" }, { slug: "teste" }];
}
