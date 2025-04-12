import axios from "axios";
import { getAuthToken, getTenantId } from "../utils/getAuth";

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL_PROD,
});

// API principal que requer autenticação
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CORE_URL_LOCAL,
});

// Interceptor para adicionar automaticamente o token e tenant ID
api.interceptors.request.use(
  (config) => {
    // Obter token de autenticação
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Obter e adicionar tenant ID
    const tenantId = getTenantId();
    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
