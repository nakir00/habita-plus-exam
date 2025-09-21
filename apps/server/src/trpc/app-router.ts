// src/trpc/app-router.ts
import { z } from 'zod';

import { router } from './config/trpc-config';
import { authRouter } from './routers/auth';
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from './procedures/base-procedures';

export const appRouter = router({
  // Routes d'authentification
  auth: authRouter,

  // Routes publiques
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({
      message: `Hello ${input.name || 'World'} from NestJS + tRPC! 👋`,
    })),

  status: publicProcedure.query(({ ctx }) => ({
    authenticated: !!ctx.user,
    user: ctx.user
      ? {
          id: ctx.user.id,
          email: ctx.user.email,
          name: ctx.user.name,
        }
      : null,
    timestamp: new Date().toISOString(),
    framework: 'NestJS',
  })),

  // Routes protégées
  protected: router({
    profile: protectedProcedure.query(({ ctx }) => ({
      user: ctx.user,
      message: `Welcome back, ${ctx.user.name}! (via NestJS)`,
    })),

    users: protectedProcedure.query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        users,
        count: users.length,
        framework: 'NestJS + Prisma',
      };
    }),
  }),

  // Routes admin (exemple)
  admin: router({
    deleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.prisma.user.delete({
          where: { id: input.userId },
        });

        return {
          success: true,
          message: 'User deleted successfully',
        };
      }),

    stats: adminProcedure.query(async ({ ctx }) => {
      const totalUsers = await ctx.prisma.user.count();

      return {
        totalUsers,
        timestamp: new Date().toISOString(),
        framework: 'NestJS',
      };
    }),
  }),

  // Routes publiques
  public: router({
    health: publicProcedure.query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      framework: 'NestJS + tRPC',
    })),

    stats: publicProcedure.query(async ({ ctx }) => {
      const userCount = await ctx.prisma.user.count();

      return {
        totalUsers: userCount,
        timestamp: new Date().toISOString(),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
