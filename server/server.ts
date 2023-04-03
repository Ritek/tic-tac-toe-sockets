import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

import Room from './Room';

const PORT = 5000;
const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});

const rooms = new Map<string, Room>();
rooms.set('room-0', new Room('room-0', false));
rooms.set('room-1', new Room('room-1', false));
rooms.set('room-2', new Room('room-2', true));

function findRoomToJoin() {
  const temp = Array.from(rooms.values()).find(room => room.canJoinRoom());
  return temp ? temp : findEmptyRoom();
}

function findEmptyRoom() {
  return Array.from(rooms.values()).find(room => !room.playerX && !room.playerO);
}

io.on("connection", (socket) => {
  // socket.send({event: 'chat-message', message: `Welcome user ${socket.id}`});
  io.to(socket.id).emit('chat-message', {author: 'SYSTEM', message: `Welcome user ${socket.id}`});
  const room = findRoomToJoin();

  if (!room) socket.send({event: 'rooms full', message: `All rooms are full!`});
  else {
    room.addPlayer(socket.id);
    socket.join(room.name);
    io.to(socket.id).emit('chat-message', {author: 'SYSTEM', message: `You have joined the room ${room.name}!`});
    io.to(socket.id).emit('move-made', { event: 'MOVE', turn: room.turn, gameState: room.gameState });
    console.log(rooms);
  }

  // messages
  socket.on('chat-message', (arg) => {
    if (room) io.in(room.name).emit('chat-message', {author: socket.id, message: arg.message});
  });

  socket.on('move-made', (arg: {event: 'Move', change: number}) => {
    console.log('move-made', arg);

    if (!room) return socket.send({event: 'ERROR', message: `Not connected to any room!`});
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
    console.log(`user ${socket.id} disconnect`, {arg});
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

io.of("/").adapter.on("leave-room", (room: string, id) => {
  rooms.get(room)?.removePlayer(id);
  if (rooms.get(room)?.isEmpty()) rooms.get(room)?.resetGameState();
  console.log(`user ${id} left the room ${room}`);
});

io.of("/").adapter.on("delete-room", (room) => {
  console.log(`room ${room} was deleted`);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});