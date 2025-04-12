"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Info, Server } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

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
    redirectDestination,
    showAccessRequest,
    setShowAccessRequest,
    handleGoogleLogin,
    domainStatus,
  } = props;

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 flex flex-col items-center">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {domainStatus === "checking" ? <Server className="h-12 w-12 text-amber-500" /> : <Loader2 className="h-12 w-12 text-primary" />}
                </motion.div>
                <motion.h2
                  className="text-xl font-semibold mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {domainStatus === "checking" ? "Verificando ambiente" : "Redirecionando"}
                </motion.h2>
                <motion.p
                  className="text-muted-foreground text-center mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {domainStatus === "checking"
                    ? "Estamos verificando a disponibilidade do ambiente. Isso pode levar alguns segundos..."
                    : redirectDestination === "workspace"
                    ? "Você está sendo redirecionado para seu workspace"
                    : "Você está sendo redirecionado para o onboarding"}
                </motion.p>
                {domainStatus === "checking" && (
                  <motion.div
                    className="w-full max-w-xs h-2 bg-secondary mt-6 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 6,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccessRequest && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="max-w-md w-full">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <AlertCircle className="h-12 w-12 text-amber-500" />
                </div>
                <CardTitle className="text-center">Acesso Pendente</CardTitle>
                <CardDescription className="text-center">Sua conta foi criada, mas você ainda não tem acesso a nenhum workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Entre em contato com o administrador do seu tenant para solicitar acesso.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => setShowAccessRequest(false)}>Voltar para o login</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Image className="w-[200px]" src="/Logo.png" alt="Logo da empresa" width={800} height={800} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-3xl font-bold tracking-tight">{step === 0 ? "Entrar na plataforma" : "Recuperar senha"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === 0 ? "Acesse sua conta para continuar" : "Informe seu email para receber instruções de recuperação"}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6">
            <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Acesso restrito</AlertTitle>
              <AlertDescription>
                Para acessar esta plataforma, você precisa de uma conta autorizada. Se você não tem acesso, entre em contato com o administrador do
                seu tenant.
              </AlertDescription>
            </Alert>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                key="social-login"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
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
                    Google
                  </Button>
                  <Button variant="outline" disabled={isLoading} className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                      <path fill="#F25022" d="M22 22H3V3h19v19z" />
                      <path fill="#00A4EF" d="M45 22H26V3h19v19z" />
                      <path fill="#7FBA00" d="M45 45H26V26h19v19z" />
                      <path fill="#FFB900" d="M22 45H3V26h19v19z" />
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitLogin(handleLogin)}
                className="space-y-4 mt-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email" disabled={isLoading} {...loginRegister("email")} />
                  {loginErrors.email && <p className="text-sm text-destructive mt-1">{String(loginErrors.email.message)}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button variant="link" className="px-0 font-normal text-xs" onClick={() => setStep(1)} type="button">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...loginRegister("password")}
                  />
                  {loginErrors.password && <p className="text-sm text-destructive mt-1">{String(loginErrors.password.message)}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar de mim
                  </Label>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline">
                      Registre-se agora
                    </Link>
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="reset-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitReset(handleForgotPassword)}
                className="space-y-4 mt-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="emailToReset">Email</Label>
                  <Input id="emailToReset" type="email" placeholder="seu@email.com" disabled={isLoading} {...resetRegister("emailToReset")} />
                  {resetErrors.emailToReset && <p className="text-sm text-destructive mt-1">{String(resetErrors.emailToReset.message)}</p>}
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar instruções"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <Button variant="link" className="p-0 font-normal" onClick={() => setStep(0)} type="button">
                    Voltar para o login
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <motion.div
          className="h-full flex items-center justify-center bg-muted m-10 rounded-xl overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center p-8">
            <motion.h1
              className="text-5xl font-bold text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Bem-vindo à sua plataforma de trabalho
            </motion.h1>

            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.8 }}>
              <Image className="object-cover w-4/5 mx-auto" src="/LoginHero.png" alt="Imagem ilustrativa da plataforma" width={1920} height={1080} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Toaster />
    </div>
  );
}
