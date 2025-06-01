This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sistema Multi-Tenant com Subdomínios por Tenant

Este projeto implementa uma arquitetura multi-tenant onde cada tenant possui seu próprio subdomínio personalizado utilizando domínios Vercel.

### Funcionamento

1. O domínio principal do projeto serve como ponto de entrada e gerenciador de tenants
2. Quando um usuário faz login, o sistema registra um subdomínio específico baseado no nome do workspace e ID do tenant
3. O usuário é então redirecionado para seu subdomínio específico no formato `nome-workspace-id.projeto.vercel.app`
4. Cada tenant navega em seu próprio subdomínio, mantendo a separação visual entre tenants

### Configuração

Para configurar o sistema, defina as seguintes variáveis de ambiente:

```
# Domínio base para os subdomínios (geralmente vercel.app)
NEXT_PUBLIC_BASE_DOMAIN=vercel.app

# Nome do projeto na Vercel
NEXT_PUBLIC_VERCEL_PROJECT_NAME=seu-projeto
```

### Formato dos Subdomínios

Os subdomínios são gerados automaticamente seguindo o padrão:

```
{nome-workspace-normalizado}-{8-primeiros-caracteres-do-tenant-id}.{nome-do-projeto}.vercel.app
```

Por exemplo:

```
meu-workspace-12345678.hw-page-builded.vercel.app
```

### Desenvolvimento Local

Para desenvolvimento local, o sistema funciona sem redirecionar para subdomínios. É possível testar diferentes tenants alterando as variáveis de ambiente:

```
NEXT_PUBLIC_TENANT_ID=tenant-id-para-teste
NEXT_PUBLIC_WORKSPACE_ID=workspace-id-para-teste
```

### Persistência dos Subdomínios

Atualmente, os subdomínios são armazenados em memória. Em um ambiente de produção, você deve implementar:

1. Armazenamento em banco de dados para os subdomínios registrados
2. Mecanismo de sincronização para garantir consistência entre múltiplas instâncias

# Sistema Dinâmico de Comentários e Curtidas

## 🚀 Novo Sistema de Comentários Integrado

O `StaticCommentsSection` agora possui integração completa com API real, permitindo comentários e curtidas dinâmicos.

### ✨ Principais Funcionalidades

#### **API Integration**

- **Comentários Dinâmicos**: Carrega comentários reais da API usando `NewsCommentsService`
- **Curtidas Dinâmicas**: Sistema de likes integrado com `NewsLikesService`
- **Criação de Comentários**: Permite enviar novos comentários para a API
- **Toggle de Curtidas**: Curtir/descurtir posts em tempo real

#### **Funcionalidades Avançadas**

- **Loading States**: Estados de carregamento para comentários e curtidas
- **Error Handling**: Fallback gracioso para dados offline
- **Real-time Updates**: Atualização automática após ações
- **Character Count**: Contador de caracteres configurável
- **Avatar Shapes**: Suporte para avatares circulares ou quadrados

### 📋 Como Usar

#### **Uso Básico com API (Recomendado)**

```tsx
<StaticCommentsSection
  // API Integration - Dados dinâmicos
  newsSlug="minha-noticia"
  workspaceId="workspace-123"
  currentUserId="user-456"
  // Configuração
  title="Comentários"
  showStats={true}
  allowComments={true}
  // Estilo
  accentColor="#3b82f6"
  backgroundColor="#ffffff"
  borderRadius={16}
/>
```

#### **Uso Legacy (Compatibilidade)**

```tsx
<StaticCommentsSection
  title="Comentários"
  showLikeCounter={true}
  showViewCounter={true}
  likeCount={50}
  viewCount={200}
  comments={[...]}
  allowComments={true}
/>
```

### 🔧 Props da API

| Prop            | Tipo      | Descrição                                    |
| --------------- | --------- | -------------------------------------------- |
| `newsSlug`      | `string`  | Slug da notícia para buscar dados da API     |
| `workspaceId`   | `string?` | ID do workspace (opcional)                   |
| `currentUserId` | `string?` | ID do usuário atual (para comentários/likes) |

### 📊 Estatísticas Dinâmicas

Quando `newsSlug` é fornecido:

- ✅ **Curtidas**: Carregadas da API em tempo real
- ✅ **Comentários**: Carregados da API com filtro por ativos
- ✅ **Visualizações**: Suporte para dados da API (fallback configurável)

### 🎨 Personalização Avançada

```tsx
<StaticCommentsSection
  newsSlug="exemplo"
  currentUserId="user-123"
  // Comportamento
  enableCharacterCount={true}
  maxCharacters={280}
  allowComments={true}
  // Visual
  avatarShape="circle" // ou "square"
  commentBackgroundColor="#f9fafb"
  accentColor="#3b82f6"
  // Layout
  maxWidth={800}
  padding={24}
  borderRadius={16}
/>
```

### 🔄 Estados de Loading

O componente mostra automaticamente:

- 🔄 **Loading de Comentários**: "Carregando comentários..."
- 🔄 **Loading de Curtidas**: Contador mostra "..."
- 🔄 **Enviando Comentário**: "Enviando..." no botão
- 🔄 **Toggle Like**: Botão desabilitado durante ação

### 🛡️ Error Handling

- **Fallback Gracioso**: Em caso de erro da API, usa dados padrão
- **Comentários Offline**: Cria comentários locais quando API falha
- **Estados Visuais**: Feedback claro para erros e loading

### 📱 Responsividade

- **Mobile-First**: Design responsivo para todos os dispositivos
- **Touch-Friendly**: Botões otimizados para toque
- **Adaptive Layout**: Layout se adapta ao conteúdo

### 🎯 Migração Automática

O componente detecta automaticamente:

- Se `newsSlug` está presente → Usa dados da API
- Se props legacy estão presentes → Usa dados estáticos
- **Zero Breaking Changes**: Funciona com código existente

---

## 🔗 Integração na Página de Notícias

O sistema já está integrado na página `/noticias/[slug]`:

```tsx
// app/(main)/noticias/[slug]/news-article-client.tsx
<StaticCommentsSection
  newsSlug={slug}
  currentUserId="current-user-id"
  showStats={true}
  allowComments={true}
  // ... configurações de estilo
/>
```

### 🚀 Próximos Passos

1. **Autenticação**: Integrar com sistema de auth para `currentUserId`
2. **Notificações**: Adicionar notificações de novos comentários
3. **Moderação**: Sistema de moderação de comentários
4. **Likes em Comentários**: Implementar likes individuais por comentário

---

_Sistema atualizado para versão 2.0 com API integration completa! 🎉_

---

# 🔐 Sistema de Autenticação Integrado

## 🚀 Nova Arquitetura de Autenticação

O sistema agora possui autenticação completa integrada com dados de colaboradores (collabs) da API.

### ✨ Principais Funcionalidades

#### **🔗 Integração Firebase + API**

- **Firebase Auth**: Autenticação via Firebase (ID ref auth)
- **CollabsService**: Busca dados completos do colaborador via `${API_URL}/collabs/auth/${idRefAuth}`
- **Context Global**: Estado de autenticação gerenciado globalmente
- **Permissões**: Sistema de permissões baseado em níveis de acesso

#### **👤 Dados do Usuário Completos**

- **Perfil Completo**: Nome, email, avatar, posição, departamento
- **Permissões**: Lista de permissões baseada no access_level
- **Workspace**: Integração com workspace_id
- **Status**: Verificação de usuário ativo

### 📋 Como Usar o Sistema de Auth

#### **Configuração do Provider**

```tsx
// app/layout.tsx ou page específica
import { AuthProvider } from "@/contexts/auth-context";

export default function Layout({ children }) {
  return <AuthProvider initialWorkspaceId="workspace-123">{children}</AuthProvider>;
}
```

#### **Usando Hooks de Autenticação**

```tsx
import { useCurrentUser, useAuth, usePermission } from "@/contexts/auth-context";

function MyComponent() {
  // Hook principal para dados do usuário
  const {
    user, // Dados completos do Firebase + Collab
    profile, // Perfil formatado para UI
    isLoading, // Estado de carregamento
    isAuthenticated, // Se está autenticado e ativo
    userId, // Firebase Auth ID
    collabId, // ID do colaborador na API
    name, // Nome do usuário
    email, // Email
    avatar, // URL do avatar
    permissions, // Lista de permissões
  } = useCurrentUser();

  // Hook para controle de auth
  const { login, logout, refreshUser } = useAuth();

  // Hook para verificar permissão específica
  const canEditNews = usePermission("edit_news");

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <img src={avatar} alt={name} />
          <h1>Olá, {name}</h1>
          {canEditNews && <button>Editar Notícia</button>}
        </div>
      ) : (
        <button onClick={() => login()}>Fazer Login</button>
      )}
    </div>
  );
}
```

### 🔧 Services Disponíveis

#### **CollabsService**

```tsx
import { CollabsService } from "@/services/collabs";

// Buscar colaborador por Firebase Auth ID
const collab = await CollabsService.getByIdRefAuth(firebaseAuthId, workspaceId);

// Buscar perfil para UI
const profile = await CollabsService.getProfile(firebaseAuthId, workspaceId);

// Verificar permissão
const hasPermission = await CollabsService.hasPermission(firebaseAuthId, "create_posts");

// Buscar colaborador autenticado completo
const authCollab = await CollabsService.getAuthenticatedCollab(firebaseAuthId, workspaceId);
```

#### **AuthService**

```tsx
import { AuthService } from "@/services/authentication/authentication.service";

// Usuário atual do Firebase
const firebaseUser = await AuthService.getCurrentUser();

// Usuário completo com dados do collab
const fullUser = await AuthService.getAuthenticatedUser(workspaceId);

// ID do colaborador
const collabId = await AuthService.getCurrentCollabId(workspaceId);

// Verificar permissão
const canAccess = await AuthService.hasPermission("access_admin", workspaceId);
```

### 📊 Estrutura de Dados

#### **Collab (API Response)**

```typescript
interface Collab {
  id: string;
  name: string;
  email: string;
  phone?: string;
  id_ref_auth: string; // Firebase Auth ID
  thumb?: string;
  thumbnail?: Thumbnail;
  active: boolean;
  birthday?: string;
  hire_date?: string;
  id_access_level: string;
  access_level?: AccessLevel;
  workspace_id?: string;
  position?: string;
  department?: string;
  // ... outros campos
}
```

#### **CollabProfile (UI Optimized)**

```typescript
interface CollabProfile {
  id: string;
  name: string;
  email: string;
  avatar: string; // URL processada
  position?: string;
  department?: string;
  isActive: boolean;
  permissions: string[]; // Lista de permissões
}
```

### 🔄 Integração com Comentários

O sistema de comentários agora usa automaticamente os dados reais do usuário:

```tsx
<StaticCommentsSection
  newsSlug="minha-noticia"
  // currentUserId é automaticamente obtido do contexto
  // workspaceId é passado automaticamente
  // allowComments é baseado na autenticação
  // Avatar e nome do usuário são reais
/>
```

### 🛡️ Controle de Permissões

#### **Verificação de Permissões**

```tsx
import { usePermission } from "@/contexts/auth-context";

function AdminPanel() {
  const canManageUsers = usePermission("manage_users");
  const canEditContent = usePermission("edit_content");

  if (!canManageUsers) {
    return <div>Acesso negado</div>;
  }

  return (
    <div>
      <h1>Painel Admin</h1>
      {canEditContent && <EditContentButton />}
    </div>
  );
}
```

#### **Permissões Comuns**

- `view_content` - Visualizar conteúdo
- `create_content` - Criar conteúdo
- `edit_content` - Editar conteúdo
- `delete_content` - Deletar conteúdo
- `manage_users` - Gerenciar usuários
- `admin_access` - Acesso administrativo

### 🔄 Estados de Loading

O sistema gerencia automaticamente os estados de carregamento:

```tsx
function MyComponent() {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Renderizar conteúdo...
}
```

### 🚀 Próximos Passos

1. **Middleware de Auth**: Implementar middleware para proteção de rotas
2. **Refresh Token**: Sistema de refresh automático
3. **Cache**: Cache inteligente para dados do usuário
4. **Auditoria**: Log de ações do usuário

---

**Autenticação completa integrada! Sistema pronto para produção 🔐**
