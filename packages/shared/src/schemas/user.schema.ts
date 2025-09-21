import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  age: z.number().min(0, 'L\'âge doit être positif').optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserSchema = CreateUserSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof UserSchema>;