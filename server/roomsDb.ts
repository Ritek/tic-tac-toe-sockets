import Room2 from './Room2';
import { NameDuplicateException } from './types';
import { newRoomSchema } from './validators'

const rooms = new Map<string, Room2>();
rooms.set('room-0', new Room2('room-0', false));
rooms.set('room-1', new Room2('room-1', false));
rooms.set('room-2', new Room2('room-2', true, 'password'));

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

export default rooms;