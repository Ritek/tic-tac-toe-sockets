import rooms, { createPublicRoom, createPrivateRoom } from './roomsDb';

// import { InvalidMoveException, NotAPLayerException } from './types';


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

/* export function changeGameState2(roomName: string, playerName: string, changedSquereIndex: number) {
    const room = rooms.get(roomName);

    if (!room) {
        return { status: 400, error: 'Room of provided name does not exist!' };
    }

    const newState = room.changeGameState(playerName, changedSquereIndex);

    if (newState instanceof InvalidMoveException || newState instanceof NotAPLayerException) {
        console.log(newState);
    };

    if (room.winner) {
        return { event: 'GAME-OVER', newState };
    }

    return { event: 'move-mage', newState };
} */

export function createRoom(name: string, isPrivate: boolean, password?: string) {
    // validate roomDetails
    
    const newRoom = isPrivate && password
        ? createPrivateRoom(name, password)
        : createPublicRoom(name);

    if (newRoom instanceof Error) {
        return { status: 400, error: newRoom.message }
    }
    
    return { status: 201, newRoom }
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