import { z, ZodError } from 'zod';

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

export type NewRoom = z.infer<typeof NewRoomSchema>;
export function validateNewRoomParams(newRoom: NewRoom) {

}


const JoinRoomSchema = z.union([
    z.object({ name: RoomNameSchema }),
    z.object({ name: RoomNameSchema, password: RoomPasswordSchema }),
]);
