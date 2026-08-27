import * as z from "zod";

export const SignupSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(2, { error: "Apelido deve ter pelo menos 2 caracteres." })
      .max(30, { error: "Apelido muito longo." })
      .regex(/^[\w. -]+$/, { error: "Use só letras, números, espaço, ponto, traço ou underline." }),
    email: z.email({ error: "E-mail inválido." }).trim(),
    password: z
      .string()
      .min(8, { error: "A senha deve ter pelo menos 8 caracteres." })
      .regex(/[a-zA-Z]/, { error: "A senha deve conter ao menos uma letra." })
      .regex(/[0-9]/, { error: "A senha deve conter ao menos um número." }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  });

export const LoginSchema = z.object({
  email: z.email({ error: "E-mail inválido." }).trim(),
  password: z.string().min(1, { error: "Informe a senha." }),
});
