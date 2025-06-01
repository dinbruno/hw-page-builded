import { Metadata } from "next";
import { StaticNewsListPage } from "@/components/static-renderer/components";

export const metadata: Metadata = {
  title: "Notícias - Portal de Notícias",
  description: "Fique por dentro das últimas notícias e informações importantes.",
  openGraph: {
    title: "Notícias - Portal de Notícias",
    description: "Fique por dentro das últimas notícias e informações importantes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notícias - Portal de Notícias",
    description: "Fique por dentro das últimas notícias e informações importantes.",
  },
};

export default function NewsListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaticNewsListPage
        itemsPerPage={9}
        showSearch={true}
        showFilters={true}
        showSort={true}
        showPagination={true}
        columns={3}
        gap={32}
        cardStyle="card"
        backgroundColor="#ffffff"
        cardBackgroundColor="#ffffff"
        textColor="#374151"
        titleColor="#111827"
        accentColor="#3b82f6"
        borderColor="#e5e7eb"
        borderWidth={1}
        borderRadius={16}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        padding={{ top: 32, right: 32, bottom: 32, left: 32 }}
        showImage={true}
        showAuthor={true}
        showDate={true}
        showCategory={true}
        showStats={true}
        showExcerpt={true}
        title="Notícias"
        subtitle="Fique por dentro das últimas notícias e informações importantes."
        loadingText="Carregando notícias..."
        errorText="Erro ao carregar notícias. Tente novamente."
        emptyText="Nenhuma notícia encontrada"
        statusFilter="all"
      />
    </div>
  );
}
