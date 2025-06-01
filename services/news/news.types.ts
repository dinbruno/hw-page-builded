// Interface para autor
export interface NewsAuthor {
  id: string;
  name: string;
  email: string;
}

// Interface para imagem de capa
export interface NewsCoverImage {
  id: string;
  name: string;
  extension: string;
  base_url: string;
  folder: string;
  file: string;
  url: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  slug?: string;
  cover_image_id?: string;
  id_collab: string;
  workspace_id: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  author?: NewsAuthor;
  cover_image?: NewsCoverImage;
}

export type CreateNewsData = Omit<News, "id" | "createdAt" | "updatedAt" | "author" | "cover_image">;
export type UpdateNewsData = Partial<Omit<News, "id" | "createdAt" | "updatedAt" | "author" | "cover_image">>;
