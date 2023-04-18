import { z } from 'zod';

const newPublicRoomSchema = z.object({
    name: z.string().min(3).max(7).trim(),
    isPrivate: z.literal(false),
}).strict();

const newPrivateRoomSchema = z.object({
    name: z.string().min(3).max(7).trim(),
    isPrivate: z.literal(true),
    password: z.string().min(0).max(10).trim()
}).strict();

export const newRoomSchema = z.discriminatedUnion("isPrivate", [
        newPublicRoomSchema,
        newPrivateRoomSchema
    ]);