import React, { ReactElement } from 'react';
import { useModalContext } from './ModalContext';

type Props = {
  children: ReactElement;
  clickHandler: () => void;
  className?: string;
}

function ModalCloseButton(props: Props) {
  const { setModalState } = useModalContext();

  function handleClick() {
    setModalState({});
    props.clickHandler();
  }

  return (
    <button className={`absolute top-1 right-1 w-8 h-8 ${props.className}`} onClick={handleClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className='fill-sky-600 hover:fill-sky-500 w-full h-full' viewBox="0 0 24 24">
          {props.children}
      </svg>
    </button>
  );
}

export default ModalCloseButton;