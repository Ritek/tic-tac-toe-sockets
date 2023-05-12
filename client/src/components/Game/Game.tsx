import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
// import { socket } from './socket';

/* import { 
  useJoinRoomMutation, 
  useGetNewGameStateQuery, 
  useRequestRematchMutation,
  useGetRematchRequestQuery,
  useConfirmRematchMutation
} from '../../globalApi'; */

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
import WinnerModal from './WinnerModal';
import RematchModal from './RematchModal';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const [ joinRoom, { error } ] = useJoinRoomMutation();

  const { data: rematchRequest } = useGetRematchRequestQuery();
  const [ requestRematch ] = useRequestRematchMutation();
  const [ confirmRematch ] = useConfirmRematchMutation();
  
  const { data: gameState } = useGetNewGameStateQuery();
  const [showRematchModal, setShowRematchModal] = useState(false);

  const [boardState, setBoardState] = useState(new Array(9).fill(null));

  useEffect(() => {
    const roomInfo = { 
      name: location.pathname.replace('/', ''), 
      password: '' 
    }

    joinRoom(roomInfo).unwrap().then(result => {
      const boardState = result.gameState.boardState;
      if (boardState) {
        setBoardState(boardState);
      }
      return result;
    }).catch(err => {
      navigate('/');
    });
  }, []);

  useEffect(() => {
    if (gameState) setBoardState(gameState.boardState);
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
      <button className="p-2 bg-sky-500 hover:bg-sky-600 rounded-md" onClick={() => setShowWinnerModal(true)}>Show winner</button>
      <WinnerModal 
        closeModal={() => setShowWinnerModal(false)} 
        isVisible={showWinnerModal} 
        winner={gameState?.winner} 
        hideAfter={3000}
      />

      <button className="p-2 bg-sky-500 hover:bg-sky-600 rounded-md" onClick={() => setShowRematchModal(true)}>Show rematch</button>
      <RematchModal
        closeModal={() => setShowRematchModal(false)}
        choiceHandler={rematchHandler}
        isVisible={showRematchModal}
      />

      <button className='p-2 bg-sky-500 hover:bg-sky-600 rounded-md' 
        onClick={() => requestRematch()}>
        Request rematch
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className="min-w-[300px] max-w-screen-sm">
          <Board board={boardState} disabled={!!gameState?.winner}/>
        </div>
        
        <div className="min-w-[300px] max-w-screen-sm">
          <Chat />
        </div>
      </div>

    </div>
  );
}

export default Game
