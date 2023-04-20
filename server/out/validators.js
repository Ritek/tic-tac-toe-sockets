"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewRoomParams = exports.NewRoomSchema = void 0;
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
function validateNewRoomParams(newRoom) {
}
exports.validateNewRoomParams = validateNewRoomParams;
const JoinRoomSchema = zod_1.z.union([
    zod_1.z.object({ name: RoomNameSchema }),
    zod_1.z.object({ name: RoomNameSchema, password: RoomPasswordSchema }),
]);
