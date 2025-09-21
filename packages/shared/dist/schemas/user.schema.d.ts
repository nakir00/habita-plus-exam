import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    age: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    age?: number | undefined;
}, {
    name: string;
    email: string;
    age?: number | undefined;
}>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    age?: number | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    age?: number | undefined;
}>;
export declare const UserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    age: z.ZodOptional<z.ZodNumber>;
} & {
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    age?: number | undefined;
}, {
    name: string;
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    age?: number | undefined;
}>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof UserSchema>;
//# sourceMappingURL=user.schema.d.ts.map