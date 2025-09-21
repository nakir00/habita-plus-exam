// src/trpc/config/middlewares.ts
import { TRPCError } from '@trpc/server';
import { middleware } from './trpc-config';

// Middleware d'authentification
export const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // TypeScript sait maintenant que user n'est pas null
    },
  });
});

// Middleware de logging (optionnel)
export const withLogging = middleware(({ path, type, next }) => {
  const start = Date.now();

  return next({
    ctx: {},
  }).then((result) => {
    const duration = Date.now() - start;
    console.log(`[tRPC] ${type} ${path} - ${duration}ms`);
    return result;
  });
});

// Middleware de rate limiting (exemple)
export const withRateLimit = middleware(async ({ next }) => {
  // Ici vous pourriez implémenter une logique de rate limiting
  // basée sur ctx.ip, ctx.user.id, etc.

  // Pour l'exemple, on passe juste au suivant
  return next();
});

// Middleware pour les administrateurs (exemple)
export const isAdmin = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  // Ici vous pourriez vérifier si l'utilisateur est admin
  // Par exemple, vérifier un champ 'role' dans la DB
  // if (ctx.user.role !== 'admin') {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: 'Admin access required',
  //   });
  // }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
