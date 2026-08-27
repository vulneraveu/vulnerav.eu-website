import * as z from "zod";

export const ConfessionSchema = z.object({
  body: z
    .string()
    .trim()
    .min(3, { error: "Escreva um pouco mais." })
    .max(500, { error: "Máximo de 500 caracteres." }),
});

export const ConfessionCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: "Escreva um comentário." })
    .max(500, { error: "Máximo de 500 caracteres." }),
});
