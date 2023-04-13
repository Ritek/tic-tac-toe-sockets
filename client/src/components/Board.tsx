import React from 'react';
import { socket } from '../socket';

import Square from './Square';

type Props = {
  board: ('X' | 'O' | null)[];
}

const Board = function(props: Props) {
  console.log('Board rerendered!');

  function sendMoveMade(squareIndex: number) {
    if (props.board[squareIndex] === null) socket.emit('move-made', 
      { event: 'MOVE', change: squareIndex }
    );
  }

  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      {
        props.board.map((square, i) => (
          <Square key={i} value={square} index={i} handleClick={sendMoveMade} />
        ))
      } 
    </div>
  )
}

export default Board;