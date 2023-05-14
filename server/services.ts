import rooms from './roomsDb';
import Room from './Room';
import { NameDuplicateException } from './types';
import { NewRoomSchema, NewRoom } from './validators';

function createNewRoom(newRoomParams: NewRoom) {
    if (rooms.get(newRoomParams.name)) {
        return new NameDuplicateException("Room with provided name already exisits!");
    }

    const newRoom = new Room(newRoomParams);
    rooms.set(newRoom.name, newRoom);

    return newRoom;
}

export function getGameState(roomName: string) {
    const room = rooms.get(roomName);
    
    return room
        ? room.getGameState()
        : { error: 'Room of provided name does not exist!' };
}

export function changeGameState(roomName: string, userID: string, changedSquereIndex: number) {
    const room = rooms.get(roomName);

    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }

    const newState = room.changeGameState(userID, changedSquereIndex);
    
    if (newState instanceof Error) {
        return { error: newState.message };
    }

    if (room.winner) {
        return { event: 'GAME_OVER', winner: room.winner, ...newState } 
    }

    return newState;
}

export function createRoom(newRoomParams: NewRoom) {
    const validated = NewRoomSchema.safeParse(newRoomParams);
    
    if (!validated.success) {
        return { status: 400, error: validated.error.issues };
    }
    
    const newRoom = createNewRoom(validated.data);

    return newRoom instanceof Error
        ? { status: 400, error: newRoom.message }
        : { status: 201, newRoomName: newRoom.name };
}

export function joinRoom(roomName: string, playerID: string, username: string, roomPassword?: string) {
    const room = rooms.get(roomName);

    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const newPlayer = room.addPlayer(playerID, username, roomPassword);

    return newPlayer instanceof Error
        ? { status: 400, error: newPlayer.message }
        : { status: 200, newPlayer, gameState: room.getGameState() };
}

export function leaveRoom(roomName: string, playerID: string) {
    const room = rooms.get(roomName);
    console.log('room', room);

    if (!room) {
        console.log('Room of provided name does not exist!');
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const x = room.removePlayer(playerID);
    console.log(x);

    return { status: 200 };
}