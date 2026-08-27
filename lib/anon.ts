import "server-only";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";

const secretKey: string = process.env.SESSION_SECRET ?? "";
if (!secretKey) throw new Error("SESSION_SECRET não configurado");

// Identifica um visitante anônimo sem guardar o IP em si — só um hash,
// usado para dedup de reações (like/feel) e como sinal anti-abuso.
export async function getIpHash() {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  return createHmac("sha256", secretKey).update(ip).digest("hex");
}
