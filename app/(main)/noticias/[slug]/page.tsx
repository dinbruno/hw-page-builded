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
    // Para metadados, usar cache estático para evitar DYNAMIC_SERVER_USAGE
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_CORE_URL_PROD}/news/slug/${params.slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache estático para build - metadados podem ser gerados estaticamente
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidar a cada hora
    });

    if (!response.ok) {
      throw new Error(`Article not found: ${response.statusText}`);
    }

    const article = await response.json();

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
    // Para geração de parâmetros estáticos, usar cache estático
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_CORE_URL_PROD}/news`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache estático para build
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidar a cada hora
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const news = await response.json();

    return news
      .filter((article: any) => article.is_active && article.status === "published")
      .map((article: any) => ({
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
