import React, { memo } from 'react';
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
      {/* 
      <Square value={props.board[0]} index={0} handleClick={sendMoveMade} />
      <Square value={props.board[1]} index={1} handleClick={sendMoveMade} />
      <Square value={props.board[2]} index={2} handleClick={sendMoveMade} />
      
      <Square value={props.board[3]} index={3} handleClick={sendMoveMade} />
      <Square value={props.board[4]} index={4} handleClick={sendMoveMade} />
      <Square value={props.board[5]} index={5} handleClick={sendMoveMade} />

      <Square value={props.board[6]} index={6} handleClick={sendMoveMade} />
      <Square value={props.board[7]} index={7} handleClick={sendMoveMade} />
      <Square value={props.board[8]} index={8} handleClick={sendMoveMade} /> 
      */}

      {
        props.board.map((square, i) => (
          <Square key={i} value={square} index={i} handleClick={sendMoveMade} />
        ))
      } 
    </div>
  )
}

// export default Board
export default Board