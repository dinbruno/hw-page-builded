import { Suspense } from "react";
import { PageService } from "../../services/page-constructor/page-constructor.service";
import { PageRenderer } from "../../components/static-renderer/page-renderer";

export default async function StaticRendererPage({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { pageId?: string; workspaceId?: string };
}) {
  const { pageId, workspaceId } = searchParams;

  if (!pageId || !workspaceId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Missing Parameters</h1>
          <p>Please provide both pageId and workspaceId as query parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <PageContent pageId={pageId} workspaceId={workspaceId} />
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

async function PageContent({ pageId, workspaceId }: { pageId: string; workspaceId: string }) {
  let pageData;

  try {
    pageData = await PageService.getById(pageId, workspaceId);
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
          <p>Could not load the requested page. Please check the pageId and workspaceId.</p>
        </div>
      </div>
    );
  }

  return <PageRenderer pageData={pageData} />;
}
