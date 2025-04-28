import { notFound } from "next/navigation";
import { PageService, type Page } from "../../services/page-constructor/page-constructor.service";
import { PageRenderer } from "../../components/static-renderer/page-renderer";
import { cookies } from "next/headers";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const tenantId = cookieStore.get("x-tenant")?.value;
  const workspaceId = cookieStore.get("workspaceId")?.value;

  if (!authToken || !tenantId || !workspaceId) {
    return {
      title: "Página não encontrada",
      description: "A página que você está procurando não existe ou não está disponível.",
    };
  }

  try {
    const pageData = await PageService.getBySlug(slug, workspaceId, authToken, tenantId);

    if (!pageData) {
      return {
        title: "Página não encontrada",
        description: "A página que você está procurando não existe ou não está disponível.",
      };
    }

    return {
      title: pageData.name,
      description: `Conteúdo da página ${pageData.name}`,
      openGraph: {
        title: pageData.name,
        description: `Conteúdo da página ${pageData.name}`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Erro",
      description: "Ocorreu um erro ao carregar a página.",
    };
  }
}

export default async function SlugPage({ params }: Props) {
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
