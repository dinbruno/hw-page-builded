"use client";

import { useLoginPage } from "./components/login.model";
import { LoginView } from "./components/login.view";
import LoginLoadingAdvanced from "./components/login.loading";

export default function LoginPage() {
  const loginProps = useLoginPage();

  if (loginProps.isInitialLoading) {
    return <LoginLoadingAdvanced workspaceInfo={loginProps.workspaceInfo} />;
  }

  return <LoginView {...loginProps} />;
}
