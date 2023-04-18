"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const roomsDb_1 = __importDefault(require("./roomsDb"));
const connectionService_1 = require("./connectionService");
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
setInterval(function () {
    console.log('all-rooms', Array.from(roomsDb_1.default, room => room[1].getRoomInfo()));
    io.emit('all-rooms', Array.from(roomsDb_1.default, room => room[1].getRoomInfo()));
}, 5000);
function getUsersRoomName(userRooms) {
    const [defaultRoomName, gameRoomName, ...rest] = Array.from(userRooms);
    return gameRoomName;
}
function hasError(obj) {
    return 'error' in obj;
}
io.on("connection", (socket) => {
    socket.on('chat-message', (arg) => {
        const usersRoomName = getUsersRoomName(socket.rooms);
        if (usersRoomName)
            io.in(usersRoomName).emit('chat-message', { author: socket.id, message: arg.message });
    });
    socket.on('move-made', (arg) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const result = (0, connectionService_1.changeGameState)(userRoomName, socket.id, arg.changedSquereIndex);
        if ('error' in result)
            return;
        return io.in(userRoomName).emit('move-made', {
            event: 'move-made', result
        });
    });
    socket.on("create-room", (roomDetails, callback) => {
        console.log(roomDetails);
        const newRoom = (0, connectionService_1.createRoom)(roomDetails.name, roomDetails.isPrivate, roomDetails.password);
        return callback(newRoom);
    });
    socket.on("join-room", (roomInfo, callback) => {
        console.log(roomInfo);
        const newPlayer = (0, connectionService_1.joinRoom)(roomInfo.name, socket.id, roomInfo.password);
        if (!hasError(newPlayer)) {
            socket.join(roomInfo.name);
        }
        return callback(newPlayer);
    });
    socket.on('leave-room', (arg) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, connectionService_1.leaveRoom)(userRoomName, socket.id);
        if (!hasError(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
    // runs before disconnect
    socket.on('disconnecting', (arg) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, connectionService_1.leaveRoom)(userRoomName, socket.id);
        if (!hasError(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
