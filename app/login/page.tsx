"use client";

import { useLoginPage } from "./components/login.model";
import { LoginView } from "./components/login.view";

export default function LoginPage() {
  const loginProps = useLoginPage();

  return <LoginView {...loginProps} />;
}
