import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from './socket';

import { useJoinRoomMutation } from './globalApi';

import Board from './components/Board';
import Chat from './components/Chat';
import WinnerModal from './components/WinnerModal';

import { ChatMessage, ServerMessage } from './types';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [ joinRoom ] = useJoinRoomMutation();

  const [winner, setWinner] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('location changed!');

    const roomInfo = {
      name: location.pathname.replace('/', ''),
      password: ''
    }

    joinRoom(roomInfo).unwrap().catch(error => {
      // navigate('/');
      console.log(error);
    });
    
    return () => { };
  }, []);

  return (
    <div className="p-8 mb-28">
      <WinnerModal setIsVisible={setShowModal} showModal={showModal} text={winner} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className="min-w-[300px] max-w-screen-sm">
          <Board /* board={board} */ />
        </div>
        
        <div className="min-w-[300px] max-w-screen-sm">
          <Chat /* messages={messages} */ />
        </div>
      </div>

    </div>
  );
}

export default App
