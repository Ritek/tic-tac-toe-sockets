import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from 'cors';

import Room from './Room';

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

const rooms = new Map<string, Room>();
rooms.set('room-0', new Room('room-0', false));
rooms.set('room-1', new Room('room-1', false));
rooms.set('room-2', new Room('room-2', true));

setInterval(function() {
  console.log('all-rooms', Array.from(rooms, room => room[1].getBasicInfo()));
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

function changeCurrentGameState(arg: any, socket: any, room: any) {
  console.log('arg:', arg);

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

function createRoom(room: any, callback: Function) {
  if (!rooms.get(room.name)) {
    rooms.set(room.name, new Room(room.name, room.isPrivate));
    callback({status: 201, newRoom: {name: room.name}});
  } else {
    callback({status: 409, error: `Room with name '${room.name}' already exists!`});
  }
}

function joinRoom(socket: any, roomInfo: any, callback: Function) {
  const foundRoom = rooms.get(roomInfo.name);

  if (!foundRoom) {
    return callback({status: 404, error: `Room with name '${roomInfo.name}' doesn't exists!`});
  } 

  if (foundRoom.playerO === socket.id || foundRoom.playerX === socket.id) {
    return callback({status: 200});
  }

  if (roomInfo.password !== foundRoom.password) {
    return callback({status: 404, error: `Incorrect password!`});
  }
  
  if (foundRoom.twoPlayerPresent()) {
    return callback({status: 404, error: `Room with name '${roomInfo.name}' is full!`});
  }

  rooms.get(roomInfo.name)?.addPlayer(socket.id);
  socket.join(roomInfo.name);
  return callback({status: 200});
}

function leaveRoom(socket: Socket) {
  const roomName = Array.from(socket.rooms)[socket.rooms.size-1];
  const room = rooms.get(roomName);
  
  console.log('leave-room before', socket.rooms);

  if (room) {
    socket.leave(room.name);
    room.removePlayer(socket.id);
  }

  console.log('leave-room after', socket.rooms);
}

function getUsersRoom(socket: Socket) {
  const [defaultRoomName, gameRoomName, ...rest]: string[] = Array.from(socket.rooms);
  return rooms.get(gameRoomName);
}

function leaveAllRooms(socket: Socket) {
  const [defaultRoomName, ...otherRooms] = Array.from(socket.rooms);

  otherRooms.forEach(roomName => {
    rooms.get(roomName)?.removePlayer(socket.id);
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
    if (room) io.in(room.name).emit('chat-message', {author: socket.id, message: arg.message});
  });

  // send information about the move
  socket.on('move-made', (arg: {event: 'Move', changedSquereIndex: number}) => {
    console.log('move-made', arg);
    const room = getUsersRoom(socket);
    
    if (!room) return;

    return changeCurrentGameState(arg, socket, room);
  });

  socket.on("create-room", (room: {name: string, isPrivate: boolean, password?: string}, callback) => {
    return createRoom(room, callback)
  });

  socket.on("join-room", (roomInfo: {name: string, password?: string}, callback) => {
    console.log('join-room', roomInfo);
    return joinRoom(socket, roomInfo, callback);
  });

  socket.on('leave-room', (arg) => {
    return leaveRoom(socket);
  });

  // disconnect
  socket.on('disconnecting', (arg) => {
    leaveAllRooms(socket);
    console.log(`user ${socket.id} disconnect`, {arg});
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