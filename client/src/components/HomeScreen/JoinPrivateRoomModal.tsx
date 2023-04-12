/* import React, { useRef } from 'react'
import ModalBase from '../ModalBase';

const LockSVG = <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" className='fill-white w-fit h-fit'><path d="M18 10H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3h2c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7.939 5.499A2.002 2.002 0 0 1 14 16a1.99 1.99 0 0 1-1 1.723V20h-2v-2.277a1.992 1.992 0 0 1-.939-2.224z"></path></svg>;

type Props = {
    roomName: string;
    isVisible: boolean;
    closeModal: (password: string | null) => void;
}

function JoinPrivateRoomModal(props: Props) {
    const roomPassword = useRef<HTMLInputElement>(null);

    function closeModal() {
        props.closeModal(null);
    }

    function joinRoom() {
        if (roomPassword.current) {
            props.closeModal(roomPassword.current.value);
            roomPassword.current.value = "";
        }
    }

    return (
        <ModalBase isVisible={props.isVisible} setIsVisible={closeModal}>
            <div className='relative p-4 pt-16 border-2 rounded-md border-gray-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>
                
                <button className='absolute top-1 right-1 w-8 h-8' onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='fill-white hover:fill-gray-800 w-fit h-fit'>
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                    </svg>
                </button>
                
                <div className='flex justify-center'>
                    {LockSVG}
                </div>

                <div className='mb-20'>
                    <p className='text-xl mb-1'>" {props.roomName} "</p>
                    <p className='text-2xl mb-2'>Room password:</p>
                    <input ref={roomPassword} type='password' className='bg-transparent w-full border-b-2 border-sky-600 text-2xl mb-4' />
                </div>

                <button className='w-full p-2 bg-sky-600 rounded-md' onClick={joinRoom}>Join</button>
            
            </div>
        </ModalBase>
    );
}

export default JoinPrivateRoomModal; */