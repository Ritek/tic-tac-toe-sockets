import React, { useEffect } from 'react';

import ModalBase from '../ModalBase';

const crownSVG = <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" className='fill-sky-600 w-fit h-fit'><path d="M11.219 3.375 8 7.399 4.781 3.375A1.002 1.002 0 0 0 3 4v15c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V4a1.002 1.002 0 0 0-1.781-.625L16 7.399l-3.219-4.024c-.381-.474-1.181-.474-1.562 0zM5 19v-2h14.001v2H5zm10.219-9.375c.381.475 1.182.475 1.563 0L19 6.851 19.001 15H5V6.851l2.219 2.774c.381.475 1.182.475 1.563 0L12 5.601l3.219 4.024z"></path></svg>

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
                { crownSVG }    
            </div>

            <h1 className='text-4xl mb-4'>GAME OVER</h1>
            <p className='text-2xl'> Player {props.winner} won!</p>

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