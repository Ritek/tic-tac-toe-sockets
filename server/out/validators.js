"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRoomSchema = void 0;
const zod_1 = require("zod");
const newPublicRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(7).trim(),
    isPrivate: zod_1.z.literal(false),
    password: zod_1.z.undefined()
});
const newPrivateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(7).trim(),
    isPrivate: zod_1.z.literal(true),
    password: zod_1.z.string().min(3).max(10).trim()
});
exports.newRoomSchema = zod_1.z.union([
    newPublicRoomSchema,
    newPrivateRoomSchema
]);
// export const newRoomSchema = z.object({
//     name: z.string(),
//     isPrivate: z.boolean(),
//     password: z.string().optional()
// }).refine(schema => schema.isPrivate ? schema.password : true, {
//     params: {password: true}, message: 'Private room requires password'
// });
