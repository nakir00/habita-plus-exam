// src/trpc/index.ts
// Configuration
export * from './config/context';
export * from './config/trpc-config';
export * from './config/middlewares';

// Procédures
export * from './procedures/base-procedures';

// Routers
export { authRouter } from './routers/auth';

// Router principal
export { appRouter } from './app-router';
export type { AppRouter } from './app-router';

// Utils
export { prisma } from './config/context';
