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
import { TenantDomainsClient } from "@/services/tenant-domains/tenant-domains-client";
import { setAuthToken, setTenantId } from "@/utils/getAuth";

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
  const [domainStatus, setDomainStatus] = useState<"checking" | "ready" | "failed">("ready");
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

  // Função para verificar e aguardar disponibilidade do domínio
  const verifyDomainAvailability = async (tenantId: string) => {
    try {
      setDomainStatus("checking");

      // Obter workspaces para usar o nome no domínio
      const workspaces = await WorkspaceService.getWorkspaces();

      if (!workspaces || workspaces.length === 0) {
        // Se não houver workspaces, vai redirecionar para onboarding
        return true;
      }

      const workspace = workspaces[0];

      // Verificar disponibilidade do domínio
      let attempts = 0;
      const maxAttempts = 3;
      let domainReady = false;
      let lastDomainResult: { success: boolean; url: string; message?: string } | null = null;

      while (attempts < maxAttempts && !domainReady) {
        attempts++;
        console.log(`Tentativa ${attempts} de verificar domínio...`);

        try {
          // Usar o novo cliente para obter ou registrar o domínio
          const domainUrl = await TenantDomainsClient.getOrRegisterTenantDomain(
            workspace.name || workspace.slug,
            tenantId,
            true // Forçar criação do domínio
          );

          console.log("Domínio verificado com sucesso via API de domínios:", domainUrl);

          domainReady = true;
          lastDomainResult = {
            success: true,
            url: domainUrl,
          };
          break;
        } catch (err) {
          console.error("Erro ao tentar verificar domínio:", err);
          // Aguardar antes da próxima tentativa
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Mesmo se não conseguirmos verificar o domínio, podemos continuar após exibir alerta
      if (domainReady) {
        setDomainStatus("ready");
        return true;
      } else {
        console.log("Falha na verificação do domínio, mas continuando com redirecionamento");
        setDomainStatus("failed");

        let errorMessage = "A aplicação pode estar em processo de inicialização. Vamos continuar, mas pode haver alguns atrasos.";
        if (lastDomainResult && typeof lastDomainResult === "object") {
          const message = (lastDomainResult as any).message;
          if (message) {
            errorMessage = `Problema ao verificar domínio: ${message}. Vamos continuar mesmo assim.`;
          }
        }

        toast({
          title: "Atenção",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });

        // Continuar mesmo assim após um tempo
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return true;
      }
    } catch (error) {
      console.error("Erro ao verificar domínio:", error);
      setDomainStatus("failed");

      toast({
        title: "Atenção",
        description: "Problemas ao verificar configuração do ambiente. Redirecionando para a página principal.",
        variant: "destructive",
        duration: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true; // Retornar true mesmo com erro para não bloquear redirecionamento
    }
  };

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

      // Armazenar token e tenantId usando as novas funções de autenticação
      setAuthToken(token);
      setTenantId(tenantId);

      // Também manter compatibilidade com código existente
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("tenantId", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      // Show success toast
      toast({
        title: "Login realizado com sucesso",
        description: "Verificando ambiente...",
      });

      setIsRedirecting(true);

      // Verificar disponibilidade do domínio antes de redirecionar
      const domainReady = await verifyDomainAvailability(tenantId);

      if (domainReady) {
        // Simply redirect to root route which will handle the proper redirection
        router.push("/");
      } else {
        toast({
          title: "Problema de conectividade",
          description: "Não foi possível verificar o ambiente. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setIsRedirecting(false);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(handleFirebaseError(err.code || err.message || "Erro ao fazer login"));
      setIsRedirecting(false);

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

      // Armazenar token e tenantId usando as novas funções de autenticação
      setAuthToken(token);
      setTenantId(tenantId);

      // Também manter compatibilidade com código existente
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("tenantId", tenantId, { expires: 7, secure: true, sameSite: "Strict" });

      // Show success toast
      toast({
        title: "Login realizado com sucesso",
        description: "Verificando ambiente...",
      });

      setIsRedirecting(true);

      // Verificar disponibilidade do domínio antes de redirecionar
      const domainReady = await verifyDomainAvailability(tenantId);

      if (domainReady) {
        // Simply redirect to root route which will handle the proper redirection
        router.push("/");
      } else {
        toast({
          title: "Problema de conectividade",
          description: "Não foi possível verificar o ambiente. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setIsRedirecting(false);
        setIsLoading(false);
      }
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
    domainStatus,
  };
}
