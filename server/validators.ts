import { z } from 'zod';

const RoomNameSchema = z.string().min(3).max(7).trim();
const RoomPasswordSchema = z.string().min(3).max(10).trim();

const NewPublicRoomSchema = z.object({
    name: RoomNameSchema,
    isPrivate: z.literal(false),
    password: z.undefined()
});

const NewPrivateRoomSchema = z.object({
    name: RoomNameSchema,
    isPrivate: z.literal(true),
    password: RoomPasswordSchema
});

export const NewRoomSchema = z.union([
    NewPublicRoomSchema,
    NewPrivateRoomSchema
]);

const MoveSchema = z.object({
    event: z.literal('Move'),
    changedSquereIndex: z.number().min(0).max(9)
});

const ChatMessageSchema = z.object({
    author: z.string().min(3).max(20),
    message: z.string().min(1).max(20)
});

export type NewRoom = z.infer<typeof NewRoomSchema>;
export type JoinRoom = Pick<NewRoom, 'name' | 'password'>
export type Move = z.infer<typeof MoveSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/* const JoinRoomSchema = z.union([
    z.object({ name: RoomNameSchema }),
    z.object({ name: RoomNameSchema, password: RoomPasswordSchema }),
]); */
