import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // Configurado no auth.ts para evitar dependências circulares
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Redirecionar para dashboard se já estiver logado e tentar acessar login
        if (nextUrl.pathname === '/login') {
             return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }
      return true;
    },
    session({ session, token }) {
        if (session.user && token.sub) {
            session.user.id = token.sub;
        }
        return session;
    }
  },
} satisfies NextAuthConfig;
