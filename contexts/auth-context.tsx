"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Cookies from "js-cookie";

// Firebase
import { auth } from "@/firebase";

// Services
import { CollabsService, type AuthCollab, type CollabProfile } from "@/services/collabs";

interface AuthUser {
  uuid: string;
  email: string;
  name: string;
  photo: string;
}

interface AuthenticatedUser extends AuthUser {
  collab?: AuthCollab;
  profile?: CollabProfile;
  workspaceId?: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  profile: CollabProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  workspaceId?: string;
  login: (workspaceId?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  getCurrentUserId: () => string | null;
  getCurrentCollabId: () => string | null;
  getUserInitials: (name?: string) => string;
  getUserAvatar: (user?: AuthenticatedUser, profile?: CollabProfile) => { type: string; src?: string; initials: string };
}

interface AuthProviderProps {
  children: ReactNode;
  initialWorkspaceId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useFirebaseUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: AuthUser = {
          uuid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email || "",
          photo: firebaseUser.photoURL || "/images/avatar.png",
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialWorkspaceId }) => {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseUser();
  const [collab, setCollab] = useState<AuthCollab | null>(null);
  const [profile, setProfile] = useState<CollabProfile | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(initialWorkspaceId);
  const [collabLoading, setCollabLoading] = useState(false);

  const loadCollaboratorData = useCallback(async (userId: string, currentWorkspaceId?: string) => {
    if (!userId) return;

    setCollabLoading(true);
    try {
      // Get collaborator data using Firebase Auth ID
      const collabData = await CollabsService.getByIdRefAuth(userId, currentWorkspaceId);

      // Convert Collab to AuthCollab
      const authCollab: AuthCollab = {
        ...collabData,
        permissions: collabData.access_level?.permissions || [],
        isAuthenticated: true,
      };
      setCollab(authCollab);

      // Get profile data
      const profileData = await CollabsService.getProfile(userId, currentWorkspaceId);
      setProfile(profileData);

      setWorkspaceId(currentWorkspaceId || collabData.workspace_id);
    } catch (error) {
      console.warn("Could not load collaborator data:", error);
      setCollab(null);
      setProfile(null);
    } finally {
      setCollabLoading(false);
    }
  }, []);

  // Load collaborator data when Firebase user changes
  useEffect(() => {
    if (firebaseUser && !firebaseLoading) {
      loadCollaboratorData(firebaseUser.uuid, initialWorkspaceId);
    } else {
      setCollab(null);
      setProfile(null);
    }
  }, [firebaseUser, firebaseLoading, loadCollaboratorData, initialWorkspaceId]);

  const user: AuthenticatedUser | null = useMemo(() => {
    if (!firebaseUser) return null;

    return {
      ...firebaseUser,
      collab: collab || undefined,
      profile: profile || undefined,
      workspaceId,
    };
  }, [firebaseUser, collab, profile, workspaceId]);

  const isAuthenticated = Boolean(user && user.collab?.active);
  const isLoading = firebaseLoading || collabLoading;

  const login = async (newWorkspaceId?: string) => {
    if (firebaseUser) {
      await loadCollaboratorData(firebaseUser.uuid, newWorkspaceId);
    }
  };

  const logout = useCallback(async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local state
      setCollab(null);
      setProfile(null);
      setWorkspaceId(undefined);

      // Clear cookies
      Cookies.remove("authToken");
      Cookies.remove("x-tenant");
      Cookies.remove("tenantId");
      Cookies.remove("workspaceId");

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear local data and redirect
      setCollab(null);
      setProfile(null);
      setWorkspaceId(undefined);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadCollaboratorData(firebaseUser.uuid, workspaceId);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return profile?.permissions?.includes(permission) || false;
  };

  const getCurrentUserId = (): string | null => {
    return user?.uuid || null;
  };

  const getCurrentCollabId = (): string | null => {
    return user?.collab?.id || null;
  };

  // Helper function to generate user initials
  const getUserInitials = useCallback((name?: string) => {
    if (!name) return "U";

    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }, []);

  // Helper function to get user avatar with fallback to initials
  const getUserAvatar = useCallback(
    (user?: AuthenticatedUser, profile?: CollabProfile) => {
      const photo = user?.photo || profile?.avatar;
      const name = user?.name || profile?.name || "Usuário";

      if (photo && photo !== "/images/avatar.png") {
        return { type: "image" as const, src: photo, initials: getUserInitials(name) };
      }

      return { type: "initials" as const, initials: getUserInitials(name) };
    },
    [getUserInitials]
  );

  const contextValue: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    workspaceId,
    login,
    logout,
    refreshUser,
    hasPermission,
    getCurrentUserId,
    getCurrentCollabId,
    getUserInitials,
    getUserAvatar,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hooks individuais para facilitar o uso
export const useCurrentUser = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  return {
    user,
    isLoading,
    isAuthenticated,
    userId: user?.uuid || null,
    collabId: user?.collab?.id || null,
    profile: user?.profile || null,
  };
};

export const usePermission = (permission: string) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};
