import React, { ReactNode } from 'react';
import { crownSvg } from '../../assets/svgs';

import NativeModal from '../ModalElements/NativeModal';

type Props = {
    isVisible: boolean;
    close: () => void;
    children?: ReactNode;
    winner: string;
    className?: string;
}

function WinnerModal(props: Props) {
  return (
    <NativeModal className="w-2/3 sm:1/4 md:w-1/4" isVisible={props.isVisible} close={props.close}>
        <NativeModal.SVG height='100' width='100' className='mb-4 fill-sky-600'>{ crownSvg }</NativeModal.SVG>
        <NativeModal.Title className='mb-2'>GAME OVER</NativeModal.Title>
        <NativeModal.Text className='mb-4'>
            {
                props.winner === 'draw'
                    ? 'Game ends with a draw'
                    : `${props.winner} won!`
            }
        </NativeModal.Text>
        <button onClick={props.close} className='w-full p-2 bg-sky-600 hover:bg-sky-500 text-xl'>OK</button>
    </NativeModal>
  );
}

export default WinnerModal;