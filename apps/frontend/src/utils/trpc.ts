import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/src/trpc"; // Adjust this path based on your project structure

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:5000/trpc", // backend NestJS

        headers() {
            const token = getAuthToken();
            
            return {
              'Content-Type': 'application/json',
              // Ajouter le Bearer Token si disponible
              ...(token && { 'Authorization': `Bearer ${token}` }),
            };
          },
          
          // Plus besoin de credentials pour Bearer Token
          fetch(url, options) {
            return fetch(url, {
              ...options,
              // credentials: 'include', // Retiré car on utilise Bearer Token
            });
          },
      }),
    ],
  });
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null; // SSR protection
  
  // Récupérer le token depuis localStorage
  return localStorage.getItem('auth_token');
}

export const authUtils = {
  // Sauvegarder le token après login
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  
  // Récupérer le token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  // Supprimer le token (logout)
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!authUtils.getToken();
  }
};
