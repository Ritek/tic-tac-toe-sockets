import React from 'react';

// import { useMakeMoveMutation } from '../../globalApi';
import { useMakeMoveMutation } from '../../features/game/gameApi';

import Square from './Square';

type Props = {
  board?: ('X' | 'O' | null)[];
  disabled: boolean;
}

const Board = function(props: Props) {
  const [ makeMove ] = useMakeMoveMutation();
  const bordArr = props.board || new Array(9).fill(null);
  console.log(props.disabled);

  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      { 
        bordArr.map((square, i) => (
          <Square key={i} value={square} index={i} disabled={props.disabled} handleClick={() => makeMove(i)} />
        ))
      }
    </div>
  )
}

export default Board;