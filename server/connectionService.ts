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


export function changeGameState(roomName: string, playerName: string, changedSquereIndex: number) {
    const room = rooms.get(roomName);

    if (!room) {
        return { error: 'Room of provided name does not exist!' };
    }

    const newState = room.changeGameState(playerName, changedSquereIndex);
    
    if (newState instanceof Error) {
        return { error: newState.message };
    }

    if (room.winner) {
        return { event: 'GAME_OVER', winner: room.winner, 
            turn: room.turn, boardState: room.boardState } 
    }

    console.log('room after:', room);

    return newState;
}

export function createRoom(newRoomParams: NewRoom) {
    const validated = NewRoomSchema.safeParse(newRoomParams);
    
    if (!validated.success) {
        return { status: 400, issues: validated.error.issues };
    }
    
    const newRoom = createNewRoom(validated.data);

    return newRoom instanceof Error
        ? { status: 400, error: newRoom.message }
        : { status: 201, newRoomName: newRoom.name };
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

    /* const removedPlayer =  */room.removePlayer(playerName);

    return { status: 200 };
}