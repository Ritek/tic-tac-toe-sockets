import React, { useRef, useState, useEffect } from 'react';
import { socket } from '../../socket';

import { useGetRoomsQuery, useCreateRoomMutation, 
    useJoinRoomMutation, useLeaveRoomMutation } from '../../globalApi';

import RoomTableRow from './RoomTableRow';
import JoinRoomModal from './JoinRoomModal';
import CreateRoomModal from './CreateRoomModal';

function HomeScreen() {
    // console.log('Rendered HomeScreen');
    const { data: rooms } = useGetRoomsQuery();
    const [ createRoom, { error: createRoomError } ] = useCreateRoomMutation();
    const [ joinRoom, { error: joinRoomError } ] = useJoinRoomMutation();
    const [ leaveRoom ] = useLeaveRoomMutation();

    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);
    const selectedRoomName = useRef({ name: "", isPrivate: false });

    useEffect(() => { 
        leaveRoom();
        return () => {
            console.log('Unmounted HomeScreen');
            // socket.off();
        };
    }, []);

    function openJoinRoomModal(roomName: string, isPrivate: boolean) {
        selectedRoomName.current = {name: roomName, isPrivate};
        setShowJoinRoomModal(true);
    }

    return (
        <div className='p-0.5 pt-4 sm:p-8 mb-28 mx-auto md:m-0 w-10/12 sm:w-1/2 sm:min-w-[500px]'>

            <JoinRoomModal
                isPrivate={selectedRoomName.current.isPrivate} 
                roomName={selectedRoomName.current.name} 
                isVisible={showJoinRoomModal} 
                closeModal={() => setShowJoinRoomModal(false)} 
            />

            <CreateRoomModal
                isVisible={showNewRoomModal}
                closeModal={() => setShowNewRoomModal(false)}
            />

            <h1 className='text-6xl mb-4'>Available rooms</h1>
            <h3 className='text-4xl mb-12'>Click a row to join a room</h3>

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
                        rooms?.map((room, iter) => (
                            <RoomTableRow key={iter} room={room} rowClick={openJoinRoomModal} />
                        ))
                    }
                </tbody>
            </table>

            <button className='sticky bottom-0 p-4 text-2xl w-full rounded-none bg-sky-600' 
                    onClick={() => setShowNewRoomModal(true)}>
                Create
            </button>
        </div>
    );
}

export default HomeScreen;