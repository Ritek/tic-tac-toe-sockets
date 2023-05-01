import React, { useRef } from 'react';
import ModalBase from './ModalBase';

type Props = {
    isVisible: boolean;
    closeModal: (username: string) => void;
}

function UsernameModal(props: Props) {
    const usernameRef = useRef<HTMLInputElement>(null);

    function closeModal() {
        if (usernameRef && usernameRef.current) {
            props.closeModal(usernameRef.current.value);
            usernameRef.current.value = '';
        }
    }

    return (
        <ModalBase isVisible={props.isVisible} setIsVisible={closeModal}>
            <div className='relative p-4 pt-16 border-2 rounded-md border-gray-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>               
                <h1 className='text-5xl mb-12'>Enter a username</h1>

                <div className='mb-8'>
                    <input autoFocus className='block p-2 w-full text-lg invalid:bg-rose-700' 
                        ref={usernameRef} type='text' placeholder='username'
                        minLength={3} maxLength={10}
                    />
                    <i>Min 3 characters, max 10 characters</i>
                </div>

                <button className='p-2 w-full bg-sky-600 rounded-md text-lg' onClick={closeModal}>
                    Start
                </button>
            </div>
        </ModalBase>
    );
}

export default UsernameModal;