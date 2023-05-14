import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { socket } from '../../socket';

import { 
    useGetRoomsQuery, 
    useLeaveRoomMutation, 
    useJoinRoomMutation, 
    useCreateRoomMutation 
} from '../../features/room/roomApi';
import RoomTableRow from './RoomTableRow';

import Spinner from '../../assets/Spinner';

import CreateRoomModal from '../Modals/CreateRoomModal';
import JoinRoomModal from '../Modals/JoinRoomModal';

import { NewRoomParameters, JoinRoomParameters } from '../../types';

function HomeScreen() {
    const navigate = useNavigate();

    const { data: rooms } = useGetRoomsQuery();
    const [ joinRoom ] = useJoinRoomMutation();
    const [ leaveRoom ] = useLeaveRoomMutation();
    const [ createRoom ] = useCreateRoomMutation();

    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);
    const selectedRoomName = useRef({ name: "", isPrivate: false });

    useEffect(() => { 
        leaveRoom();
        return () => {
            socket.off();
        };
    }, []);

    function openJoinRoomModal(roomName: string, isPrivate: boolean) {
        selectedRoomName.current = {name: roomName, isPrivate};
        setShowJoinRoomModal(true);
    }

    function joinRoomHandler(roomParameters: JoinRoomParameters) {
        joinRoom(roomParameters).unwrap().then(result => {
            console.log(result);
            setShowJoinRoomModal(false);
            navigate(`/${roomParameters.name}`);
        }).catch(error => {
            console.log('joinRoom error:', error);
        });
    }

    function createRoomHandler(newRoomParams: NewRoomParameters) {
        createRoom(newRoomParams).unwrap().then((result: any) => {
            console.log(result);
            setShowNewRoomModal(false);
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div className='pt-4 sm:p-8 mb-28 mx-auto md:m-0 w-10/12 sm:w-1/2 sm:min-w-[500px]'>

            <JoinRoomModal
                isVisible={showJoinRoomModal} 
                close={() => setShowJoinRoomModal(false)} 
                submit={joinRoomHandler}
                selectedRoomName={selectedRoomName.current.name}
                isPrivate={selectedRoomName.current.isPrivate}
            />

            <CreateRoomModal
                isVisible={showNewRoomModal}
                close={() => setShowNewRoomModal(false)}
                submit={createRoomHandler}
            />

            <h1 className='text-6xl mb-4'>Available rooms</h1>
            <h2 className='text-4xl mb-12'>Click a row to join a room</h2>

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
                        !rooms || rooms.length === 0
                            ? <tr><td colSpan={3} className='h-[200px] w-full'><div className='w-full flex justify-center'><Spinner /></div></td></tr>
                            : rooms.map((room, iter) => (
                                <RoomTableRow key={iter} room={room} rowClick={openJoinRoomModal} />
                            ))
                    }
                </tbody>
            </table>

            <button className='sticky bottom-0 p-4 text-2xl w-full rounded-none bg-sky-600' 
                    onClick={() => setShowNewRoomModal(true)}>
                Create a room
            </button>
        </div>
    );
}

export default HomeScreen;