import React from 'react';
import { socket } from '../socket';

// import { useGetSessionQuery, useDeleteSessionMutation } from '../globalApi';
import { useGetSessionQuery, useDeleteSessionMutation } from '../features/session/sessionApi';

function SessionStatus() {
  const { data: session, error, isLoading } = useGetSessionQuery();
  const [ deleteSession ] = useDeleteSessionMutation();

  function logout() {
    if (session?.sessionID) {
      deleteSession(session.sessionID);
      socket.disconnect();
    }
  }

  return (
    <div className={`flex sm:w-4/12 min-w-[300px] p-2 bg-[#1a1a1a] ${!session?.sessionID ? 'invisible': ''}`}>
      <div className='w-full inline-flex items-center mb-2'>
        <div className='h-10 mr-2 bg-gray-500 aspect-square rounded-[50%]'></div>
        <div>
          <p>Player: <b>{session?.username}</b></p>
          <p>ID: {session?.userID}</p>
        </div>
      </div>
      <button className='p-1 rounded-sm bg-sky-500' onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default SessionStatus;