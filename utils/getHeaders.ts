import { getAuthToken, getTenantId } from "./getAuth";

export function getHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User token is required for API operations");
  }

  const tenantId = getTenantId();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Adicionar o tenant ID aos cabeçalhos se estiver disponível
  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }

  return headers;
}
