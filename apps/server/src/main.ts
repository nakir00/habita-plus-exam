// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as trpcExpress from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import { appRouter, createContext } from './trpc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares globaux
  app.use(cookieParser()); // Important pour lire les cookies JWT

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend React/Next.js
    ],
    credentials: true, // Important pour les cookies et l'auth
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Configuration tRPC
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }) => createContext({ req, res }), // Utilise la fonction complète
      onError: ({ error, path, input }) => {
        console.error(`❌ tRPC Error on path: ${path}`, {
          error: error.message,
          input,
          code: error.code,
          stack:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
      },
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 NestJS Server running on: http://localhost:${port}`);
  console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`);
  console.log(`🔗 Health check: http://localhost:${port}/trpc/public.health`);
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
