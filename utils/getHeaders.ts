import { getAuthToken } from "./getAuth";

export function getHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User token is required for API operations");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
