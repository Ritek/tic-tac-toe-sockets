import React from 'react';
import { Player } from '../../types';

type Props = {
  PlayerX?: Player;
  PlayerO?: Player;
  turn?: number;
}

function PlayerInfoCards(props: Props) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 w-full justify-between flex-wrap md:flex-nowrap p-2 bg-[#1a1a1a] mb-8'>

      <div className='inline-flex text-left'>
        <div className='h-10 mr-2 bg-gray-500 aspect-square rounded-[50%]' />
        <div>
          <p>Player X: {props.PlayerX?.username}</p>
          <p>ID: {props.PlayerX?.userID}</p>
          <p>Status: {props.PlayerX?.connected ? 'Connected' : 'Disconnected'}</p>
        </div>
      </div>

      <div className='place-self-end inline-flex text-right'>
        <div>
          <p>Player O: {props.PlayerO?.username}</p>
          <p>ID: {props.PlayerO?.userID}</p>
          <p>Status: {props.PlayerO?.connected ? 'Connected' : 'Disconnected'}</p>
        </div>
        <div className='h-10 ml-2 bg-gray-500 aspect-square rounded-[50%]' />
      </div>

    </div>
  );
}

export default PlayerInfoCards;