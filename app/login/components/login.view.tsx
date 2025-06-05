"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

// Safe Logo component with multiple fallbacks
const SafeLogo = ({
  workspaceLogoUrl,
  workspaceName,
  width = 120,
  height = 120,
  className = "h-[80px] w-auto object-contain",
}: {
  workspaceLogoUrl?: string;
  workspaceName?: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Define fallback sources in order of preference
  const fallbackSources = [workspaceLogoUrl, "/Logo.png", "/logo.png", "/assets/logo.png", "/images/logo.png", "/placeholder.svg"].filter(
    Boolean
  ) as string[];

  useEffect(() => {
    if (workspaceLogoUrl) {
      setCurrentSrc(workspaceLogoUrl);
      setHasError(false);
    } else {
      setCurrentSrc("/Logo.png");
      setHasError(false);
    }
  }, [workspaceLogoUrl]);

  const handleImageError = () => {
    if (!currentSrc) return;

    const currentIndex = fallbackSources.indexOf(currentSrc);
    const nextIndex = currentIndex + 1;

    if (nextIndex < fallbackSources.length) {
      setCurrentSrc(fallbackSources[nextIndex]);
    } else {
      // All image sources failed, show SVG fallback
      setHasError(true);
    }
  };

  // SVG Logo fallback
  const SVGLogo = () => (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg ${className}`}
      style={{ width: width, height: height }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7L12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  if (hasError || !currentSrc) {
    return <SVGLogo />;
  }

  return (
    <Image
      src={currentSrc}
      alt={`Logo de ${workspaceName || "empresa"}`}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
      onLoad={() => setHasError(false)}
      priority
    />
  );
};

// Animated background component
const AnimatedBackground = ({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      {/* Improved grid with more blur */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "center bottom",
          filter: "blur(1px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      {/* Enhanced wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ filter: "blur(15px)" }}>
          <path
            fill="white"
            fillOpacity="0.15"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              values="
                M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,240C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
          <path
            fill="white"
            fillOpacity="0.25"
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              values="
                M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
              dur="15s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

// Animated card component
const AnimatedCard = ({ children, isInView }: { children: React.ReactNode; isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl"
    >
      <Card className="border-none bg-white shadow-2xl overflow-hidden rounded-2xl">
        <CardContent className="p-8">{children}</CardContent>
      </Card>
    </motion.div>
  );
};

// Animated button component
const AnimatedButton = ({
  children,
  onClick,
  disabled,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 rounded-md text-white font-medium relative overflow-hidden ${className}`}
      style={style}
      whileHover={{
        scale: 1.01,
        filter: "brightness(1.1)",
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </motion.button>
  );
};

// Social login button component
const SocialButton = ({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 relative overflow-hidden group rounded-md border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ y: 0, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-center justify-center">
        {icon}
        <span className="text-gray-700">{label}</span>
      </div>
    </motion.button>
  );
};

// Input field component
const InputField = ({
  id,
  type,
  label,
  placeholder,
  register,
  error,
  disabled,
  primaryColor,
  icon,
  rightIcon,
  onRightIconClick,
}: {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  register: any;
  error?: string;
  disabled?: boolean;
  primaryColor: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          className={`h-12 rounded-md border-0 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
            icon ? "pl-10" : "px-4"
          }`}
          style={
            {
              "--tw-ring-color": `${primaryColor}80`,
            } as React.CSSProperties
          }
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {rightIcon}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export function LoginView(props: any) {
  const {
    step,
    setStep,
    isLoading,
    loginRegister,
    handleSubmitLogin,
    loginErrors,
    handleSubmitReset,
    handleLogin,
    handleForgotPassword,
    error,
    resetErrors,
    resetRegister,
    isRedirecting,
    showAccessRequest,
    setShowAccessRequest,
    handleGoogleLogin,
    workspaceInfo,
  } = props;

  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Usar as cores do workspace quando disponíveis
  const primaryColor = workspaceInfo.theme?.color_primary_hex || "#104a74";
  const secondaryColor = workspaceInfo.theme?.color_second_hex || "#1071a0";
  const backgroundColor = workspaceInfo.theme?.color_background || "#FFFFFF";
  const textColor = workspaceInfo.theme?.color_text || "#1F2937";

  // Adicionar estilos CSS para animação do grid
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gridMove {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(80px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Animated background */}
      <AnimatedBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />

      {/* Redirecting overlay */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: `${backgroundColor}80` }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div
                className="mb-10 flex justify-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <SafeLogo workspaceLogoUrl={workspaceInfo.workspace?.favicon_file?.url} workspaceName={workspaceInfo.workspace?.name} />
              </motion.div>

              <div className="relative flex justify-center mb-8">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="h-10 w-10 text-white" />
                </motion.div>

                <motion.div
                  className="absolute inset-0 rounded-full blur-xl -z-10"
                  style={{ backgroundColor: "#ffffff" }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>

              <motion.div
                className="w-48 h-[2px] rounded-full overflow-hidden mb-6 mx-auto bg-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{
                    width: ["0%", "100%"],
                    x: ["-100%", "0%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.p
                className="text-center text-sm font-medium text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Redirecionando para sua área de trabalho
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access request modal */}
      <AnimatePresence>
        {showAccessRequest && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: `${backgroundColor}80` }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Card className="max-w-md w-full border-none shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                      <AlertCircle className="h-12 w-12 text-amber-500" />
                    </motion.div>
                  </div>
                  <h2 className="text-xl font-semibold text-center">Acesso Pendente</h2>
                  <p className="text-sm text-center text-gray-500 mt-2">Sua conta foi criada, mas você ainda não tem acesso a nenhum workspace.</p>
                  <p className="text-center text-sm text-gray-500 mt-4 mb-6">
                    Entre em contato com o administrador do seu tenant para solicitar acesso.
                  </p>
                  <div className="flex justify-center">
                    <AnimatedButton onClick={() => setShowAccessRequest(false)} style={{ backgroundColor: primaryColor }} className="max-w-xs">
                      Voltar para o login
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Centered Card */}
      <div className="flex w-full items-center justify-center p-6 relative z-10" ref={ref}>
        <AnimatedCard isInView={isInView}>
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="relative"
            >
              <SafeLogo workspaceLogoUrl={workspaceInfo.workspace?.favicon_file?.url} workspaceName={workspaceInfo.workspace?.name} />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl font-bold text-center">{step === 0 ? "Bem vindo(a)" : "Recuperar senha"}</h1>
            <p className="text-sm text-center text-gray-500 mb-6">
              {step === 0
                ? "Faça login para acessar sua conta e navegar pelo seu espaço de trabalho."
                : "Digite o email associado à sua conta para receber um link de recuperação."}
            </p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-4">
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Social login buttons */}
                <div className="flex flex-col space-y-3">
                  <SocialButton
                    icon={
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.69 0 6.29 1.58 7.74 2.91l5.65-5.65C34.18 4.14 29.62 2 24 2 14.92 2 7.4 7.95 4.77 16.24l6.63 5.13C12.69 15.36 17.86 9.5 24 9.5z"
                        />
                        <path
                          fill="#34A853"
                          d="M46.55 24.48c0-1.4-.12-2.41-.37-3.47H24v7h12.66c-.54 3.04-2.47 5.63-5.46 7.39l6.68 5.16c3.92-3.63 6.22-8.98 6.22-15.08z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M11.4 28.19c-.88-2.64-1.4-5.46-1.4-8.19s.52-5.55 1.4-8.19L4.77 6.76C1.77 11.47 0 17.38 0 24s1.77 12.53 4.77 17.24l6.63-5.05z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M24 46c5.86 0 10.78-1.92 14.37-5.21L31.8 35.62C30.11 36.65 27.77 37 24 37c-6.14 0-11.31-5.36-12.6-12.48L4.77 30.05C7.4 40.05 14.92 46 24 46z"
                        />
                      </svg>
                    }
                    label="Entrar com o Google"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  />

                  <SocialButton
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 48 48">
                        <path fill="#F25022" d="M22 22H3V3h19v19z" />
                        <path fill="#00A4EF" d="M45 22H26V3h19v19z" />
                        <path fill="#7FBA00" d="M45 45H26V26h19v19z" />
                        <path fill="#FFB900" d="M22 45H3V26h19v19z" />
                      </svg>
                    }
                    label="Entrar com Microsoft"
                    disabled={isLoading}
                  />
                </div>

                {/* Divider line with animation */}
                <motion.div
                  className="relative flex items-center py-2"
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </motion.div>

                {/* Email login form */}
                <div className="space-y-4">
                  <InputField
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="nome@exemplo.com"
                    register={loginRegister("email")}
                    error={loginErrors.email ? String(loginErrors.email.message) : undefined}
                    disabled={isLoading}
                    primaryColor={primaryColor}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    }
                  />

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Button
                        variant="link"
                        className="px-0 h-auto font-normal text-xs"
                        onClick={() => setStep(1)}
                        type="button"
                        style={{ color: primaryColor }}
                      >
                        Esqueceu a senha?
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...loginRegister("password")}
                        className="h-12 rounded-md border-0 bg-gray-100 pl-10 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                        style={
                          {
                            "--tw-ring-color": `${primaryColor}80`,
                          } as React.CSSProperties
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {loginErrors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -5, height: 0 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {String(loginErrors.password.message)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-center items-center mt-5">
                    <AnimatedButton
                      onClick={handleSubmitLogin(handleLogin)}
                      style={{ backgroundColor: primaryColor }}
                      disabled={isLoading}
                      className="w-full flex justify-center items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Entrando...</span>
                        </>
                      ) : (
                        <>
                          <span>Entrar</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <InputField
                  id="emailToReset"
                  type="email"
                  label="Email"
                  placeholder="nome@exemplo.com"
                  register={resetRegister("emailToReset")}
                  error={resetErrors.emailToReset ? String(resetErrors.emailToReset.message) : undefined}
                  disabled={isLoading}
                  primaryColor={primaryColor}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  }
                />

                <AnimatedButton onClick={handleSubmitReset(handleForgotPassword)} style={{ backgroundColor: primaryColor }} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar instruções</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </AnimatedButton>

                <div className="text-center text-sm">
                  <Button variant="link" className="p-0 h-auto font-normal" onClick={() => setStep(0)} type="button" style={{ color: primaryColor }}>
                    Voltar para o login
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>
      </div>
      <Toaster />
    </div>
  );
}
