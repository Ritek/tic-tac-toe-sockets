"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const Room_1 = __importDefault(require("./Room"));
const PORT = 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173"
    }
});
const rooms = new Map();
rooms.set('room-0', new Room_1.default('room-0', false));
rooms.set('room-1', new Room_1.default('room-1', false));
rooms.set('room-2', new Room_1.default('room-2', true));
function findRoomToJoin() {
    const temp = Array.from(rooms.values()).find(room => room.canJoinRoom());
    return temp ? temp : findEmptyRoom();
}
function findEmptyRoom() {
    return Array.from(rooms.values()).find(room => !room.playerX && !room.playerO);
}
io.on("connection", (socket) => {
    // socket.send({event: 'chat-message', message: `Welcome user ${socket.id}`});
    io.to(socket.id).emit('chat-message', { author: 'SYSTEM', message: `Welcome user ${socket.id}` });
    const room = findRoomToJoin();
    if (!room)
        socket.send({ event: 'rooms full', message: `All rooms are full!` });
    else {
        room.addPlayer(socket.id);
        socket.join(room.name);
        io.to(socket.id).emit('chat-message', { author: 'SYSTEM', message: `You have joined the room ${room.name}!` });
        io.to(socket.id).emit('move-made', { event: 'MOVE', turn: room.turn, gameState: room.gameState });
        console.log(rooms);
    }
    // messages
    socket.on('chat-message', (arg) => {
        if (room)
            io.in(room.name).emit('chat-message', { author: socket.id, message: arg.message });
    });
    socket.on('move-made', (arg) => {
        console.log('move-made', arg);
        if (!room)
            return socket.send({ event: 'ERROR', message: `Not connected to any room!` });
        if (room.twoPlayerPresent() && room.isPlayersTurn(socket.id)) {
            room.changeGameState(socket.id, arg.change);
            if (room.checkGameOver()) {
                return io.in(`${room.name}`).emit('move-made', {
                    event: 'GAME_OVER', winner: room.winner, turn: room.turn, gameState: room.gameState
                });
            }
            console.log('Before sending move-made');
            return io.in(`${room.name}`).emit('move-made', {
                event: 'MOVE', turn: room.turn, gameState: room.gameState
            });
        }
    });
    // disconnect
    socket.on('disconnect', (arg) => {
        console.log(`user ${socket.id} disconnect`, { arg });
    });
});
io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
io.of("/").adapter.on("leave-room", (room, id) => {
    var _a, _b, _c;
    (_a = rooms.get(room)) === null || _a === void 0 ? void 0 : _a.removePlayer(id);
    if ((_b = rooms.get(room)) === null || _b === void 0 ? void 0 : _b.isEmpty())
        (_c = rooms.get(room)) === null || _c === void 0 ? void 0 : _c.resetGameState();
    console.log(`user ${id} left the room ${room}`);
});
io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
