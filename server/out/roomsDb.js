"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrivateRoom = exports.createPublicRoom = void 0;
const Room2_1 = __importDefault(require("./Room2"));
const types_1 = require("./types");
const rooms = new Map();
rooms.set('room-0', new Room2_1.default('room-0', false));
rooms.set('room-1', new Room2_1.default('room-1', false));
rooms.set('room-2', new Room2_1.default('room-2', true, 'password'));
function createPublicRoom(name) {
    if (rooms.get(name)) {
        return new types_1.NameDuplicateException("Room with provided name already exisits!");
    }
    rooms.set(name, new Room2_1.default(name, false));
    return new Room2_1.default(name, false);
}
exports.createPublicRoom = createPublicRoom;
function createPrivateRoom(name, password) {
    if (rooms.get(name)) {
        return new types_1.NameDuplicateException("Room with provided name already exisits!");
    }
    rooms.set(name, new Room2_1.default(name, true, password));
    return new Room2_1.default(name, true, password);
}
exports.createPrivateRoom = createPrivateRoom;
exports.default = rooms;
