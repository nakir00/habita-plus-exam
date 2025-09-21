// src/trpc/routers/auth.ts
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { router } from '../config/trpc-config';
import {
  publicProcedure,
  protectedProcedure,
  publicProcedureWithRateLimit,
} from '../procedures/base-procedures';

export const authRouter = router({
  // Route de login - retourne le token au lieu de set-cookie
  login: publicProcedureWithRateLimit
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Vérifier si l'utilisateur existe
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Email ou mot de passe incorrect',
        });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Email ou mot de passe incorrect',
        });
      }

      // Créer le token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }, // Expire dans 7 jours
      );

      // Retourner le token dans la réponse (pas de cookie)
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
        },
      };
    }),

  // Route de register
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        age: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name, age } = input;

      // Vérifier si l'email existe déjà
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          age,
        },
      });

      // Créer le token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
        },
      };
    }),

  // Route pour vérifier le token (optionnel)
  me: publicProcedure.query(async ({ ctx }) => {
    // Si l'utilisateur n'est pas connecté
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
    }

    // Récupérer les infos utilisateur depuis la base
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Utilisateur introuvable',
      });
    }

    return user;
  }),

  // Déconnexion
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie('auth_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }),

  // Profil utilisateur
  profile: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
      age: ctx.user.age,
      createdAt: ctx.user.createdAt,
      updatedAt: ctx.user.updatedAt,
    };
  }),

  // Mettre à jour le profil
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        age: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...input,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully',
      };
    }),
});
