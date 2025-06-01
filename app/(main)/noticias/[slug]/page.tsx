import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsService } from "@/services/news";
import { StaticNewsArticleLayout } from "@/components/static-renderer/components";

interface PageProps {
  params: {
    slug: string;
  };
}

// Função para gerar metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const newsData = await NewsService.getAll();
    const article = newsData.find((news) => news.slug === params.slug || news.title.toLowerCase().replace(/\s+/g, "-") === params.slug);

    if (!article) {
      return {
        title: "Notícia não encontrada",
        description: "A notícia solicitada não foi encontrada.",
      };
    }

    return {
      title: `${article.title} - Notícias`,
      description: article.subtitle || article.content?.substring(0, 160) + "...",
      openGraph: {
        title: article.title,
        description: article.subtitle || article.content?.substring(0, 160) + "...",
        type: "article",
        publishedTime: article.published_at,
        authors: ["Autor"], // Usar dados reais quando disponível
        images: article.cover_image_id ? [`/api/files/${article.cover_image_id}`] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.subtitle || article.content?.substring(0, 160) + "...",
        images: article.cover_image_id ? [`/api/files/${article.cover_image_id}`] : [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar metadados da notícia:", error);
    return {
      title: "Erro ao carregar notícia",
      description: "Ocorreu um erro ao carregar a notícia.",
    };
  }
}

// Função para gerar caminhos estáticos (opcional para melhor performance)
export async function generateStaticParams() {
  try {
    // Durante o build, pode não haver token de usuário disponível
    // Neste caso, retornamos uma lista vazia para evitar erro no build
    const newsData = await NewsService.getAll();

    return newsData
      .filter((news) => news.status === "published") // Apenas notícias publicadas
      .map((news) => ({
        slug: news.slug || news.id,
      }));
  } catch (error) {
    console.error("Erro ao gerar caminhos estáticos:", error);
    // Retornar lista vazia em caso de erro para não quebrar o build
    // As páginas serão geradas sob demanda (ISR)
    return [];
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Componente que carrega os dados dinamicamente */}
      <StaticNewsArticleLayout
        customSlug={params.slug}
        // Configurações padrão - podem ser customizadas
        articleWidth={75}
        gap={40}
        backgroundColor="#ffffff"
        textColor="#374151"
        titleColor="#111827"
        accentColor="#3b82f6"
        borderColor="#e5e7eb"
        relatedNewsTitle="Notícias Relacionadas"
        showRelatedNews={true}
        maxRelatedNews={5}
        showArticleImage={true}
        showArticleAuthor={true}
        showArticleDate={true}
        showArticleCategory={true}
        showArticleTags={true}
        showArticleStats={true}
        showSocialShare={true}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        padding={{ top: 32, right: 24, bottom: 32, left: 24 }}
      />
    </div>
  );
}
