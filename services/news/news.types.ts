export interface News {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  slug?: string;
  cover_image_id?: string;
  created_by: string;
  workspace_id: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNewsData = Omit<News, "id" | "createdAt" | "updatedAt">;
export type UpdateNewsData = Partial<Omit<News, "id" | "createdAt" | "updatedAt">>;
