import { WorkspaceTheme, WorkSpaceThemeCreationResponse } from "./workspace-themes.type";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = process.env.NEXT_PUBLIC_API_CORE_URL_PROD || "http://localhost:4000";

export class WorkspaceThemeService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Failed to perform operation: ${response.statusText}`;
      try {
        const errorBody = await response.text();
        errorMessage += ` - Details: ${errorBody}`;
      } catch (error) {
        console.error("Failed to read error response body:", error);
      }
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const data: T = await response.json();
      if (!data) {
        throw new Error("No data returned from API");
      }
      return data;
    } catch (error) {
      console.error("Failed to parse response JSON:", error);
      throw new Error("Failed to parse server response");
    }
  }

  /**
   * Get workspace theme by workspace ID
   */
  static async getThemeByWorkspaceId(workspaceId: string): Promise<WorkspaceTheme | null> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    try {
      const response = await fetch(`${API_URL}/workspace-themes/${workspaceId}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      console.log("WorkspaceThemeService.getThemeByWorkspaceId", response.status);

      // If 404, no theme exists for this workspace
      if (response.status === 404) {
        return null;
      }

      // Any non-2xx status will throw an error via handleResponse
      return this.handleResponse<WorkspaceTheme>(response);
    } catch (error) {
      console.error("Error in getThemeByWorkspaceId:", error);
      return null;
    }
  }
}
