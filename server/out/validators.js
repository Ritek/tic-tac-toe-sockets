"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRoomSchema = void 0;
const zod_1 = require("zod");
const newPublicRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(7).trim(),
    isPrivate: zod_1.z.literal(false),
}).strict();
const newPrivateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(7).trim(),
    isPrivate: zod_1.z.literal(true),
    password: zod_1.z.string().min(0).max(10).trim()
}).strict();
exports.newRoomSchema = zod_1.z.discriminatedUnion("isPrivate", [
    newPublicRoomSchema,
    newPrivateRoomSchema
]);
