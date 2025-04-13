export interface WorkspaceTheme {
  id: string;
  id_workspace: string;
  font_name: string;
  color_primary_hex: string;
  color_second_hex: string;
  color_background: string;
  color_text: string;
}

export type WorkSpaceThemeCreationResponse = Omit<WorkspaceTheme, "id">;