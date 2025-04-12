import axios from "axios";
import { getAuthToken, getTenantId } from "../utils/getAuth";

// Define API base URLs based on environment
const isLocal = process.env.NODE_ENV === "development";

// Auth API configuration
export const authApi = axios.create({
  baseURL: isLocal ? process.env.NEXT_PUBLIC_AUTH_API_URL : process.env.NEXT_PUBLIC_AUTH_API_URL_PROD,
});

// Core API configuration
export const api = axios.create({
  baseURL: isLocal ? process.env.API_CORE_URL : process.env.API_CORE_URL_PROD,
});

// Interceptor para adicionar automaticamente o token e tenant ID
api.interceptors.request.use(
  (config) => {
    // Obter token de autenticação
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Obter e adicionar tenant ID - isso é OBRIGATÓRIO para todas as requisições
    const tenantId = getTenantId();
    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    } else {
      console.warn("API: Tenant ID não encontrado, mas é obrigatório para a maioria das operações.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Também adicionar o interceptor na API de autenticação para operações pós-login
authApi.interceptors.request.use(
  (config) => {
    // Para rotas que não são de login/registro, adicionar o token e tenant ID
    if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
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
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
