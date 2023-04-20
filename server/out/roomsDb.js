"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomInfo = void 0;
const Room_1 = __importDefault(require("./Room"));
const rooms = new Map();
rooms.set('room-0', new Room_1.default({ name: 'room-0', isPrivate: false }));
rooms.set('room-1', new Room_1.default({ name: 'room-1', isPrivate: false }));
rooms.set('room-2', new Room_1.default({ name: 'room-2', isPrivate: true, password: 'password' }));
function getRoomInfo() {
    return Array.from(rooms, room => room[1].getRoomInfo());
}
exports.getRoomInfo = getRoomInfo;
exports.default = rooms;
