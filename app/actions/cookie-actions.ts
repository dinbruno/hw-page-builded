"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Define o cookie workspaceId
 * Esta é uma Server Action que pode ser chamada do lado do cliente ou servidor
 */
export async function setWorkspaceIdCookie(workspaceId: string) {
  cookies().set("workspaceId", workspaceId, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Revalidar a rota raiz para atualizar a página
  revalidatePath("/");

  return { success: true };
}
