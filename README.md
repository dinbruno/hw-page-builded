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

## Sistema Multi-Tenant com Builds Específicos

Este projeto implementa uma arquitetura multi-tenant onde cada tenant pode ter seu próprio build específico na Vercel.

### Funcionamento

1. O build principal serve como ponto de entrada e gerenciador de todos os tenants
2. Quando um usuário faz login, o sistema verifica se existe um build específico para o tenant
3. Se não houver, um novo build é automaticamente criado via API da Vercel
4. O usuário é então redirecionado para o build específico do seu tenant

### Configuração

Para o build principal:

```
NEXT_PUBLIC_IS_TENANT_BUILD=false
VERCEL_API_TOKEN=seu-token-da-api-vercel
VERCEL_TEAM_ID=id-do-seu-time-vercel
VERCEL_PROJECT_ID=id-do-seu-projeto-vercel
```

Para builds específicos de tenant:

```
NEXT_PUBLIC_IS_TENANT_BUILD=true
NEXT_PUBLIC_TENANT_ID=id-do-tenant-específico
NEXT_PUBLIC_WORKSPACE_ID=id-do-workspace-principal
```

### Processo de Deploy

1. O build principal deve ser configurado com as variáveis de ambiente necessárias para acessar a API da Vercel
2. Os builds específicos por tenant são criados automaticamente e configurados com suas próprias variáveis de ambiente
3. Cada tenant tem uma URL única no formato `tenant-{id}.vercel.app`

### Desenvolvimento Local

Para desenvolvimento local, o sistema funciona sem criar builds específicos. É possível testar diferentes tenants alterando as variáveis de ambiente:

```
NEXT_PUBLIC_TENANT_ID=tenant-id-para-teste
NEXT_PUBLIC_WORKSPACE_ID=workspace-id-para-teste
```
