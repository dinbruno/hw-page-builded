import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageRenderer } from "../../components/static-renderer/page-renderer";
import { PageService } from "../../services/page-constructor/page-constructor.service";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

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
  let pageData;

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
  const workspaceId = process.env.NEXT_PUBLIC_WORKSPACE_ID || "4a1b7d73-7e51-47f5-9572-78d973f95c08";

  try {
    const pages = await PageService.getAll(workspaceId);
    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
