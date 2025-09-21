"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: zod_1.z.string().email('Email invalide'),
    age: zod_1.z.number().min(0, 'L\'âge doit être positif').optional(),
});
exports.UpdateUserSchema = exports.CreateUserSchema.partial();
exports.UserSchema = exports.CreateUserSchema.extend({
    id: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
//# sourceMappingURL=user.schema.js.map