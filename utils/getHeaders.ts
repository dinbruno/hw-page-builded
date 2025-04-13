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

  // Client-side scenario
  let token;
  try {
    token = getAuthToken();
  } catch (error) {
    console.error("Erro ao obter token do cliente:", error);
    throw new Error("Falha ao obter token de autenticação do cliente");
  }

  if (!token) {
    console.error("Token do cliente não encontrado");
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
