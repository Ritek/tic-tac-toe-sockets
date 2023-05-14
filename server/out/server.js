"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const roomsDb_1 = __importDefault(require("./roomsDb"));
const SessionStore_1 = __importDefault(require("./SessionStore"));
const services_1 = require("./services");
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
const sessionStore = new SessionStore_1.default();
setInterval(function () {
    io.emit('all-rooms', Array.from(roomsDb_1.default, room => room[1].getRoomInfo()));
}, 5000);
function getUserGameRoomName(userRooms) {
    return [...userRooms.values()].at(2);
}
function hasErrorField(obj) {
    return 'error' in obj;
}
function randomId(length = 8) {
    return crypto_1.default.randomBytes(length).toString("hex");
}
io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.data.sessionID = sessionID;
            socket.data.userID = session.userID;
            socket.data.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("Username missing!"));
    }
    // create new session
    socket.data.sessionID = randomId();
    socket.data.userID = randomId();
    socket.data.username = username;
    next();
});
io.on("connection", (socket) => {
    socket.join(socket.data.userID);
    sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        username: socket.data.username,
        connected: true,
    });
    socket.emit('session', {
        sessionID: socket.data.sessionID,
        userID: socket.data.userID,
        username: socket.data.username
    });
    socket.on('delete-session', (sessionID) => {
        console.log('delete-session', sessionID);
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, services_1.leaveRoom)(userRoomName, socket.data.userID);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
        sessionStore.deleteSession(sessionID);
    });
    socket.on('chat-message', (newChatMessage) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        io.in(userRoomName).emit('chat-message', {
            author: socket.data.username, message: newChatMessage.message
        });
    });
    socket.on('move-made', (newMove) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const result = (0, services_1.changeGameState)(userRoomName, socket.data.userID, newMove.changedSquereIndex);
        if (hasErrorField(result))
            return;
        return io.in(userRoomName).emit('move-made', result);
    });
    socket.on('new-move', (newMove) => {
        console.log('new-move', newMove);
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const result = (0, services_1.changeGameState)(userRoomName, socket.data.userID, newMove.changedSquereIndex);
        if (hasErrorField(result))
            return;
        return io.in(userRoomName).emit('game-state', result);
    });
    socket.on('rematch-request', () => {
        console.log('rematch-request');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const room = roomsDb_1.default.get(userRoomName);
        if (!room)
            return;
        const otherPlayer = room.getOtherPlayer(socket.data.userID);
        if (!otherPlayer || otherPlayer instanceof Error)
            return;
        io.to(otherPlayer.userID).emit('confirm-rematch', `Your oponent requests rematch`);
    });
    socket.on('rematch-approved', () => {
        console.log('rematch-approved');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const room = roomsDb_1.default.get(userRoomName);
        if (!room)
            return;
        room.resetGameState();
        return io.in(userRoomName).emit('game-state', room.getGameState());
    });
    socket.on('create-room', (roomDetails, callback) => {
        console.log('create-room', roomDetails);
        const newRoom = (0, services_1.createRoom)(roomDetails);
        return callback(newRoom);
    });
    socket.on("join-room", (roomInfo, callback) => {
        console.log('join-room', roomInfo);
        const newPlayerAndGameState = (0, services_1.joinRoom)(roomInfo.name, socket.data.userID, socket.data.username, roomInfo.password);
        if (!hasErrorField(newPlayerAndGameState)) {
            socket.join(roomInfo.name);
        }
        const gameState = (0, services_1.getGameState)(roomInfo.name);
        if (!hasErrorField(gameState)) {
            io.in(roomInfo.name).emit('game-state', gameState);
        }
        return callback(newPlayerAndGameState);
    });
    socket.on('leave-room', () => {
        console.log('leave-room');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, services_1.leaveRoom)(userRoomName, socket.data.userID);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
    // runs before disconnect
    socket.on('disconnecting', () => {
        console.log('disconnecting');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (userRoomName) {
            const room = roomsDb_1.default.get(userRoomName);
            room === null || room === void 0 ? void 0 : room.removePlayer(socket.data.userID);
        }
        sessionStore.disconnectUser(socket.data.userID);
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
