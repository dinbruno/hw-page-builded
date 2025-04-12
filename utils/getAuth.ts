export const getAuthToken = () => {
  try {
    // Apenas implementação para o lado do cliente
    if (typeof document !== "undefined") {
      const authCookie = document.cookie.split("; ").find((row) => row.startsWith("authToken="));

      // Se não encontrar nos cookies, tenta no localStorage como backup
      if (!authCookie && typeof localStorage !== "undefined") {
        return localStorage.getItem("authToken") || undefined;
      }

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
        return localStorage.getItem("tenantId") || undefined;
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

/**
 * Define o token de autenticação nos cookies e localStorage
 * @param token Token de autenticação
 * @param expires Dias para expiração do cookie (padrão: 7)
 */
export const setAuthToken = (token: string, expires = 7) => {
  try {
    // Definir nos cookies
    if (typeof document !== "undefined") {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      document.cookie = `authToken=${token}; expires=${date.toUTCString()}; path=/; secure; samesite=strict`;
    }

    // Definir no localStorage como backup
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};

/**
 * Define o ID do tenant nos cookies e localStorage
 * @param tenantId ID do tenant
 * @param expires Dias para expiração do cookie (padrão: 7)
 */
export const setTenantId = (tenantId: string, expires = 7) => {
  try {
    // Definir nos cookies
    if (typeof document !== "undefined") {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      document.cookie = `tenantId=${tenantId}; expires=${date.toUTCString()}; path=/; secure; samesite=strict`;
    }

    // Definir no localStorage como backup
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("tenantId", tenantId);
    }
  } catch (error) {
    console.error("Error setting tenant ID:", error);
  }
};

/**
 * Limpa os dados de autenticação (logout)
 */
export const clearAuth = () => {
  try {
    // Limpar cookies
    if (typeof document !== "undefined") {
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "tenantId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Limpar localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tenantId");
    }
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};
