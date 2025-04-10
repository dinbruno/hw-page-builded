import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const resetSchema = z.object({
  emailToReset: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});
