import React from 'react';

import Square from './Square';

type Props = {
  board: (string | null)[];
  sendMoveMade: (squareIndex: number) => void;
}

function Board(props: Props) {
  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      <Square value={props.board[0]} index={0} handleClick={props.sendMoveMade} />
      <Square value={props.board[1]} index={1} handleClick={props.sendMoveMade} />
      <Square value={props.board[2]} index={2} handleClick={props.sendMoveMade} />
      
      <Square value={props.board[3]} index={3} handleClick={props.sendMoveMade} />
      <Square value={props.board[4]} index={4} handleClick={props.sendMoveMade} />
      <Square value={props.board[5]} index={5} handleClick={props.sendMoveMade} />

      <Square value={props.board[6]} index={6} handleClick={props.sendMoveMade} />
      <Square value={props.board[7]} index={7} handleClick={props.sendMoveMade} />
      <Square value={props.board[8]} index={8} handleClick={props.sendMoveMade} />
    </div>
  )
}

export default Board