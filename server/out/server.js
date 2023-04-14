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
app.get('/', (req, res) => {
    res.status(200).send([]);
});
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
setInterval(function () {
    io.emit('all-rooms', Array.from(rooms, room => room[1].getBasicInfo()));
}, 5000);
/* setInterval(function() {
  io.in('room-0').emit('chat-message', {author: 'System', message: 'test test'});
}, 3000); */
function findRoomToJoin() {
    const temp = Array.from(rooms.values()).find(room => room.canJoinRoom());
    return temp ? temp : findEmptyRoom();
}
function findEmptyRoom() {
    return Array.from(rooms.values()).find(room => !room.playerX && !room.playerO);
}
function changeCurrentGameState(arg, socket, room) {
    // console.log('move-made', arg);
    if (!room)
        return;
    // if (!room) return socket.emit('ERROR', {event: 'ERROR', message: `Not connected to any room!`});
    if (room.twoPlayerPresent() && room.isPlayersTurn(socket.id)) {
        room.changeGameState(socket.id, arg.change);
        if (room.checkGameOver()) {
            return io.in(`${room.name}`).emit('move-made', {
                event: 'GAME_OVER', winner: room.winner, turn: room.turn, gameState: room.gameState
            });
        }
        return io.in(`${room.name}`).emit('move-made', {
            event: 'move-made', turn: room.turn, gameState: room.gameState
        });
    }
}
function createRoom(room, callback) {
    if (!rooms.get(room.name)) {
        rooms.set(room.name, new Room_1.default(room.name, room.isPrivate));
        callback({ status: 201, newRoom: { name: room.name } });
    }
    else {
        callback({ status: 409, error: `Room with name '${room.name}' already exists!` });
    }
}
function joinRoom(socket, roomInfo, callback) {
    var _a;
    const foundRoom = rooms.get(roomInfo.name);
    if (!foundRoom) {
        return callback({ status: 404, error: `Room with name '${roomInfo.name}' doesn't exists!` });
    }
    if (foundRoom.twoPlayerPresent()) {
        return callback({ status: 404, error: `Room with name '${roomInfo.name}' is full!` });
    }
    (_a = rooms.get(roomInfo.name)) === null || _a === void 0 ? void 0 : _a.addPlayer(socket.id);
    socket.join(roomInfo.name);
    return callback({ status: 200, error: `Joining room '${roomInfo.name}'!` });
}
function leaveRoom(socket) {
    const roomName = Array.from(socket.rooms)[socket.rooms.size - 1];
    const room = rooms.get(roomName);
    console.log('leave-room before', socket.rooms);
    if (room) {
        socket.leave(room.name);
        room.removePlayer(socket.id);
    }
    console.log('leave-room after', socket.rooms);
}
function getUsersRoom(socket) {
    const [defaultRoomName, gameRoomName, ...rest] = Array.from(socket.rooms);
    return rooms.get(gameRoomName);
}
function leaveAllRooms(socket) {
    const [defaultRoomName, ...otherRooms] = Array.from(socket.rooms);
    otherRooms.forEach(roomName => {
        var _a;
        (_a = rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.removePlayer(socket.id);
    });
}
io.on("connection", (socket) => {
    /* const room = findRoomToJoin();
  
    if (!room) {
      console.log('All rooms are full!');
      socket.emit('chat-message', {author: 'SYSTEM', message: `All rooms are full!`});
    }
    else {
      socket.join(room.name);
      room.addPlayer(socket.id);
      
      io.in(room.name).emit('chat-message', {author: 'SYSTEM', message: `User: ${socket.id} joined the room: ${room.name}!`});
      io.in(room.name).emit('move-made', { event: 'MOVE', turn: room.turn, gameState: room.gameState });
      console.log(rooms);
    } */
    /*   const [defaultRoomName, gameRoomName, ...rest] = Object.values(socket.rooms);
      const room = rooms.get(gameRoomName);
      console.log('room:', room); */
    // send chat messages
    socket.on('chat-message', (arg) => {
        console.log('chat-message:', arg);
        const room = getUsersRoom(socket);
        if (room)
            io.in(room.name).emit('chat-message', { author: socket.id, message: arg.message });
    });
    // send information about the move
    socket.on('move-made', (arg) => {
        console.log('move-made', arg);
        const room = getUsersRoom(socket);
        room === null || room === void 0 ? void 0 : room.changeGameState(socket.id, arg.changedSquereIndex);
        console.log(room);
        if (room === null || room === void 0 ? void 0 : room.checkGameOver()) {
            return io.in(`${room.name}`).emit('move-made', {
                event: 'GAME_OVER', winner: room.winner, turn: room.turn, gameState: room.gameState
            });
        }
        return io.in(`${room === null || room === void 0 ? void 0 : room.name}`).emit('move-made', {
            event: 'move-made', turn: room === null || room === void 0 ? void 0 : room.turn, gameState: room === null || room === void 0 ? void 0 : room.gameState
        });
    });
    socket.on("create-room", (room, callback) => {
        return createRoom(room, callback);
    });
    socket.on("join-room", (roomInfo, callback) => {
        return joinRoom(socket, roomInfo, callback);
    });
    socket.on('leave-room', (arg) => {
        return leaveRoom(socket);
    });
    // disconnect
    socket.on('disconnecting', (arg) => {
        leaveAllRooms(socket);
        console.log(`user ${socket.id} disconnect`, { arg });
    });
});
/* io.of("/").adapter.on("create-room", (room: {name: string, isPrivate: boolean, password?: string}, callback) => {
  if (!rooms.get(room.name)) {
    rooms.set(room.name, new Room(room.name, room.isPrivate));
    callback({status: 201, newRoom: {name: room.name}});
  } else {
    callback({status: 409, error: `Room with name '${room.name}' already exists!`});
  }

  console.log('arg:', room); // "world"
  console.log('callback:', callback);
  callback("got it");
}); */
/* io.of("/").adapter.on("join-room", (room, id) => {
  // console.log(`socket ${id} has joined room ${room}`);
}); */
/* io.of("/").adapter.on("leave-room", (room: string, id) => {
  const gameRoom = rooms.get(room);
  if (!gameRoom) return;

  gameRoom.removePlayer(id);
  if (gameRoom.isEmpty()) gameRoom.resetGameState();

  io.in(gameRoom.name).emit('chat-message', {author: 'SYSTEM', message: `User: ${id} left the room!`});
  console.log(`user ${id} left the room ${room}`);
}); */
/* io.of("/").adapter.on("delete-room", (room) => {
  // console.log(`room ${room} was deleted`);
}); */
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
