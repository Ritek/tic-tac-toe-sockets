"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.changeGameState = void 0;
const roomsDb_1 = __importDefault(require("./roomsDb"));
const Room_1 = __importDefault(require("./Room"));
const types_1 = require("./types");
const validators_1 = require("./validators");
function createNewRoom(newRoomParams) {
    if (roomsDb_1.default.get(newRoomParams.name)) {
        return new types_1.NameDuplicateException("Room with provided name already exisits!");
    }
    const newRoom = new Room_1.default(newRoomParams);
    roomsDb_1.default.set(newRoom.name, newRoom);
    return newRoom;
}
function changeGameState(roomName, userID, changedSquereIndex) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }
    const newState = room.changeGameState(userID, changedSquereIndex);
    if (newState instanceof Error) {
        return { error: newState.message };
    }
    if (room.winner) {
        return Object.assign({ event: 'GAME_OVER', winner: room.winner }, newState);
    }
    return newState;
}
exports.changeGameState = changeGameState;
function createRoom(newRoomParams) {
    const validated = validators_1.NewRoomSchema.safeParse(newRoomParams);
    if (!validated.success) {
        return { status: 400, error: validated.error.issues };
    }
    const newRoom = createNewRoom(validated.data);
    return newRoom instanceof Error
        ? { status: 400, error: newRoom.message }
        : { status: 201, newRoomName: newRoom.name };
}
exports.createRoom = createRoom;
function joinRoom(roomName, playerID, username, roomPassword) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }
    const newPlayer = room.addPlayer(playerID, username, roomPassword);
    return newPlayer instanceof Error
        ? { status: 400, error: newPlayer.message }
        : { status: 200, newPlayer, gameState: room.getGameState() };
}
exports.joinRoom = joinRoom;
function leaveRoom(roomName, playerID) {
    const room = roomsDb_1.default.get(roomName);
    console.log('room', room);
    if (!room) {
        console.log('Room of provided name does not exist!');
        return { status: 400, error: 'Room of provided name does not exist!' };
    }
    const x = room.removePlayer(playerID);
    console.log(x);
    return { status: 200 };
}
exports.leaveRoom = leaveRoom;
