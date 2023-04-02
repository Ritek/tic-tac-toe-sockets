import React from 'react';

type Props = {
  isConnected: boolean;
  changeConnection: () => void;
}

function ConnectionButton(props: Props) {
  return (
    <button onClick={props.changeConnection} className='mb-5'>
      <div className='flex justify-start'>
        { props.isConnected ? "Disconnect" : "Connect" }
        <div className={`ml-3 mt-1.5 w-3 h-3 rounded-full ${props.isConnected ? 'bg-lime-500' : 'bg-red-500'}`} />
      </div>
    </button>
  )
}

export default ConnectionButton