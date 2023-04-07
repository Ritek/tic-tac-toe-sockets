import React, { useState } from 'react';
import RoomTableRow from './RoomTableRow';

// const LockSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path></svg>;
const plusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>;


type Room = {
    name: string;
    players: number;
    private: boolean;
}

function HomeScreen() {
    
    const roomsInitial: Room[] = [
        { name: 'room-1', players: 1, private: false },
        { name: 'room-2', players: 2, private: false },
        { name: 'room-3', players: 0, private: true  },
        { name: 'my room#1234', players: 0, private: true  },
        { name: 'awesome room name', players: 0, private: true  },
        { name: 'one long name to rule them all', players: 0, private: true  },
        { name: 'and another name', players: 0, private: true  },
        { name: 'r o o m', players: 0, private: true  },
    ];

    const [rooms, setRooms] = useState(roomsInitial);

    function addRoom() {
        setRooms([...rooms, { name: `room-${rooms.length+1}`, players: 0, private: false }]);
    }

    return (
        <div className='p-0.5 pt-4 sm:p-8 mb-28 mx-auto md:m-0 w-10/12 sm:w-1/2 min-w-[300px]'>

            <h1 className='text-6xl mb-4'>Available rooms</h1>
            <h3 className='text-4xl mb-12'>Click row to join or create a room</h3>

            <table className='w-full table-auto text-xl text-left'>
                <thead>
                    <tr>
                        <th className='w-7/12 py-2'>Room name</th>
                        <th className='w-4/12 py-2'>Players</th>
                        <th className='w-1/12 py-2'>Play</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rooms.map((room, iter) => (
                            <RoomTableRow key={iter} room={room} />
                        ))
                    }
                </tbody>
            </table>

            <button className='sticky bottom-1 p-4 text-2xl inline-flex w-full items-center justify-center rounded-none bg-sky-600' onClick={addRoom}>
                { plusSVG } Create room
            </button>
        </div>
    );
}

export default HomeScreen;