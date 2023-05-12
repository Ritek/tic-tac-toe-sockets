import React from 'react';

import ModalBase from '../ModalBase';

type Props = {
    isVisible: boolean;
    choiceHandler: (rematch: boolean) => void;
    closeModal: () => void;
}

function RematchModal(props: Props) {

  return (
    <ModalBase isVisible={props.isVisible} setIsVisible={props.closeModal}>
        <div className='relative p-4 pt-16 border-2 rounded-md border-gray-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>
            <h2 className='text-2xl mb-8'>Rematch?</h2>

            <p>Oponent is asking for rematch.</p>
            <p className='mb-8'>Would you like to play again?</p>

            <div className='flex'>
                <button className='p-2 w-full mx-2 bg-sky-500 hover:bg-sky-600 rounded-md'
                    onClick={() => props.choiceHandler(true)}>
                    Yes
                </button>

                <button className='p-2 w-full mx-2 bg-sky-500 hover:bg-sky-600 rounded-md'
                    onClick={() => props.choiceHandler(false)}>
                    No
                </button>
            </div>
        </div>
    </ModalBase>
  )
}

export default RematchModal;