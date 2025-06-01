export interface Thumbnail {
  id: string;
  name: string;
  extension: string;
  base_url: string;
  folder: string;
  file: string;
  url: string;
  size: number;
}

export interface Author {
  name: string;
  id_ref_auth: string;
  thumb: string;
  thumbnail: Thumbnail;
  email: string;
  phone: string;
  active: boolean;
  birthday: string;
  hire_date: string;
  id_access_level: string;
}

export interface NewsComment {
  id: string;
  news_id: string;
  author_id: string;
  content: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  author?: Author;
}

export type CreateNewsCommentData = Omit<NewsComment, "id" | "createdAt" | "updatedAt" | "author">;
export type UpdateNewsCommentData = Partial<Omit<NewsComment, "id" | "createdAt" | "updatedAt" | "author" | "news_id" | "author_id">>;
