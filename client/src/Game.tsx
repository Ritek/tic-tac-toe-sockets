import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from './socket';

import { useJoinRoomMutation, useGetNewGameStateQuery } from './globalApi';

import Board from './components/Board';
import Chat from './components/Chat';
// import WinnerModal from './components/WinnerModal';
import WinnerModal from './components/HomeScreen/WinnerModal';

import { ChatMessage, ServerMessage } from './types';

function Game() {
  // console.log('App rendered');
  const location = useLocation();
  const navigate = useNavigate();

  const [ joinRoom ] = useJoinRoomMutation();

  // const [winner, setWinner] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const { data: gameState, error, isLoading } = useGetNewGameStateQuery();

  useEffect(() => {
    const roomInfo = {
      name: location.pathname.replace('/', ''),
      password: ''
    }

    joinRoom(roomInfo).unwrap().catch((error) => {
      // navigate('/');
      console.log(error);
    });
    
    return () => { 
      console.log('App unmounted!');
      // socket.off();
    };
  }, []);

  useEffect(() => {
    console.log('gameState:', gameState);
    if (gameState?.winner) {
      setShowModal(true);
    }
  }, [gameState]);

  return (
    <div className="p-8 mb-28">
      <button className="bg-sky-600 p-2 rounded-md" onClick={() => setShowModal(true)}>Show</button>
      <WinnerModal closeModal={
        () => setShowModal(false)} 
        isVisible={showModal} 
        winner={gameState?.winner} 
        hideAfter={3000}
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className="min-w-[300px] max-w-screen-sm">
          <Board board={gameState?.boardState}/>
        </div>
        
        <div className="min-w-[300px] max-w-screen-sm">
          <Chat /* messages={messages} */ />
        </div>
      </div>

    </div>
  );
}

export default Game
