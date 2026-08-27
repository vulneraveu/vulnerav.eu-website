import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, signSession, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

// Checagem otimista: só lê o cookie, nunca bate no banco aqui (proxy roda em
// toda rota, inclusive prefetch). A checagem "de verdade" (RBAC por
// permissão) acontece no DAL, perto do dado — ver lib/dal.ts.
const PROTECTED_PREFIXES = ["/painel", "/escrever", "/admin"];
const AUTH_ROUTES = ["/login", "/registro"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  const response = NextResponse.next();

  // Sliding session: qualquer request autenticado renova o cookie por mais
  // 1h a partir de agora. Sem atividade por 1h, o token expira de verdade.
  if (session?.userId) {
    const { token: freshToken, expiresAt } = await signSession(session.userId);
    response.cookies.set(SESSION_COOKIE, freshToken, { ...SESSION_COOKIE_OPTIONS, expires: expiresAt });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
