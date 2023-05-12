import React from 'react';

import { playerSvg, lockSvg, joinSvg } from '../../assets/svgs';

type Room = {
    name: string;
    isPrivate: boolean;
    players: number; 
}

type Props = {
    room: Room;
    rowClick: (roomName: string, isPrivate: boolean) => void;
}

function RoomTableRow({room, rowClick}: Props) {
  return (
    <tr className='border-b-2 border-b-gray-600 hover:bg-zinc-700' onClick={() => rowClick(room.name, room.isPrivate)}>
        <td className='py-2'>
            <div className='inline-flex w-full items-center'>
                {room.name}
            </div>
        </td>

        <td className='py-2'>
            <div className='inline-flex w-full items-center ml-3.5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='fill-white w-fit h-fit mr-2'>
                    { playerSvg }
                </svg> 
                {room.players} / 2
            </div>
        </td>
        
        <td className='py-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='fill-white w-fit h-fit mr-2'>
                { room.isPrivate ? lockSvg : joinSvg }
            </svg> 
        </td>
    </tr>
  )
}

export default RoomTableRow;