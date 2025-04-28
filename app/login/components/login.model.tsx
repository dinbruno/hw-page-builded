"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";

// Firebase
import { auth } from "@/firebase";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Utilities
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { loginSchema, resetSchema } from "./login.schema";
import { handleFirebaseError } from "@/lib/functions";
import { authApi } from "@/services/api";
import { WorkspaceService } from "@/services/workspaces/workspaces.service";
import { setAuthToken, setTenantId } from "@/utils/getAuth";
import { WorkspaceTheme } from "@/services/workspace-themes/workspace-themes.type";
import { WorkspaceThemeService } from "@/services/workspace-themes/workspace-theme.service";
import { PageService } from "@/services/page-constructor/page-constructor.service";
import { setWorkspaceIdCookie } from "@/app/actions/cookie-actions";

interface PageWithName {
  id: string;
  slug: string;
  workspaceId: string;
  name: string;
}

interface File {
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

interface WorkspaceWithTheme {
  workspace: {
    id: string;
    name: string;
    slug: string;
    thumbnail?: File;
    favicon_file?: File | null;
  } | null;
  theme: WorkspaceTheme | null;
}

export function useLoginPage() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceWithTheme>({
    workspace: null,
    theme: null,
  });

  const {
    register: loginRegister,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: resetRegister,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    async function fetchWorkspaceInfo() {
      try {
        setIsInitialLoading(true);

        const hostname = "https://workspace-3kxlqajt.vercel.app";

        const workspace = await WorkspaceService.getWorkspaceByUrl(hostname);

        if (workspace) {
          try {
            const theme = await WorkspaceThemeService.getThemeByWorkspaceId(workspace.id);

            if (theme) {
              setWorkspaceInfo({ workspace, theme });

              applyThemeToDom(theme);
            } else {
              setWorkspaceInfo({ workspace, theme: null });
            }
          } catch (themeError) {
            console.error("Error fetching workspace theme:", themeError);
            setWorkspaceInfo({ workspace, theme: null });
          }
        }
      } catch (err) {
        console.error("Error fetching workspace information:", err);
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 1000);
      }
    }

    fetchWorkspaceInfo();
  }, []);

  const applyThemeToDom = (theme: WorkspaceTheme) => {
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.color_primary_hex);
    root.style.setProperty("--color-secondary", theme.color_second_hex);
    root.style.setProperty("--color-background", theme.color_background);
    root.style.setProperty("--color-text", theme.color_text);
    root.style.setProperty("--font-family", theme.font_name);

    if (theme.font_name && theme.font_name !== "Roboto") {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${theme.font_name.replace(" ", "+")}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    setError("");
  }, []);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setIsRedirecting(false);
    setError("");

    try {
      const { email, password } = data;

      if (!email.includes("@") || !email.split("@")[1].includes(".")) {
        throw new Error("invalid-email");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await authApi.post("/auth/login", { idToken });

      if (response.data.statusCode !== 201 || !response.data.success) {
        setShowAccessRequest(true);
        setIsLoading(false);
        return;
      }

      const token = response.data.data.token;
      const tenantId = response.data.data.user.tenantId;

      setAuthToken(token);
      setTenantId(tenantId);

      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("tenantId", tenantId, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("x-tenant", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando...",
      });

      setIsRedirecting(true);

      try {
        const workspaces = await WorkspaceService.getWorkspaces();

        if (!workspaces || workspaces.length === 0) {
          window.location.href = "/onboarding/welcome";
          return;
        }

        const workspace = workspaces[0];

        const pages = await PageService.getAll(workspace.id, token, tenantId);

        if (pages && pages.length > 0) {
          const homePage = pages.find((page: any) => page.name === "Página Inicial") || pages[0];

          Cookies.set("workspaceId", workspace.id, { expires: 7, secure: true, sameSite: "Strict" });

          await setWorkspaceIdCookie(workspace.id);

          window.location.href = "/";
          return;
        } else {
          window.location.href = "/";
        }
      } catch (redirectError) {
        console.error("Erro ao redirecionar após login:", redirectError);
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error(err);
      setError(handleFirebaseError(err.code || err.message || "Erro ao fazer login"));
      setIsRedirecting(false);

      toast({
        title: "Erro ao fazer login",
        description: handleFirebaseError(err.code || err.message || "Erro ao fazer login"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: z.infer<typeof resetSchema>) => {
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, data.emailToReset);

      toast({
        title: "Email de recuperação enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });

      setTimeout(() => {
        setStep(0);
      }, 1500);
    } catch (err: any) {
      console.log(err.code);
      setError(handleFirebaseError(err.code));

      toast({
        title: "Erro ao enviar email de recuperação",
        description: handleFirebaseError(err.code),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setIsRedirecting(false);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await authApi.post("/auth/login", { idToken });

      if (response.data.statusCode !== 201 || !response.data.success) {
        setShowAccessRequest(true);
        setIsLoading(false);
        return;
      }

      const token = response.data.data.token;
      const tenantId = response.data.data.user.tenantId;

      setAuthToken(token);
      setTenantId(tenantId);

      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("x-tenant", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando...",
      });

      setIsRedirecting(true);

      try {
        const workspaces = await WorkspaceService.getWorkspaces();

        if (!workspaces || workspaces.length === 0) {
          window.location.href = "/onboarding/welcome";
          return;
        }

        const workspace = workspaces[0];

        const pages = await PageService.getAll(workspace.id, token, tenantId);

        if (pages && pages.length > 0) {
          const homePage = pages.find((page: any) => page.name === "Página Inicial") || pages[0];

          Cookies.set("workspaceId", workspace.id, { expires: 7, secure: true, sameSite: "Strict" });

          await setWorkspaceIdCookie(workspace.id);

          window.location.href = "/";
          return;
        } else {
          window.location.href = "/";
        }
      } catch (redirectError) {
        console.error("Erro ao redirecionar após login:", redirectError);
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error(err);
      setError(handleFirebaseError(err.code || err.message || "Erro ao fazer login"));
      setIsRedirecting(false);

      toast({
        title: "Erro ao fazer login",
        description: handleFirebaseError(err.code || err.message || "Erro ao fazer login"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginRegister,
    handleSubmitLogin,
    loginErrors,
    handleLogin,
    handleForgotPassword,
    step,
    setStep,
    isLoading,
    handleSubmitReset,
    error,
    resetErrors,
    resetRegister,
    isRedirecting,
    showAccessRequest,
    setShowAccessRequest,
    handleGoogleLogin,
    workspaceInfo,
    isInitialLoading,
  };
}
