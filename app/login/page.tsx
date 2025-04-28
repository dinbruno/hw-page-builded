import { useLoginPage } from "./components/login.model";
import { LoginView } from "./components/login.view";
import LoginLoadingAdvanced from "./components/login.loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Faça login para acessar sua conta e gerenciar suas páginas.",
  openGraph: {
    title: "Login",
    description: "Faça login para acessar sua conta e gerenciar suas páginas.",
    type: "website",
  },
};

export default function LoginPage() {
  const loginProps = useLoginPage();

  if (loginProps.isInitialLoading) {
    return <LoginLoadingAdvanced workspaceInfo={loginProps.workspaceInfo} />;
  }

  return <LoginView {...loginProps} />;
}
