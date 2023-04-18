"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.changeGameState = void 0;
const roomsDb_1 = __importStar(require("./roomsDb"));
// import { InvalidMoveException, NotAPLayerException } from './types';
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
/* export function changeGameState2(roomName: string, playerName: string, changedSquereIndex: number) {
    const room = rooms.get(roomName);

    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const newState = room.changeGameState(playerName, changedSquereIndex);

    if (newState instanceof InvalidMoveException || newState instanceof NotAPLayerException) {
        console.log(newState);
    };

    if (room.winner) {
        return { event: 'GAME-OVER', newState };
    }

    return { event: 'move-mage', newState };
} */
function createRoom(name, isPrivate, password) {
    // validate roomDetails
    const newRoom = isPrivate && password
        ? (0, roomsDb_1.createPrivateRoom)(name, password)
        : (0, roomsDb_1.createPublicRoom)(name);
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
