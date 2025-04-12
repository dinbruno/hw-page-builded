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
