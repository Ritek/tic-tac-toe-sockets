import React, { useRef, useState, useEffect } from 'react';
import { socket } from '../../socket';
import { useNavigate } from "react-router-dom";

import RoomTableRow from './RoomTableRow';
import JoinRoomModal from './JoinRoomModal';
import CreateRoomModal from './CreateRoomModal';

type Room = {
    name: string;
    isPrivate: boolean;
    players: number;
}

type RoomInfo = {
    name: string;
    isPrivate: boolean;
    password?: string;
}
/* 
type PublicRoom = {
    name: string;
    isPrivate: false;
}

type PrivateRoom = {
    name: string;
    isPrivate: true;
    password: string;
}

type PublicOrPrivateRoom = PublicRoom | PrivateRoom; */

function HomeScreen() {
    console.log('Rendered HomeScreen');
    const navigate = useNavigate()

    const [rooms, setRooms] = useState<Room[]>([]);
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);
    const selectedRoomName = useRef({ name: "", isPrivate: false });

    useEffect(() => {
        socket.emit('leave-room', { event: 'leave-room' });
        socket.on('all-rooms', (rooms: Room[]) => {
            // console.log('all-rooms:', rooms);
            setRooms(rooms);
        });
    
        return () => {
            console.log('Unmounted HomeScreen');
            socket.off('all-rooms');
            socket.off();
        };
    }, []);

    function openJoinRoomModal(roomName: string, isPrivate: boolean) {
        selectedRoomName.current = {name: roomName, isPrivate};
        setShowJoinRoomModal(true);
    }

    function joinRoom(roomInfo: RoomInfo) {
        socket.emit("join-room", roomInfo, (response: any) => {
            console.log('response:', response)
            if (response.status === 200) {
                setShowJoinRoomModal(false);
                navigate(`/${roomInfo.name}`)
            }
        });
    }

    function createRoom(newRoom: RoomInfo) {
        socket.emit("create-room", newRoom, (response: any) => {
            if (response.status === 201) {
                setShowNewRoomModal(false);
            }
        });
    }

    return (
        <div className='p-0.5 pt-4 sm:p-8 mb-28 mx-auto md:m-0 w-10/12 sm:w-1/2 sm:min-w-[500px]'>

            <JoinRoomModal
                isPrivate={selectedRoomName.current.isPrivate} 
                roomName={selectedRoomName.current.name} 
                isVisible={showJoinRoomModal} 
                closeModal={() => setShowJoinRoomModal(false)} 
                joinRoom={joinRoom}
            />

            <CreateRoomModal
                isVisible={showNewRoomModal}
                closeModal={() => setShowNewRoomModal(false)}
                createRoom={createRoom}
            />

            <h1 className='text-6xl mb-4'>Available rooms</h1>
            <h3 className='text-4xl mb-12'>Click row to join room</h3>

            <table className='w-full table-auto text-xl text-left'>
                <thead>
                    <tr>
                        <th className='w-7/12 py-2'>Room name</th>
                        <th className='w-4/12 py-2 pl-3.5'>Players</th>
                        <th className='w-1/12 py-2'>Play</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rooms.map((room, iter) => (
                            <RoomTableRow key={iter} room={room} rowClick={openJoinRoomModal} />
                        ))
                    }
                </tbody>
            </table>

            <button className='sticky bottom-0 p-4 text-2xl w-full rounded-none bg-sky-600' onClick={() => setShowNewRoomModal(true)}>
                Create
            </button>
        </div>
    );
}

export default HomeScreen;