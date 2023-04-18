import { z } from 'zod';

const newPublicRoomSchema = z.object({
    name: z.string().min(3).max(7).trim(),
    isPrivate: z.literal(false),
    password: z.undefined()
});

const newPrivateRoomSchema = z.object({
    name: z.string().min(3).max(7).trim(),
    isPrivate: z.literal(true),
    password: z.string().min(3).max(10).trim()
});

export const newRoomSchema = z.union([
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

    