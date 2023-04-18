import React from 'react';

import { useGetNewGameStateQuery, useMakeMoveMutation } from '../globalApi';

import Square from './Square';

const Board = function() {
  // console.log('Board rerendered!');
  const { data: board, error, isLoading } = useGetNewGameStateQuery();
  const [ makeMove ] = useMakeMoveMutation();

  function sendMoveMade(squareIndex: number) {
    makeMove(squareIndex);
  }

  function renderBoard() {
    let temp = new Array(9).fill(null);
    if (board && board.length > 0) {
      temp = board;
    }

    return temp.map((square, i) => (
      <Square key={i} value={square} index={i} handleClick={sendMoveMade} />
    ));
  }

  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-1 w-auto'>
      { renderBoard() }
    </div>
  )
}

export default Board;