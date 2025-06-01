import { auth } from "@/firebase";
import { CollabsService, type AuthCollab, type CollabProfile } from "@/services/collabs";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL_PROD;
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL_PROD;

export interface AuthUser {
  uuid: string;
  email: string;
  name: string;
  photo: string;
}

export interface AuthenticatedUser extends AuthUser {
  collab?: AuthCollab;
  profile?: CollabProfile;
  workspaceId?: string;
}

export class AuthService {
  /**
   * Get current Firebase Auth user - uses client-side Firebase when available
   */
  static async getCurrentUser(): Promise<AuthUser> {
    // Try to get from Firebase Auth directly (client-side)
    if (typeof window !== "undefined" && auth.currentUser) {
      const firebaseUser = auth.currentUser;
      return {
        uuid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || firebaseUser.email || "",
        photo: firebaseUser.photoURL || "/images/avatar.png",
      };
    }

    // Fallback to API call (server-side or when Firebase not available)
    const response = await fetch(`/api/auth/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error getCurrentUser: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to getCurrentUser: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    return data as AuthUser;
  }

  /**
   * Get complete authenticated user with collaborator data
   */
  static async getAuthenticatedUser(workspaceId?: string): Promise<AuthenticatedUser> {
    try {
      // Get Firebase Auth user
      const firebaseUser = await this.getCurrentUser();

      // Get collaborator data using Firebase Auth ID
      let collab: AuthCollab | undefined;
      let profile: CollabProfile | undefined;

      try {
        const collabData = await CollabsService.getByIdRefAuth(firebaseUser.uuid, workspaceId);

        // Convert Collab to AuthCollab
        collab = {
          ...collabData,
          permissions: collabData.access_level?.permissions || [],
          isAuthenticated: true,
        };

        profile = await CollabsService.getProfile(firebaseUser.uuid, workspaceId);
      } catch (collabError) {
        console.warn("Could not load collaborator data:", collabError);
        // Continue without collaborator data if not found
      }

      return {
        ...firebaseUser,
        collab,
        profile,
        workspaceId: workspaceId || collab?.workspace_id,
      };
    } catch (error) {
      console.error("Error getting authenticated user:", error);
      throw error;
    }
  }

  /**
   * Get user profile for UI components
   */
  static async getUserProfile(workspaceId?: string): Promise<CollabProfile> {
    const firebaseUser = await this.getCurrentUser();
    return CollabsService.getProfile(firebaseUser.uuid, workspaceId);
  }

  /**
   * Check if current user has permission
   */
  static async hasPermission(permission: string, workspaceId?: string): Promise<boolean> {
    try {
      const firebaseUser = await this.getCurrentUser();
      return CollabsService.hasPermission(firebaseUser.uuid, permission, workspaceId);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  /**
   * Get current user's collaborator ID for API operations
   */
  static async getCurrentCollabId(workspaceId?: string): Promise<string> {
    const firebaseUser = await this.getCurrentUser();
    const collab = await CollabsService.getByIdRefAuth(firebaseUser.uuid, workspaceId);
    return collab.id;
  }

  /**
   * Get current user's Firebase Auth ID
   */
  static async getCurrentAuthId(): Promise<string> {
    const firebaseUser = await this.getCurrentUser();
    return firebaseUser.uuid;
  }

  /**
   * Check if user is authenticated and active
   */
  static async isAuthenticated(workspaceId?: string): Promise<boolean> {
    try {
      const user = await this.getAuthenticatedUser(workspaceId);
      return user.collab?.active ?? false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout user - uses Firebase signOut when available
   */
  static async logout(): Promise<void> {
    // Try Firebase logout first (client-side)
    if (typeof window !== "undefined" && auth.currentUser) {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      return;
    }

    // Fallback to API logout
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }
  }
}
