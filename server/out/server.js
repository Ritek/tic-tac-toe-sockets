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
const sessionStore = new SessionStore_1.default();
setInterval(function () {
    console.log('all-rooms', Array.from(roomsDb_1.default, room => room[1].getRoomInfo()));
    console.log('session', sessionStore.findAllSessions());
    io.emit('all-rooms', Array.from(roomsDb_1.default, room => room[1].getRoomInfo()));
}, 5000);
function getUserGameRoomName(userRooms) {
    return [...userRooms.values()].at(1);
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
        console.log("Username missing!");
        return next(new Error("Username missing!"));
    }
    // create new session
    socket.data.sessionID = randomId();
    socket.data.userID = randomId();
    socket.data.username = username;
    next();
});
io.on("connection", (socket) => {
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
        sessionStore.deleteSession(sessionID);
    });
    socket.on('chat-message', (newChatMessage) => {
        const usersRoomName = getUserGameRoomName(socket.rooms);
        if (!usersRoomName)
            return;
        io.in(usersRoomName).emit('chat-message', {
            author: socket.id, message: newChatMessage.message
        });
    });
    socket.on('move-made', (newMove) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const result = (0, connectionService_1.changeGameState)(userRoomName, socket.id, newMove.changedSquereIndex);
        if (hasErrorField(result))
            return;
        return io.in(userRoomName).emit('move-made', result);
    });
    socket.on("create-room", (roomDetails, callback) => {
        console.log(roomDetails);
        const newRoom = (0, connectionService_1.createRoom)(roomDetails);
        return callback(newRoom);
    });
    socket.on("join-room", (roomInfo, callback) => {
        console.log(roomInfo);
        const newPlayerAndGameState = (0, connectionService_1.joinRoom)(roomInfo.name, socket.id, roomInfo.password);
        if (!hasErrorField(newPlayerAndGameState)) {
            socket.join(roomInfo.name);
        }
        return callback(newPlayerAndGameState);
    });
    socket.on('leave-room', () => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, connectionService_1.leaveRoom)(userRoomName, socket.id);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
    // runs before disconnect
    socket.on('disconnecting', () => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName)
            return;
        const removedPlayer = (0, connectionService_1.leaveRoom)(userRoomName, socket.id);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
