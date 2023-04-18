import Room2 from './Room2';

const rooms = new Map<string, Room2>();
rooms.set('room-0', new Room2('room-0', false));
rooms.set('room-1', new Room2('room-1', false));
rooms.set('room-2', new Room2('room-2', true, 'password'));

export default rooms;