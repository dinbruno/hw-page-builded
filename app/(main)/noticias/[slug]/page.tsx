"use client";

import { NewsArticlePageClient } from "./news-article-client";
import { AuthProvider } from "@/contexts/auth-context";
import { useParams, useSearchParams } from "next/navigation";

export default function NewsArticlePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const workspaceId = searchParams?.get("workspaceId") || undefined;

  return (
    <AuthProvider initialWorkspaceId={workspaceId}>
      <NewsArticlePageClient slug={slug} workspaceId={workspaceId} />
    </AuthProvider>
  );
}
