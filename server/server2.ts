import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

import rooms from './roomsDb';

import { changeGameState, createRoom, joinRoom, leaveRoom } from './connectionService';

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

function getUsersRoomName(userRooms: Set<string>) {
    const [defaultRoomName, gameRoomName, ...rest]: string[] = Array.from(userRooms);
    return gameRoomName;
}

function hasError(obj: Object): boolean {
    return 'error' in obj;
}

io.on("connection", (socket) => {
    socket.on('chat-message', (arg) => {
        const usersRoomName = getUsersRoomName(socket.rooms);
        if (usersRoomName) io.in(usersRoomName).emit('chat-message', {author: socket.id, message: arg.message});
    });
  
    socket.on('move-made', (arg: {event: 'Move', changedSquereIndex: number}) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName) return;

        const result = changeGameState(userRoomName, socket.id, arg.changedSquereIndex);
        if ('error' in result) return;

        return io.in(userRoomName).emit('move-made', { 
            event: 'move-made', result
        });
    });
  
    socket.on("create-room", (roomDetails: {name: string, isPrivate: boolean, password?: string}, callback) => {
        const newRoom = createRoom(roomDetails.name, roomDetails.isPrivate, roomDetails.password);

        return callback(newRoom);
    });
  
    socket.on("join-room", (roomInfo: {name: string, password?: string}, callback) => {
        const newPlayer = joinRoom(roomInfo.name, socket.id, roomInfo.password);

        if (!hasError(newPlayer)) {
            socket.join(roomInfo.name);
        }

        return callback(newPlayer);
    });
  
    socket.on('leave-room', (arg) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.id);
        if (!hasError(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });
  
    // runs before disconnect
    socket.on('disconnecting', (arg) => {
        const userRoomName = getUsersRoomName(socket.rooms);
        if (!userRoomName) return;

        const removedPlayer = leaveRoom(userRoomName, socket.id);
        if (!hasError(removedPlayer)) {
            socket.leave(userRoomName);
        }
    });

  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });