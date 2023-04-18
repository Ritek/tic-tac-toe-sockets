"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room2_1 = __importDefault(require("./Room2"));
const rooms = new Map();
rooms.set('room-0', new Room2_1.default('room-0', false));
rooms.set('room-1', new Room2_1.default('room-1', false));
rooms.set('room-2', new Room2_1.default('room-2', true, 'password'));
exports.default = rooms;
