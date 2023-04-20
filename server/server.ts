import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

import rooms from './roomsDb';

import { changeGameState, createRoom, joinRoom, leaveRoom } from './connectionService';
import { NewRoom } from "./validators";

const PORT = 5000;
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send([]);
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});

setInterval(function() {
    console.log('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
    io.emit('all-rooms', Array.from(rooms, room => room[1].getRoomInfo()));
}, 5000);

function getUserGameRoomName(userRooms: Set<string>) {
    // const [defaultRoomName, gameRoomName, ...rest]: string[] = Array.from(userRooms);
    // const gameRoomName = [...userRooms.values()].at(1);
    return [...userRooms.values()].at(1);
}

function hasErrorField(obj: Object): boolean {
    return 'error' in obj;
}

io.on("connection", (socket) => {
    socket.on('chat-message', (arg) => {
        const usersRoomName = getUserGameRoomName(socket.rooms);
        if (!usersRoomName) return;

        io.in(usersRoomName).emit('chat-message', {
            author: socket.id, message: arg.message
        });
    });
  
    socket.on('move-made', (arg: {event: 'Move', changedSquereIndex: number}) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const result = changeGameState(userRoomName, socket.id, arg.changedSquereIndex);
        if (hasErrorField(result)) return;

        return io.in(userRoomName).emit('move-made', { 
            event: 'move-made', ...result
        });
    });
  
    socket.on("create-room", (roomDetails: NewRoom, callback) => {
        console.log(roomDetails);
        const newRoom = createRoom(roomDetails);

        return callback(newRoom);
    });
  
    socket.on("join-room", (roomInfo: {name: string, password?: string}, callback) => {
        console.log(roomInfo);
        const newPlayer = joinRoom(roomInfo.name, socket.id, roomInfo.password);

        if (!hasErrorField(newPlayer)) {
            socket.join(roomInfo.name);
        }

        return callback(newPlayer);
    });
  
    socket.on('leave-room', (arg) => {
        const userRoomName = getUserGameRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.id);
        if (!hasErrorField(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
  
    // runs before disconnect
    socket.on('disconnecting', (arg) => {
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