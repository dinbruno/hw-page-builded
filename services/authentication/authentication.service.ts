const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

export interface AuthUser {
  uuid: string;
  email: string;
  name: string;
  photo: string;
}

export class AuthService {
  static async getCurrentUser(): Promise<AuthUser> {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`/api/auth/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error getCurrentUser: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to getCurrentUser: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    return data as AuthUser;
  }
}
