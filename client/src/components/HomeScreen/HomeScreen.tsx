import React, { useRef, useState, useEffect } from 'react';
import { socket } from '../../socket';
import { useNavigate } from "react-router-dom";

import RoomTableRow from './RoomTableRow';
import JoinRoomModal from './JoinRoomModal';
import CreateRoomModal from './CreateRoomModal';

// const LockSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path></svg>;
// const plusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>;
// const LockSVG = <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M18 10H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3h2c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7.939 5.499A2.002 2.002 0 0 1 14 16a1.99 1.99 0 0 1-1 1.723V20h-2v-2.277a1.992 1.992 0 0 1-.939-2.224z"></path></svg>;
// const FullSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-rose-700 w-fit h-fit'><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>;

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
    const navigate = useNavigate()

    const [rooms, setRooms] = useState<Room[]>([]);
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);
    const selectedRoomName = useRef({ name: "", isPrivate: false });

    useEffect(() => {
        socket.on('all-rooms', (rooms: Room[]) => {
            console.log('all-rooms:', rooms);
            setRooms(rooms);
        });
    
        return () => {
          socket.off('all-room');
        };
    }, [socket]);

    function openJoinRoomModal(roomName: string, isPrivate: boolean) {
        console.log('openJoinRoomModal:', roomName);
        selectedRoomName.current = {name: roomName, isPrivate};
        setShowJoinRoomModal(true);
    }

    function joinRoom(roomInfo: RoomInfo) {
        socket.emit("join-room", roomInfo, (response: any) => {
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