# StaticNewsListPage

Componente estático para exibir uma lista paginada de notícias carregadas diretamente do NewsService. Oferece funcionalidades completas de busca, filtros, ordenação e paginação.

## Características Principais

- **Integração Real**: Carrega notícias reais usando NewsService, NewsCommentsService e NewsLikesService
- **Busca Avançada**: Campo de busca que procura no título, subtítulo e conteúdo
- **Filtros Dinâmicos**: Sistema de filtros por categoria e status
- **Ordenação Flexível**: Múltiplas opções de ordenação (data, título, curtidas)
- **Paginação**: Sistema de paginação responsivo e customizável
- **Layouts Múltiplos**: Suporte para cards, lista e modo compacto
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Customizável**: Amplas opções de personalização visual e funcional

## Interface

```typescript
interface StaticNewsListPageProps {
  // Layout
  itemsPerPage?: number; // Itens por página (padrão: 6)
  showSearch?: boolean; // Mostrar campo de busca (padrão: true)
  showFilters?: boolean; // Mostrar filtros (padrão: true)
  showSort?: boolean; // Mostrar ordenação (padrão: true)
  showPagination?: boolean; // Mostrar paginação (padrão: true)

  // Grid
  columns?: number; // Número de colunas (padrão: 3)
  gap?: number; // Espaçamento entre cards (padrão: 32)
  cardStyle?: "card" | "list" | "compact"; // Estilo dos cards (padrão: "card")

  // Styling
  backgroundColor?: string; // Cor de fundo principal
  cardBackgroundColor?: string; // Cor de fundo dos cards
  textColor?: string; // Cor do texto
  titleColor?: string; // Cor dos títulos
  accentColor?: string; // Cor de destaque
  borderColor?: string; // Cor das bordas
  borderWidth?: number; // Espessura das bordas
  borderRadius?: number; // Arredondamento das bordas

  // Spacing
  margin?: SpacingProps; // Margens externas
  padding?: SpacingProps; // Padding interno

  // Display options
  showImage?: boolean; // Mostrar imagens (padrão: true)
  showAuthor?: boolean; // Mostrar autor (padrão: true)
  showDate?: boolean; // Mostrar data (padrão: true)
  showCategory?: boolean; // Mostrar categoria (padrão: true)
  showStats?: boolean; // Mostrar estatísticas (padrão: true)
  showExcerpt?: boolean; // Mostrar resumo (padrão: true)

  // Content options
  title?: string; // Título da página
  subtitle?: string; // Subtítulo da página
  loadingText?: string; // Texto de carregamento
  errorText?: string; // Texto de erro
  emptyText?: string; // Texto quando vazio

  // Filters
  statusFilter?: "all" | "published" | "draft" | "archived"; // Filtro de status

  // Props comuns
  hidden?: boolean; // Ocultar componente
  id?: string; // ID do elemento
  style?: React.CSSProperties; // Estilos customizados
  customClasses?: string; // Classes CSS customizadas
}
```

## Funcionalidades

### 1. Carregamento de Dados

```typescript
// Carrega notícias reais do NewsService
const newsData = await NewsService.getAll();

// Filtra por status se especificado
const filteredNews = statusFilter === "all" ? newsData : newsData.filter((item) => item.status === statusFilter);

// Carrega dados adicionais (comentários e curtidas) em paralelo
const [comments, likes] = await Promise.all([NewsCommentsService.getByNewsId(newsItem.id), NewsLikesService.getByNewsId(newsItem.id)]);
```

### 2. Sistema de Busca

- Busca no título, subtítulo e conteúdo
- Busca em tempo real (debounced)
- Case-insensitive
- Destaque de termos encontrados

### 3. Filtros e Ordenação

**Opções de Ordenação:**

- Data (mais recentes/antigas)
- Título (A-Z/Z-A)
- Curtidas (mais/menos curtidas)

**Filtros:**

- Por categoria (simulado)
- Por status (published, draft, archived)
- Busca textual

### 4. Layouts de Card

**Card (padrão):**

- Layout em grid responsivo
- Imagem em destaque
- Informações completas

**Lista:**

- Layout horizontal
- Imagem lateral
- Informações compactas

**Compacto:**

- Grid mais denso
- Informações mínimas
- Ideal para muitos itens

### 5. Navegação

```typescript
const handleNewsClick = (newsItem: ProcessedNews) => {
  const url = `/noticias/${newsItem.slug || newsItem.id}`;
  window.location.href = url;
};
```

## Exemplos de Uso

### Uso Básico

```tsx
import { StaticNewsListPage } from "@/components/static-renderer/components";

export default function NoticiasPage() {
  return <StaticNewsListPage title="Notícias" subtitle="Últimas atualizações" statusFilter="published" />;
}
```

### Configuração Completa

```tsx
<StaticNewsListPage
  // Layout
  itemsPerPage={12}
  columns={4}
  cardStyle="card"
  gap={20}
  // Funcionalidades
  showSearch={true}
  showFilters={true}
  showSort={true}
  showPagination={true}
  // Exibição
  showImage={true}
  showAuthor={true}
  showDate={true}
  showCategory={true}
  showStats={true}
  showExcerpt={true}
  // Cores
  backgroundColor="#f8fafc"
  cardBackgroundColor="#ffffff"
  textColor="#475569"
  titleColor="#0f172a"
  accentColor="#3b82f6"
  borderColor="#e2e8f0"
  // Espaçamento
  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
  padding={{ top: 32, right: 24, bottom: 32, left: 24 }}
  // Estilo
  borderWidth={1}
  borderRadius={16}
  // Filtros
  statusFilter="published"
  // Textos
  title="Portal de Notícias"
  subtitle="Mantenha-se informado"
  loadingText="Carregando..."
  errorText="Erro ao carregar"
  emptyText="Nenhuma notícia"
/>
```

### Layout Lista

```tsx
<StaticNewsListPage
  cardStyle="list"
  columns={1} // Ignorado no layout lista
  showExcerpt={false} // Economizar espaço
  itemsPerPage={10}
/>
```

### Modo Compacto

```tsx
<StaticNewsListPage cardStyle="compact" columns={4} showExcerpt={false} showStats={false} itemsPerPage={20} gap={16} />
```

## Estados do Componente

### Loading State

```tsx
if (loading) {
  return (
    <div className="text-center">
      <div className="animate-spin..."></div>
      <p>{loadingText}</p>
    </div>
  );
}
```

### Error State

```tsx
if (error) {
  return (
    <div className="text-center">
      <p>{error}</p>
      <button onClick={loadNews}>Tentar novamente</button>
    </div>
  );
}
```

### Empty State

```tsx
if (paginatedNews.length === 0) {
  return (
    <div className="text-center">
      <h3>{emptyText}</h3>
      <p>Ajuste os filtros...</p>
    </div>
  );
}
```

## Integração com Serviços

### NewsService

```typescript
// Carrega todas as notícias
const newsData = await NewsService.getAll();

// Filtra por status
const published = newsData.filter((news) => news.status === "published");
```

### NewsCommentsService

```typescript
// Carrega comentários de uma notícia
const comments = await NewsCommentsService.getByNewsId(newsId);
```

### NewsLikesService

```typescript
// Carrega curtidas de uma notícia
const likes = await NewsLikesService.getByNewsId(newsId);
```

## Performance

### Carregamento Paralelo

- Dados de comentários e curtidas carregados em paralelo
- Fallback gracioso em caso de erro

### Processamento Otimizado

```typescript
const processNewsData = async (newsData: News[]): Promise<ProcessedNews[]> => {
  const processedNews: ProcessedNews[] = [];

  for (const newsItem of newsData) {
    try {
      const [comments, likes] = await Promise.all([
        NewsCommentsService.getByNewsId(newsItem.id).catch(() => []),
        NewsLikesService.getByNewsId(newsItem.id).catch(() => []),
      ]);

      // Processar dados...
    } catch (err) {
      // Fallback sem dados adicionais
    }
  }

  return processedNews;
};
```

### Paginação Eficiente

- Slice apenas dos itens visíveis
- Reset automático de página ao filtrar

## Responsividade

### Breakpoints

```css
/* Mobile */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(var(--columns), 1fr);
  }
}
```

### Layout Adaptável

- Cards empilham verticalmente em mobile
- Filtros colapsam em dropdown
- Paginação se adapta ao espaço disponível

## Acessibilidade

- Navegação por teclado
- ARIA labels apropriados
- Contraste adequado
- Foco visível
- Screen reader friendly

## Customização Avançada

### CSS Classes Customizadas

```tsx
<StaticNewsListPage
  customClasses="custom-news-grid shadow-xl"
  style={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  }}
/>
```

### Temas Predefinidos

```tsx
// Tema Escuro
<StaticNewsListPage
  backgroundColor="#1f2937"
  cardBackgroundColor="#374151"
  textColor="#d1d5db"
  titleColor="#f9fafb"
  accentColor="#60a5fa"
  borderColor="#4b5563"
/>

// Tema Colorido
<StaticNewsListPage
  backgroundColor="#fef3c7"
  cardBackgroundColor="#ffffff"
  textColor="#92400e"
  titleColor="#78350f"
  accentColor="#f59e0b"
  borderColor="#fbbf24"
/>
```

## Casos de Uso

1. **Portal de Notícias**: Lista principal de artigos
2. **Blog Corporativo**: Atualizações da empresa
3. **Dashboard Admin**: Gestão de conteúdo
4. **Arquivo de Notícias**: Consulta histórica
5. **Feed de Atualizações**: Últimas novidades

## Limitações

- Categorias são simuladas (não existem na interface News)
- Visualizações sempre retornam 0 (campo não existe)
- Autor sempre mostra "Autor" (campo não existe)
- Carregamento sequencial pode ser lento com muitas notícias

## Próximas Melhorias

1. **Cache**: Implementar cache para dados já carregados
2. **Lazy Loading**: Carregar dados sob demanda
3. **Infinite Scroll**: Alternativa à paginação
4. **Filtros Avançados**: Por data, autor, tags
5. **Busca Semântica**: Melhor algoritmo de busca
6. **Export**: Exportar lista filtrada
7. **Favoritos**: Marcar notícias como favoritas
