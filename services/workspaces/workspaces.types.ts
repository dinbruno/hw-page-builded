export interface Founder {
  id: string;
  thumb: string;
  name: string;
  email: string;
  id_ref_auth: string;
  phone: number;
  active: boolean;
  birthday: string | null;
  hire_date: string | null;
  id_access_level: string;
  createdAt: string;
  updatedAt: string;
}

export interface File {
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

export interface WorkspaceTheme {
  id: string;
  id_workspace: string;
  font_name: string;
  color_primary_hex: string;
  color_second_hex: string;
  color_background: string;
  color_text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  slug: string;
  active: boolean;
  id_collab_founder: string;
  thumb: string;
  favicon: string | null;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  founder: Founder;
  thumbnail: File;
  favicon_file: File | null;
  workspace_theme: WorkspaceTheme;
}

export type CreateWorkspaceInput = Omit<Workspace, "id" | "createdAt" | "updatedAt" | "founder" | "thumbnail" | "favicon_file" | "workspace_theme">;

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput> & {
  workspace_theme?: Partial<WorkspaceTheme>;
};

export interface GetWorkspaceParams {
  slug: string;
}

export type GetWorkspacesResponse = Workspace[];

export interface WorkspaceSettingsHookReturn extends Workspace {
  t: (key: string) => string;
  activeTab: "general" | "access" | "auth";
  roles: AccessRole[];
  authSettings: AuthSettings;
  isLoading: boolean;
  error: Error | null;
  handleTabChange: (tab: "general" | "access" | "auth") => void;
  handleUpdateSettings: (settings: UpdateWorkspaceInput) => void;
  handleUpdateAuthSettings: (settings: Partial<AuthSettings>) => void;
  handleFileUpload: (file: File, type: "icon" | "logo") => void;
}

export interface AccessRole {
  id: string;
  name: string;
  description: string;
  users: {
    id: string;
    avatar: string;
    name: string;
  }[];
  isActive: boolean;
}

export interface AuthSettings {
  googleAuth: boolean;
  microsoftAuth: boolean;
  phoneAuth: boolean;
  usernamePassword: boolean;
}
