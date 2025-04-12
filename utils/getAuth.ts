export const getAuthToken = () => {
  try {
    // Apenas implementação para o lado do cliente
    if (typeof document !== "undefined") {
      const authCookie = document.cookie.split("; ").find((row) => row.startsWith("authToken="));

      return authCookie ? authCookie.split("=")[1] : undefined;
    }

    // Caso seja chamado durante o SSG, retorna undefined
    return undefined;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return undefined;
  }
};

export const getTenantId = () => {
  try {
    // Apenas implementação para o lado do cliente
    if (typeof document !== "undefined") {
      const tenantCookie = document.cookie.split("; ").find((row) => row.startsWith("tenantId="));

      // Se não encontrar nos cookies, tenta no localStorage como backup
      if (!tenantCookie && typeof localStorage !== "undefined") {
        return localStorage.getItem("tenantId");
      }

      return tenantCookie ? tenantCookie.split("=")[1] : undefined;
    }

    // Caso seja chamado durante o SSG, retorna undefined
    return undefined;
  } catch (error) {
    console.error("Error getting tenant ID:", error);
    return undefined;
  }
};
