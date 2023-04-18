import rooms from './roomsDb';
import Room2 from './Room2';
import { NameDuplicateException } from './types';
import { newRoomSchema } from './validators';
import { z } from 'zod';

export function createPublicRoom(name: string): Room2 | NameDuplicateException {
    if (rooms.get(name)) {
        return new NameDuplicateException("Room with provided name already exisits!");
    }

    rooms.set(name, new Room2(name, false));
    return new Room2(name, false);
}

export function createPrivateRoom(name: string, password: string): Room2 | NameDuplicateException {
    if (rooms.get(name)) {
        return new NameDuplicateException("Room with provided name already exisits!");
    }
    
    rooms.set(name, new Room2(name, true, password));
    return new Room2(name, true, password);
}


export function changeGameState(roomName: string, playerName: string, changedSquereIndex: number) {
    const room = rooms.get(roomName);

    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }

    const newState = room.changeGameState(playerName, changedSquereIndex);
    
    if (newState instanceof Error) {
        return { error: newState.message };
    }

    // check for winner

    return newState;
}

export function createRoom(name: string, isPrivate: boolean, password?: string) {
    try {
        newRoomSchema.parse({name, isPrivate, password});
    } catch(error: any) {
        console.log(error.format());
        if (error instanceof z.ZodError) {
            return { status: 400, error: error.toString() };
        }
    }
    
    const newRoom = isPrivate && password
        ? createPrivateRoom(name, password)
        : createPublicRoom(name);

    if (newRoom instanceof Error) {
        return { status: 400, error: newRoom.message };
    }
    
    return { status: 201, newRoom };
}

export function joinRoom(roomName: string, playerName: string, password?: string) {
    const room = rooms.get(roomName);

    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const newPlayer = room.addPlayer(playerName, password);
    if (newPlayer instanceof Error) {
        return { status: 400, error: newPlayer.message };
    }

    return { status: 200, newPlayer };
}

export function leaveRoom(roomName: string, playerName: string) {
    const room = rooms.get(roomName);

    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const removedPlayer = room.removePlayer(playerName);

    return { status: 200 };
}