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

export interface User {
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

export interface NewsLike {
  id: string;
  news_id: string;
  collab_id: string;
  user?: User;
  createdAt: string;
}

export type CreateNewsLikeData = Omit<NewsLike, "id" | "createdAt" | "user">;
export type UpdateNewsLikeData = Partial<Omit<NewsLike, "id" | "createdAt" | "user" | "news_id" | "collab_id">>;
