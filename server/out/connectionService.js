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
function changeGameState(roomName, playerName, changedSquereIndex) {
    const room = roomsDb_1.default.get(roomName);
    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }
    const newState = room.changeGameState(playerName, changedSquereIndex);
    if (newState instanceof Error) {
        return { error: newState.message };
    }
    if (room.winner) {
        return { event: 'GAME_OVER', winner: room.winner,
            turn: room.turn, boardState: room.boardState };
    }
    console.log('room after:', room);
    return newState;
}
exports.changeGameState = changeGameState;
function createRoom(newRoomParams) {
    const validated = validators_1.NewRoomSchema.safeParse(newRoomParams);
    if (!validated.success) {
        return { status: 400, issues: validated.error.issues };
    }
    const newRoom = createNewRoom(validated.data);
    return newRoom instanceof Error
        ? { status: 400, error: newRoom.message }
        : { status: 201, newRoomName: newRoom.name };
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
    /* const removedPlayer =  */ room.removePlayer(playerName);
    return { status: 200 };
}
exports.leaveRoom = leaveRoom;
