import React from 'react';

import { useGetNewGameStateQuery, useMakeMoveMutation } from '../features/game/gameApi';

import Square from './Square';

const Board = function() {
  console.log('Board rerendered!');
  const { data: board, error, isLoading } = useGetNewGameStateQuery();
  const [ makeMove ] = useMakeMoveMutation();

  function sendMoveMade(squareIndex: number) {
    /* if (props.board[squareIndex] === null) socket.emit('move-made', 
      { event: 'MOVE', change: squareIndex }
    ); */
    makeMove(squareIndex);
  }

  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      {
        board?.map((square, i) => (
          <Square key={i} value={square} index={i} handleClick={sendMoveMade} />
        ))
      }
    </div>
  )
}

export default Board;