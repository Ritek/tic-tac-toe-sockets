/* import React from 'react';
import Spinner from '../../assets/Spinner';
import RoomTableRow from './RoomTableRow';
import { NewRoomParameters, JoinRoomParameters, AvaibleRoom } from '../../types';

type Props = {
    rooms?: AvaibleRoom[];
}



function RoomTableBody(props: Props) {
  if (!props.rooms) {
    return (
        <tbody>
            <tr><td colSpan={3}><Spinner svgClassName='' circleClassName='' pathClassName='fill-sky-600'/></td></tr>
        </tbody>
    );
  } else {
    props.rooms.map((room, iter) => (
        <RoomTableRow key={iter} room={room} rowClick={openJoinRoomModal} />
    ));
  }
}

export default RoomTableBody; */