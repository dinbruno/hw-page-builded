import { Metadata } from "next";
import { NewsService } from "@/services/news/news.service";
import { NewsArticlePageClient } from "./news-article-client";
import { AuthProvider } from "@/contexts/auth-context";

interface PageProps {
  params: { slug: string };
  searchParams?: { workspaceId?: string };
}

// Função para gerar metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const article = await NewsService.getBySlug(params.slug);

    return {
      title: article.title,
      description: article.subtitle || `Leia o artigo completo: ${article.title}`,
      openGraph: {
        title: article.title,
        description: article.subtitle || `Leia o artigo completo: ${article.title}`,
        images: article.cover_image?.url ? [article.cover_image.url] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.subtitle || `Leia o artigo completo: ${article.title}`,
        images: article.cover_image?.url ? [article.cover_image.url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Notícia não encontrada",
      description: "A notícia solicitada não foi encontrada",
    };
  }
}

// Função para gerar caminhos estáticos (opcional para melhor performance)
export async function generateStaticParams() {
  try {
    const news = await NewsService.getAll();
    return news
      .filter((article) => article.is_active && article.status === "published")
      .map((article) => ({
        slug: article.slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default function NewsArticlePage({ params, searchParams }: PageProps) {
  const workspaceId = searchParams?.workspaceId;

  return (
    <AuthProvider initialWorkspaceId={workspaceId}>
      <NewsArticlePageClient slug={params.slug} workspaceId={workspaceId} />
    </AuthProvider>
  );
}
