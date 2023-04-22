"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewRoomSchema = void 0;
const zod_1 = require("zod");
const RoomNameSchema = zod_1.z.string().min(3).max(7).trim();
const RoomPasswordSchema = zod_1.z.string().min(3).max(10).trim();
const NewPublicRoomSchema = zod_1.z.object({
    name: RoomNameSchema,
    isPrivate: zod_1.z.literal(false),
    password: zod_1.z.undefined()
});
const NewPrivateRoomSchema = zod_1.z.object({
    name: RoomNameSchema,
    isPrivate: zod_1.z.literal(true),
    password: RoomPasswordSchema
});
exports.NewRoomSchema = zod_1.z.union([
    NewPublicRoomSchema,
    NewPrivateRoomSchema
]);
const MoveSchema = zod_1.z.object({
    event: zod_1.z.literal('Move'),
    changedSquereIndex: zod_1.z.number().min(0).max(9)
});
const ChatMessageSchema = zod_1.z.object({
    author: zod_1.z.string().min(3).max(20),
    message: zod_1.z.string().min(1).max(20)
});
/* const JoinRoomSchema = z.union([
    z.object({ name: RoomNameSchema }),
    z.object({ name: RoomNameSchema, password: RoomPasswordSchema }),
]); */
