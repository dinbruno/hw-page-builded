import { Metadata } from "next";
import { StaticNewsListPage } from "@/components/static-renderer/components";

export const metadata: Metadata = {
  title: "Lista de Notícias - Exemplo",
  description: "Exemplo de uso do componente StaticNewsListPage com dados reais.",
  openGraph: {
    title: "Lista de Notícias - Exemplo",
    description: "Exemplo de uso do componente StaticNewsListPage com dados reais.",
    type: "website",
  },
};

export default function ExemploNoticiasListaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaticNewsListPage
        // Configurações básicas
        title="Portal de Notícias"
        subtitle="Fique sempre atualizado com as últimas informações e novidades."
        // Layout
        itemsPerPage={9}
        columns={3}
        cardStyle="card"
        gap={24}
        // Funcionalidades
        showSearch={true}
        showFilters={true}
        showSort={true}
        showPagination={true}
        // Exibição dos cards
        showImage={true}
        showAuthor={true}
        showDate={true}
        showCategory={true}
        showStats={true}
        showExcerpt={true}
        // Cores personalizadas
        backgroundColor="#f9fafb"
        cardBackgroundColor="#ffffff"
        textColor="#374151"
        titleColor="#111827"
        accentColor="#2563eb"
        borderColor="#e5e7eb"
        // Espaçamento
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        padding={{ top: 40, right: 32, bottom: 40, left: 32 }}
        // Estilo das bordas
        borderWidth={1}
        borderRadius={12}
        // Filtro de status (apenas notícias publicadas)
        statusFilter="published"
        // Textos customizados
        loadingText="Carregando suas notícias..."
        errorText="Ops! Não foi possível carregar as notícias."
        emptyText="Nenhuma notícia encontrada"
      />
    </div>
  );
}
