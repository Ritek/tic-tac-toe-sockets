import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
// import { useJoinRoomMutation } from '../../globalApi';

import { useJoinRoomMutation } from '../../features/room/roomApi'

import ModalBase from '../ModalBase';

import { lockSvg, joinSvg, closeSvg } from '../../assets/svgs';

type Props = {
    roomName: string;
    isPrivate: boolean;
    isVisible: boolean;
    closeModal: () => void;
}

function JoinRoomModal(props: Props) {
    const navigate = useNavigate();
    const roomPassword = useRef<HTMLInputElement>(null);

    const [ joinRoom ] = useJoinRoomMutation();

    function displayPasswordInputIfPrivte() {
        if (props.isPrivate) return (
            <>
                <p className='text-2xl mb-2'>Room password:</p>
                <input ref={roomPassword} type='password' placeholder='password' 
                    className='bg-neutral-900 w-full border-b-2 border-sky-600 text-2xl mb-4' 
                />         
            </>
        );
    }

    function joinRoomHandler() {
        const roomCredentials = {
            name: props.roomName,
            password: (roomPassword.current?.value) || undefined
        }

        joinRoom(roomCredentials).unwrap().then(result => {
            props.closeModal();
            navigate(`/${roomCredentials.name}`);
        }).catch(error => {
            console.log('joinRoom error:', error);
        });
    }

    return (
        <ModalBase isVisible={props.isVisible} setIsVisible={props.closeModal}>
            <div className='relative p-4 pt-16 border-2 rounded-md border-gray-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>

                <button className='absolute top-1 right-1 w-8 h-8' onClick={props.closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='m-auto fill-white hover:fill-gray-800 w-fit h-fit'>
                        { closeSvg }
                    </svg>
                </button>

                <div className='flex justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" className='fill-white'>
                        { props.isPrivate ? lockSvg : joinSvg }
                    </svg>
                </div>

                <p className='text-xl mb-1'>You are about to join room</p>
                <p className='text-xl mb-1'>" {props.roomName} "</p>

                <div className='mb-20'>
                    { displayPasswordInputIfPrivte() }
                </div>

                <button className='w-full p-2 bg-sky-600 rounded-md' 
                    onClick={joinRoomHandler}>
                    Join
                </button>
            
            </div>
        </ModalBase>
    );
}

export default JoinRoomModal;