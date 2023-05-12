import React, { useEffect } from 'react';

import ModalBase from '../ModalBase';

import { crownSvg } from '../../assets/svgs';

type Props = {
    isVisible: boolean;
    closeModal: () => void;
    winner?: string;
    hideAfter?: number;
}

function WinnerModal(props: Props) {
    useEffect(() => {
        const hideTimeout = setTimeout(() => {
            props.closeModal();
        }, props.hideAfter);

        return () => {
            clearTimeout(hideTimeout);
            hideTimeout;
        }
    }, [props.isVisible])

  return (
    <ModalBase isVisible={props.isVisible} setIsVisible={props.closeModal}>
        <div className='relative p-4 pt-8 border-2 rounded-md border-sky-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>
            <div className='flex justify-center mb-4'>
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" className='fill-sky-600 w-fit h-fit'>
                    { crownSvg }
                </svg>
            </div>

            <h1 className='text-4xl mb-4'>GAME OVER</h1>
            <p className='text-2xl'>{
                props.winner === 'draw' 
                    ? <>Draw</> 
                    : <>Player {props.winner} won!</>
            }</p>

            <div className='flex justify-center mb-4'>
                <button className='rounded-md p-2 px-4 mt-4 bg-sky-600' 
                    onClick={props.closeModal}>
                        OK
                </button>
            </div>
        </div>
    </ModalBase>
  )
}

export default WinnerModal