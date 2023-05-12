import express from "express";
import crypto from 'crypto';
import { createServer } from "http";
import cors from 'cors';
import { Server, Socket } from "socket.io";

import rooms from './roomsDb';
import InMemorySessionStore, { SessionStore } from './SessionStore';

import { changeGameState, createRoom, joinRoom, leaveRoom } from './connectionService';
import { NewRoom, JoinRoom, Move, ChatMessage, RoomInformation, Session } from "./validators";
import { GameState } from "./Room";

interface ServerToClientEvents {
    'session':          (arg: Session) => void;
    'all-rooms':        (arg: RoomInformation[]) => void;
    'chat-message':     (arg: ChatMessage) => void;
    'move-made':        (arg: GameState | {error: string}) => void;
    'game-state':       (arg: GameState | {error: string}) => void;
    'confirm-rematch':  (arg: string) => void;
}
  
interface ClientToServerEvents {
    'delete-session':   (sessionID: string) => void;
    'chat-message':     (newChatMessage: ChatMessage) => void;
    'move-made':        (newMove: Move) => void;
    'new-move':         (newMove: Move) => void;
    'rematch-request':  () => void;
    'rematch-approved': () => void;
    'create-room':      (roomDetails: NewRoom, callback: (arg: any) => void) => void;
    'join-room':        (roomInfo: JoinRoom, callback: (arg: any) => void) => void;
    'leave-room':       () => void;
    'disconnecting':    () => void;
}

const PORT = 5000;
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send([]);
});

/* app.get('/rooms', (req, res) => {
    console.log('/rooms');
    const temp = Array.from(rooms, room => room[1].getRoomInfo());
    res.status(200).send(temp);
}); */

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});
const sessionStore: SessionStore = new InMemorySessionStore();

setInterval(function() {
    // console.log('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
    // console.log('session', sessionStore.findAllSessions());
    io.emit('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
}, 5000);

function getUserGameRoomName(userRooms: Set<string>) {
    return [...userRooms.values()].at(2);
}

function hasErrorField(obj: Object): boolean {
    return 'error' in obj;
}

function randomId(length: number = 8) { 
    return crypto.randomBytes(length).toString("hex"); 
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
        console.log('delete-session', sessionID)

        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.data.userID);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }

        sessionStore.deleteSession(sessionID);
    });

    socket.on('chat-message', (newChatMessage: ChatMessage) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        io.in(userRoomName).emit('chat-message', {
            author: socket.data.username, message: newChatMessage.message
        });
    });
  
    socket.on('move-made', (newMove: Move) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const result = changeGameState(userRoomName, socket.data.userID, newMove.changedSquereIndex);
        if (hasErrorField(result)) return;

        return io.in(userRoomName).emit('move-made', result);
    });

    socket.on('new-move', (newMove: Move) => {
        console.log('new-move', newMove);
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const result = changeGameState(userRoomName, socket.data.userID, newMove.changedSquereIndex);
        if (hasErrorField(result)) return;

        return io.in(userRoomName).emit('game-state', result);
    });

    socket.on('rematch-request', () => {
        console.log('rematch-request');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const room = rooms.get(userRoomName);
        if (!room) return;

        const otherPlayer = room.getOtherPlayer(socket.data.userID);
        if (!otherPlayer || otherPlayer instanceof Error) return;

        io.to(otherPlayer.userID).emit('confirm-rematch', 
            `Your oponent requests rematch`
        );
    });

    socket.on('rematch-approved', () => {
        console.log('rematch-approved');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const room = rooms.get(userRoomName);
        if (!room) return;

        room.resetGameState();
        return io.in(userRoomName).emit('game-state', room.getGameState());
    });
  
    socket.on('create-room', (roomDetails: NewRoom, callback) => {
        console.log('create-room', roomDetails);
        const newRoom = createRoom(roomDetails);

        return callback(newRoom);
    });
  
    socket.on("join-room", (roomInfo: JoinRoom, callback) => {
        console.log('join-room', roomInfo);
        const newPlayerAndGameState = joinRoom(
            roomInfo.name, socket.data.userID, socket.data.username, roomInfo.password
        );

        if (!hasErrorField(newPlayerAndGameState)) {
            socket.join(roomInfo.name);
        }

        return callback(newPlayerAndGameState);
    });
  
    socket.on('leave-room', () => {
        console.log('leave-room');
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.data.userID);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
  
    // runs before disconnect
    socket.on('disconnecting', () => {
        console.log('disconnecting');

        const userRoomName = getUserGameRoomName(socket.rooms);
        if (userRoomName) {
            const room = rooms.get(userRoomName);
            room?.removePlayer(socket.data.userID);
        }

        sessionStore.disconnectUser(socket.data.userID);
    });

});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
