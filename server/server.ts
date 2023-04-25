import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

import rooms from './roomsDb';

import { changeGameState, createRoom, joinRoom, leaveRoom } from './connectionService';
import { NewRoom, JoinRoom, Move, ChatMessage, RoomInformation } from "./validators";
import { GameState } from "./Room";


interface ServerToClientEvents {
    'all-rooms':    (arg: RoomInformation[]) => void;
    'chat-message': (arg: ChatMessage) => void;
    'move-made':    (arg: GameState | {error: string}) => void;
}
  
interface ClientToServerEvents {
    'chat-message': (newChatMessage: ChatMessage) => void;
    'move-made':    (newMove: Move) => void;
    'create-room':  (roomDetails: NewRoom, callback: (arg: any) => void) => void;
    'join-room':    (roomInfo: JoinRoom, callback: (arg: any) => void) => void;
    'leave-room':   () => void;
    'disconnecting': () => void;
}

const PORT = 5000;
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send([]);
});

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});

setInterval(function() {
    console.log('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
    io.emit('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
}, 5000);

function getUserGameRoomName(userRooms: Set<string>) {
    return [...userRooms.values()].at(1);
}

function hasErrorField(obj: Object): boolean {
    return 'error' in obj;
}

io.on("connection", (socket) => {
    socket.on('chat-message', (newChatMessage: ChatMessage) => {
        const usersRoomName = getUserGameRoomName(socket.rooms);
        if (!usersRoomName) return;

        io.in(usersRoomName).emit('chat-message', {
            author: socket.id, message: newChatMessage.message
        });
    });
  
    socket.on('move-made', (newMove: Move) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const result = changeGameState(userRoomName, socket.id, newMove.changedSquereIndex);
        if (hasErrorField(result)) return;

        return io.in(userRoomName).emit('move-made', result);
    });
  
    socket.on("create-room", (roomDetails: NewRoom, callback) => {
        console.log(roomDetails);
        const newRoom = createRoom(roomDetails);

        return callback(newRoom);
    });
  
    socket.on("join-room", (roomInfo: JoinRoom, callback) => {
        console.log(roomInfo);
        const newPlayerAndGameState = joinRoom(roomInfo.name, socket.id, roomInfo.password);

        if (!hasErrorField(newPlayerAndGameState)) {
            socket.join(roomInfo.name);
        }

        return callback(newPlayerAndGameState);
    });
  
    socket.on('leave-room', () => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.id);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
  
    // runs before disconnect
    socket.on('disconnecting', () => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.id);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });

});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
