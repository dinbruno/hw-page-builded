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

export interface AccessLevel {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collab {
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
  bio?: string;
  skills?: string[];
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type CreateCollabData = Omit<Collab, "id" | "createdAt" | "updatedAt" | "thumbnail" | "access_level">;
export type UpdateCollabData = Partial<Omit<Collab, "id" | "createdAt" | "updatedAt" | "thumbnail" | "access_level" | "id_ref_auth">>;

// Auth-related interfaces
export interface AuthCollab extends Collab {
  permissions: string[];
  isAuthenticated: boolean;
}

export interface CollabProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position?: string;
  department?: string;
  isActive: boolean;
  permissions: string[];
}
