import * as z from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Título muito curto." })
    .max(140, { error: "Título muito longo." }),
  body: z
    .string()
    .trim()
    .min(10, { error: "Escreva um pouco mais." })
    .max(20000, { error: "Texto muito longo." }),
  embedUrl: z.url({ error: "Link inválido — cole a URL completa." }).optional(),
});
