import React from 'react';

const X = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>;
const O = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M5 12c0 3.859 3.14 7 7 7 3.859 0 7-3.141 7-7s-3.141-7-7-7c-3.86 0-7 3.141-7 7zm12 0c0 2.757-2.243 5-5 5s-5-2.243-5-5 2.243-5 5-5 5 2.243 5 5z"></path></svg>;

type Props = {
  value: 'X' | 'O' | null;
  index: number;
  disabled: boolean,
  handleClick: (index: number) => void;
}

function showChar(value: Props["value"]) {
  if (value === 'X') return X;
  if (value === 'O') return O;
  return "";
}

function Square(props: Props) {
  return (
    <button 
      disabled={props.disabled}
      className='w-auto block rounded-none box-border aspect-square mb-1 font-bold  border-solid border-[1px] border-black p-0.5 bg-[#1a1a1a]'
      onClick={() => props.handleClick(props.index)}
    >
      { showChar(props.value) }
    </button>
  )
}

export default Square;