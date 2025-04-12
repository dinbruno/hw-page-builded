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
import { PageService } from "@/services/page-constructor/page-constructor.service";

// Define extended page interface that includes name
interface PageWithName {
  id: string;
  slug: string;
  workspaceId: string;
  name: string;
}

export function useLoginPage() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectDestination, setRedirectDestination] = useState<"workspace" | "onboarding">("workspace");
  const [showAccessRequest, setShowAccessRequest] = useState(false);

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

  // Clear error when step changes
  useEffect(() => {
    setError("");
  }, []);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError("");

    try {
      const { email, password } = data;

      // Verificar se o email está no formato de domínio corporativo
      if (!email.includes("@") || !email.split("@")[1].includes(".")) {
        throw new Error("invalid-email");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Verificar se o usuário tem acesso a algum tenant
      const response = await authApi.post("/auth/login", { idToken });

      // Verificar se o login foi bem-sucedido com base no status code e success
      if (response.data.statusCode !== 201 || !response.data.success) {
        setShowAccessRequest(true);
        setIsLoading(false);
        return;
      }

      const token = response.data.data.token;
      const tenantId = response.data.data.user.tenantId;

      // Armazenar token e tenantId nos cookies
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("tenantId", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      // Armazenar também no localStorage como backup
      localStorage.setItem("authToken", token);
      localStorage.setItem("tenantId", tenantId);

      // Show success toast
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

      setIsRedirecting(true);

      // Simply redirect to root route which will handle the proper redirection
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(handleFirebaseError(err.code || err.message || "Erro ao fazer login"));

      // Show error toast
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

      // Return to login form after successful reset request
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
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Verificar se o usuário tem acesso a algum tenant
      const response = await authApi.post("/auth/login", { idToken });

      // Verificar se o login foi bem-sucedido com base no status code e success
      if (response.data.statusCode !== 201 || !response.data.success) {
        setShowAccessRequest(true);
        setIsLoading(false);
        return;
      }

      const token = response.data.data.token;
      const tenantId = response.data.data.user.tenantId;

      // Armazenar token e tenantId nos cookies
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("tenantId", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      // Armazenar também no localStorage como backup
      localStorage.setItem("authToken", token);
      localStorage.setItem("tenantId", tenantId);

      // Show success toast
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

      setIsRedirecting(true);

      // Simply redirect to root route which will handle the proper redirection
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(handleFirebaseError(err.code || err.message || "Erro ao fazer login"));

      // Show error toast
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
    redirectDestination,
    showAccessRequest,
    setShowAccessRequest,
    handleGoogleLogin,
  };
}
