// src/trpc/procedures/base-procedures.ts
import { baseProcedure } from '../config/trpc-config';
import {
  isAuthenticated,
  withLogging,
  withRateLimit,
  isAdmin,
} from '../config/middlewares';

// Procédure publique (sans authentification)
export const publicProcedure = baseProcedure;

// Procédure publique avec logging
export const publicProcedureWithLogging = baseProcedure.use(withLogging);

// Procédure publique avec rate limiting
export const publicProcedureWithRateLimit = baseProcedure.use(withRateLimit);

// Procédure protégée (authentification requise)
export const protectedProcedure = baseProcedure.use(isAuthenticated);

// Procédure protégée avec logging
export const protectedProcedureWithLogging = baseProcedure
  .use(withLogging)
  .use(isAuthenticated);

// Procédure admin (authentification + droits admin)
export const adminProcedure = baseProcedure.use(isAuthenticated).use(isAdmin);

// Procédure complète (tous les middlewares)
export const fullProcedure = baseProcedure
  .use(withLogging)
  .use(withRateLimit)
  .use(isAuthenticated);

// Aliases pour la compatibilité avec votre code existant
export const guestProcedure = publicProcedure;
export const authenticatedProcedure = protectedProcedure;
