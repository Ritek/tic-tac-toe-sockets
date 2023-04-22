import React from 'react';

import { useMakeMoveMutation } from '../globalApi';

import Square from './Square';

type Props = {
  board?: ('X' | 'O' | null)[];
}

const Board = function(props: Props) {
  // console.log('Board rerendered!');
  const [ makeMove ] = useMakeMoveMutation();

  function renderBoard() {
    const bordArr = props.board || new Array(9).fill(null);

    return bordArr.map((square, i) => (
      <Square key={i} value={square} index={i} handleClick={() => makeMove(i)} />
    ));
  }

  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      { renderBoard() }
    </div>
  )
}

export default Board;