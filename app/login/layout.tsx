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

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
