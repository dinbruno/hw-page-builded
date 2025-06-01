import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { NewsService } from "@/services/news";
import { Calendar, User, Eye, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Notícias - Portal de Informações",
  description: "Fique por dentro das últimas notícias e informações importantes.",
  openGraph: {
    title: "Notícias - Portal de Informações",
    description: "Fique por dentro das últimas notícias e informações importantes.",
    type: "website",
  },
};

// Função para formatar data
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Data não disponível";
  }
}

export default async function NewsListPage() {
  let newsData: any[] = [];
  let error: string | null = null;

  try {
    const allNews = await NewsService.getAll();
    // Filtrar apenas notícias publicadas e ordenar por data
    newsData = allNews
      .filter((news) => news.status === "published")
      .sort((a, b) => {
        const dateA = new Date(a.published_at || a.createdAt);
        const dateB = new Date(b.published_at || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Erro ao carregar notícias:", err);
    error = "Erro ao carregar as notícias. Tente novamente mais tarde.";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notícias</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Fique por dentro das últimas notícias e informações importantes do nosso portal.</p>
        </div>

        {/* Conteúdo */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : newsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhuma notícia publicada no momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((news) => (
              <Link
                key={news.id}
                href={`/noticias/${news.slug || news.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Imagem da Notícia */}
                {news.cover_image_id ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={`/api/files/${news.cover_image_id}`}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-lg font-semibold mb-2">Notícia</h3>
                      <p className="text-sm opacity-90">Sem imagem</p>
                    </div>
                  </div>
                )}

                {/* Conteúdo do Card */}
                <div className="p-6">
                  {/* Categoria */}
                  <div className="flex items-center mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Notícias</span>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{news.title}</h2>

                  {/* Subtítulo/Excerpt */}
                  {news.subtitle && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.subtitle}</p>}

                  {/* Metadados */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>Autor</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(news.published_at || news.createdAt)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Status: {news.status === "published" ? "Publicado" : "Rascunho"}</span>
                      <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">Ler mais →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Paginação (futuro) */}
        {newsData.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Mostrando {newsData.length} notícia{newsData.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
