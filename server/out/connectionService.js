"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.changeGameState = exports.createPrivateRoom = exports.createPublicRoom = void 0;
const roomsDb_1 = __importDefault(require("./roomsDb"));
const Room2_1 = __importDefault(require("./Room2"));
const types_1 = require("./types");
const validators_1 = require("./validators");
const zod_1 = require("zod");
function createPublicRoom(name) {
    if (roomsDb_1.default.get(name)) {
        return new types_1.NameDuplicateException("Room with provided name already exisits!");
    }
    roomsDb_1.default.set(name, new Room2_1.default(name, false));
    return new Room2_1.default(name, false);
}
exports.createPublicRoom = createPublicRoom;
function createPrivateRoom(name, password) {
    if (roomsDb_1.default.get(name)) {
        return new types_1.NameDuplicateException("Room with provided name already exisits!");
    }
    roomsDb_1.default.set(name, new Room2_1.default(name, true, password));
    return new Room2_1.default(name, true, password);
}
exports.createPrivateRoom = createPrivateRoom;
function changeGameState(roomName, playerName, changedSquereIndex) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }
    const newState = room.changeGameState(playerName, changedSquereIndex);
    if (newState instanceof Error) {
        return { error: newState.message };
    }
    // check for winner
    return newState;
}
exports.changeGameState = changeGameState;
function createRoom(name, isPrivate, password) {
    try {
        validators_1.newRoomSchema.parse({ name, isPrivate, password });
    }
    catch (error) {
        console.log(error.format());
        if (error instanceof zod_1.z.ZodError) {
            return { status: 400, error: error.toString() };
        }
    }
    const newRoom = isPrivate && password
        ? createPrivateRoom(name, password)
        : createPublicRoom(name);
    if (newRoom instanceof Error) {
        return { status: 400, error: newRoom.message };
    }
    return { status: 201, newRoom };
}
exports.createRoom = createRoom;
function joinRoom(roomName, playerName, password) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }
    const newPlayer = room.addPlayer(playerName, password);
    if (newPlayer instanceof Error) {
        return { status: 400, error: newPlayer.message };
    }
    return { status: 200, newPlayer };
}
exports.joinRoom = joinRoom;
function leaveRoom(roomName, playerName) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }
    const removedPlayer = room.removePlayer(playerName);
    return { status: 200 };
}
exports.leaveRoom = leaveRoom;
