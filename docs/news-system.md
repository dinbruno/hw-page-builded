# Sistema de Notícias Dinâmico

Este documento descreve o sistema de notícias dinâmico implementado que utiliza os serviços existentes para carregar dados de notícias baseado no slug da URL.

## Visão Geral

O sistema foi desenvolvido para fornecer páginas dinâmicas de notícias que se integram perfeitamente com o ecossistema atual de serviços. Ele inclui:

- **Componente Estático**: `StaticNewsArticleLayout` - Renderiza artigos de notícias com dados dinâmicos
- **Páginas Dinâmicas**: Rotas `/noticias` e `/noticias/[slug]`
- **Hooks Personalizados**: Para facilitar o uso dos serviços de notícias
- **Integração Completa**: Com os serviços existentes de News, NewsComments e NewsLikes

## Estrutura dos Arquivos

```
├── components/static-renderer/components/
│   ├── static-news-article-layout.tsx    # Componente principal
│   └── index.ts                          # Export do componente
├── app/(main)/noticias/
│   ├── page.tsx                          # Lista de notícias
│   └── [slug]/page.tsx                   # Página individual da notícia
├── hooks/
│   └── use-news.ts                       # Hooks personalizados
└── docs/
    └── news-system.md                    # Esta documentação
```

## 1. Componente StaticNewsArticleLayout

### Funcionalidades

- **Carregamento Dinâmico**: Detecta automaticamente o slug da URL
- **Integração com Serviços**: Usa NewsService, NewsCommentsService e NewsLikesService
- **Notícias Relacionadas**: Carrega e exibe notícias relacionadas automaticamente
- **Interações Sociais**: Sistema de curtidas e compartilhamento
- **Estados de Loading**: Indicadores visuais de carregamento e erro
- **Responsivo**: Layout adaptável para desktop e mobile

### Props Principais

```typescript
interface StaticNewsArticleLayoutProps {
  // Layout
  articleWidth?: number; // Largura do artigo (%)
  gap?: number; // Espaçamento entre colunas
  backgroundColor?: string; // Cor de fundo
  textColor?: string; // Cor do texto
  titleColor?: string; // Cor dos títulos
  accentColor?: string; // Cor de destaque

  // Notícias Relacionadas
  relatedNewsTitle?: string; // Título da seção
  showRelatedNews?: boolean; // Mostrar sidebar
  maxRelatedNews?: number; // Número máximo de notícias

  // Exibição
  showArticleImage?: boolean; // Mostrar imagem
  showArticleAuthor?: boolean; // Mostrar autor
  showArticleDate?: boolean; // Mostrar data
  showArticleStats?: boolean; // Mostrar estatísticas
  showSocialShare?: boolean; // Mostrar compartilhamento

  // Configurações
  customSlug?: string; // Override do slug
  loadingText?: string; // Texto de carregamento
  errorText?: string; // Texto de erro
}
```

### Como Usar

```tsx
import { StaticNewsArticleLayout } from "@/components/static-renderer/components";

export default function NewsPage({ params }: { params: { slug: string } }) {
  return <StaticNewsArticleLayout customSlug={params.slug} articleWidth={75} showRelatedNews={true} maxRelatedNews={5} />;
}
```

## 2. Páginas Dinâmicas

### Lista de Notícias (`/noticias`)

- **Funcionalidade**: Exibe todas as notícias publicadas
- **Ordenação**: Por data de publicação (mais recente primeiro)
- **Layout**: Grid responsivo de cards
- **Filtros**: Apenas notícias com status "published"
- **SEO**: Metadados otimizados

### Artigo Individual (`/noticias/[slug]`)

- **Funcionalidade**: Exibe notícia específica baseada no slug
- **Detecção de Slug**: Suporte para slug personalizado ou ID
- **Metadados Dinâmicos**: SEO otimizado por artigo
- **Geração Estática**: Paths pré-gerados para melhor performance
- **Fallback**: Página 404 para artigos não encontrados

### Metadados Dinâmicos

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await findArticleBySlug(params.slug);

  return {
    title: `${article.title} - Notícias`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      type: "article",
      publishedTime: article.published_at,
      images: [article.cover_image_id],
    },
  };
}
```

## 3. Hooks Personalizados

### useNews()

Hook para carregar lista de notícias:

```typescript
const { news, loading, error, loadNews, refreshNews } = useNews({
  autoLoad: true,
  filterStatus: "published",
});
```

### useNewsArticle()

Hook para carregar artigo específico:

```typescript
const { article, comments, likes, isLiked, toggleLike } = useNewsArticle({
  slug: "minha-noticia",
  loadComments: true,
  loadLikes: true,
});
```

### useNewsHelpers()

Hook com funções utilitárias:

```typescript
const { formatDate, formatRelativeDate, generateSlug, truncateText } = useNewsHelpers();
```

## 4. Integração com Serviços

### NewsService

- **getAll()**: Carrega todas as notícias
- **findBySlug()**: Busca notícia por slug ou ID
- **Filtering**: Por status (published, draft, archived)

### NewsCommentsService

- **getByNewsId()**: Carrega comentários da notícia
- **create()**: Adiciona novo comentário

### NewsLikesService

- **getByNewsId()**: Carrega curtidas da notícia
- **create()**: Adiciona nova curtida
- **delete()**: Remove curtida (a implementar)

## 5. Funcionalidades

### Carregamento Dinâmico

1. **Detecção de Slug**: O componente detecta automaticamente o slug da URL
2. **Fallback de Busca**: Tenta slug → ID → título formatado
3. **Cache Local**: Evita recarregamentos desnecessários

### Sistema de Curtidas

```typescript
const handleLike = async () => {
  if (isLiked) {
    // Remover curtida
    await NewsLikesService.delete(likeId);
  } else {
    // Adicionar curtida
    await NewsLikesService.create({
      news_id: article.id,
      collab_id: currentUserId,
    });
  }
};
```

### Compartilhamento Social

- **WhatsApp**: Compartilhamento direto
- **LinkedIn**: Link para sharing
- **Twitter**: Tweet com link
- **Clipboard**: Cópia do link

### Notícias Relacionadas

- **Algoritmo**: Exclui artigo atual, ordena por data
- **Limite**: Configurável via props
- **Layout**: Sidebar com preview das notícias

## 6. Configuração e Personalização

### Cores e Temas

```typescript
<StaticNewsArticleLayout backgroundColor="#ffffff" textColor="#374151" titleColor="#111827" accentColor="#3b82f6" borderColor="#e5e7eb" />
```

### Layout Responsivo

- **Desktop**: Layout em duas colunas (artigo + sidebar)
- **Mobile**: Layout em coluna única
- **Breakpoints**: Configuráveis via CSS

### Espaçamento

```typescript
<StaticNewsArticleLayout margin={{ top: 0, right: 0, bottom: 0, left: 0 }} padding={{ top: 32, right: 24, bottom: 32, left: 24 }} gap={40} />
```

## 7. SEO e Performance

### Otimizações SEO

- **Metadados Dinâmicos**: Title, description, og:tags
- **Schema Markup**: Artigos estruturados
- **URLs Amigáveis**: Slugs semânticos
- **Imagens**: Alt text e lazy loading

### Performance

- **Static Generation**: Paths pré-gerados
- **Parallel Loading**: Dados carregados em paralelo
- **Code Splitting**: Componentes lazy-loaded
- **Image Optimization**: Next.js Image component

## 8. Tratamento de Erros

### Estados de Erro

- **404**: Artigo não encontrado
- **Network**: Erro de conexão
- **Permission**: Sem permissão de acesso
- **Generic**: Erro genérico com retry

### Fallbacks

```typescript
// Estado de carregamento
if (loading) return <LoadingSpinner />;

// Estado de erro
if (error) return <ErrorMessage onRetry={handleRetry} />;

// Estado vazio
if (!article) return <NotFoundMessage />;
```

## 9. Exemplos de Uso

### Página Básica

```tsx
export default function NewsPage({ params }: { params: { slug: string } }) {
  return <StaticNewsArticleLayout customSlug={params.slug} />;
}
```

### Página Customizada

```tsx
export default function CustomNewsPage({ params }: { params: { slug: string } }) {
  return (
    <div className="custom-layout">
      <Header />
      <StaticNewsArticleLayout
        customSlug={params.slug}
        articleWidth={80}
        backgroundColor="#f9fafb"
        accentColor="#10b981"
        showRelatedNews={true}
        maxRelatedNews={3}
      />
      <Footer />
    </div>
  );
}
```

### Com Hook Customizado

```tsx
function NewsComponent({ slug }: { slug: string }) {
  const { article, loading, error } = useNewsArticle({ slug });
  const { formatDate } = useNewsHelpers();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <article>
      <h1>{article?.title}</h1>
      <p>{formatDate(article?.published_at || "")}</p>
      <div>{article?.content}</div>
    </article>
  );
}
```

## 10. Próximos Passos

### Melhorias Futuras

1. **Comentários**: Interface para adicionar/gerenciar comentários
2. **Paginação**: Para lista de notícias
3. **Busca**: Sistema de busca por título/conteúdo
4. **Categorias**: Filtro por categorias
5. **Cache**: Redis/Memcached para melhor performance
6. **Analytics**: Tracking de visualizações
7. **Newsletter**: Integração com sistema de newsletter

### Configurações Avançadas

1. **Multi-idioma**: Suporte i18n
2. **Temas**: Sistema de temas customizáveis
3. **PWA**: Progressive Web App features
4. **RSS**: Feed RSS automático
5. **AMP**: Páginas AMP para mobile

## Conclusão

O sistema de notícias dinâmico oferece uma solução completa e flexível para exibição de artigos, integrando-se perfeitamente com os serviços existentes e fornecendo uma experiência rica tanto para desenvolvedores quanto para usuários finais.

A arquitetura modular permite fácil customização e extensão, enquanto as otimizações de performance garantem uma experiência fluida mesmo com grandes volumes de dados.
