// src/trpc/config/trpc-config.ts
import { initTRPC } from '@trpc/server';
import { Context } from './context';

// Initialisation tRPC avec le contexte
export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        httpStatus: shape.data.httpStatus,
      },
    };
  },
});

// Export des utilitaires de base
export const router = t.router;
export const middleware = t.middleware;
export const baseProcedure = t.procedure;
