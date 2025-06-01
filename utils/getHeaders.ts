import { getAuthToken, getTenantId } from "./getAuth";

export function getHeaders(serverToken?: string, serverTenantId?: string): HeadersInit {
  console.log("getHeaders chamado com tokens:", { serverToken: !!serverToken, serverTenantId: !!serverTenantId });

  // Handle server-side scenario when tokens are passed in
  if (serverToken) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serverToken}`,
    };

    if (serverTenantId) {
      headers["x-tenant-id"] = serverTenantId;
    }

    console.log("Usando headers do servidor:", headers);
    return headers;
  }

  // Check if we're in a build environment (SSG/SSR without client context)
  if (typeof window === "undefined") {
    console.warn("Build environment detected - usando headers básicos");
    return {
      "Content-Type": "application/json",
    };
  }

  // Client-side scenario
  let token;
  try {
    token = getAuthToken();
  } catch (error) {
    console.error("Erro ao obter token do cliente:", error);
    // Durante development/build, pode não haver token - retornar headers básicos
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
      console.warn("Ambiente de desenvolvimento/build - usando headers básicos");
      return {
        "Content-Type": "application/json",
      };
    }
    throw new Error("Falha ao obter token de autenticação do cliente");
  }

  if (!token) {
    console.error("Token do cliente não encontrado");
    // Durante development/build, pode não haver token - retornar headers básicos
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
      console.warn("Token não encontrado - usando headers básicos");
      return {
        "Content-Type": "application/json",
      };
    }
    throw new Error("User token is required for API operations");
  }

  let tenantId;
  try {
    tenantId = getTenantId();
  } catch (error) {
    console.error("Erro ao obter tenantId do cliente:", error);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Adicionar o tenant ID aos cabeçalhos se estiver disponível
  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }

  console.log("Usando headers do cliente:", headers);
  return headers;
}
