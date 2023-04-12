import React from 'react';
import { socket } from '../socket';

type Props = {
  isConnected: boolean;
}

function changeConnection(isConnected: boolean) {
  if (isConnected) socket.disconnect();
  else socket.connect();
}

function ConnectionButton(props: Props) {
  return (
    <button onClick={() => changeConnection(props.isConnected)} className='p-2 bg-sky-600 rounded-md mb-5'>
      <div className='flex justify-start'>
        { props.isConnected ? "Disconnect" : "Connect" }
        <div className={`ml-3 mt-1.5 w-3 h-3 rounded-full ${props.isConnected ? 'bg-lime-500' : 'bg-red-500'}`} />
      </div>
    </button>
  )
}

export default ConnectionButton