import { stackServerApp } from "@/lib/stack-auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // --- INÍCIO DA MODIFICAÇÃO ---
  // Adicione esta linha para pular toda a lógica de autenticação durante os testes.
  return NextResponse.next();
  // --- FIM DA MODIFICAÇÃO ---

  /* --- CÓDIGO ORIGINAL COMENTADO ---

  const { pathname } = req.nextUrl;

  // Ignora rotas de API e arquivos estáticos
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  
  const user = await stackServerApp.getUser(req);

  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPage = pathname.startsWith("/studio");

  // Se não estiver logado e tentar acessar uma rota protegida, redirecione para o login
  if (!user && isProtectedPage) {
    const loginUrl = new URL("/auth/signin", req.url);
    loginUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se estiver logado e tentar acessar uma página de autenticação, redirecione para o studio
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/studio", req.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)',
  ],
};