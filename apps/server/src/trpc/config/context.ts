// src/trpc/config/context.ts
import { PrismaClient, User } from '../../../prisma/generated/prisma/client';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  let user: null | Omit<User, 'password'> = null;

  // Récupération du token depuis les cookies OU header Authorization
  let token: string | undefined;

  // 1. Essayer depuis les cookies
  token = req.cookies?.['auth_token'] as string | undefined;

  // 2. Si pas de cookie, essayer depuis l'header Authorization
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      // Hydratation de l'utilisateur depuis la DB Prisma
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (dbUser) {
        user = dbUser;
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      // JWT invalide ou expiré → user reste null
    }
  }

  return {
    req,
    res,
    prisma,
    user,
    // Informations supplémentaires utiles
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
