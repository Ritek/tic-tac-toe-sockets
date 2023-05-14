import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import {
  useGetNewGameStateQuery,
} from '../../features/game/gameApi';

import {
  useJoinRoomMutation,
} from '../../features/room/roomApi';

import {
  useGetRematchRequestQuery,
  useRequestRematchMutation,
  useConfirmRematchMutation,
} from '../../features/rematch/rematchApi';

import Board from './Board';
import Chat from './Chat';
import WinnerModal from '../Modals/WinnerModal';
import RematchModal from '../Modals/RematchModal';
import PlayerInfoCards from './PlayerInfoCards';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const [ joinRoom ] = useJoinRoomMutation();

  const { data: rematchRequest } = useGetRematchRequestQuery();
  const [ requestRematch ] = useRequestRematchMutation();
  const [ confirmRematch ] = useConfirmRematchMutation();
  
  const { data: gameState } = useGetNewGameStateQuery();
  const [showRematchModal, setShowRematchModal] = useState(false);

  useEffect(() => {
    const roomInfo = { 
      name: location.pathname.replace('/', ''), 
      password: '' 
    }

    joinRoom(roomInfo).unwrap().then(result => {
      return result;
    }).catch(err => {
      navigate('/');
    });
  }, []);

  useEffect(() => {
    if (gameState?.winner) {
      setShowWinnerModal(true);
    }
  }, [gameState]);

  useEffect(() => {
    if (rematchRequest) {
      setShowRematchModal(true);
    }
  }, [rematchRequest]);

  function rematchHandler(rematch: boolean) {
    if (rematch) {
      confirmRematch();
    }
    setShowRematchModal(false);
  }

  return (
    <div className="p-8 mb-28">

      {/* <button className="p-2 bg-sky-500 hover:bg-sky-600 rounded-md" onClick={() => setShowWinnerModal(true)}>Show winner</button> */}
      <WinnerModal 
        close={() => setShowWinnerModal(false)} 
        isVisible={showWinnerModal} 
        winner={gameState?.winner!} 
      />

      {/* <button className="p-2 bg-sky-500 hover:bg-sky-600 rounded-md" onClick={() => setShowRematchModal(true)}>Show rematch</button> */}
      <RematchModal
        close={() => setShowRematchModal(false)}
        isVisible={showRematchModal}
        submit={(rematch) => rematchHandler(rematch)}
      />

      <button className='p-2 bg-sky-500 hover:bg-sky-600 rounded-md mb-2' 
        onClick={() => requestRematch()}> Request rematch
      </button>

      <PlayerInfoCards PlayerX={gameState?.players.playerX} PlayerO={gameState?.players.playerO} turn={gameState?.turn}/>

      <div className='flex flex-row gap-5 flex-wrap md:flex-nowrap'>
        <div className="w-full min-w-[300px] max-w-screen-md">
          <Board board={gameState?.boardState} disabled={!!gameState?.winner}/>
        </div>
        
        <div className="w-full min-w-[300px] max-w-screen-md">
          <Chat />
        </div>
      </div>

    </div>
  );
}

export default Game
