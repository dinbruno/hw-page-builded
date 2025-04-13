import { notFound } from "next/navigation";
import { PageService, type Page } from "../../services/page-constructor/page-constructor.service";
import { PageRenderer } from "../../components/static-renderer/page-renderer";
import { cookies } from "next/headers";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("x-tenant")?.value;
  const workspaceId = cookieStore.get("workspaceId")?.value;

  if (!authToken || !tenantId) {
    return notFound();
  }

  try {
    if (!workspaceId) {
      return <PageLoading />;
    }

    const pageData = await PageService.getBySlug(slug, workspaceId, authToken, tenantId);

    if (!pageData) {
      return notFound();
    }

    return <PageRenderer pageData={pageData} />;
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
