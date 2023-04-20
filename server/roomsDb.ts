import Room from './Room';

const rooms = new Map<string, Room>();
rooms.set('room-0', new Room({ name: 'room-0', isPrivate: false }));
rooms.set('room-1', new Room({ name: 'room-1', isPrivate: false }));
rooms.set('room-2', new Room({ name: 'room-2', isPrivate: true, password: 'password' }));

export function getRoomInfo() {
    return Array.from(rooms, room => room[1].getRoomInfo());
}

export default rooms;