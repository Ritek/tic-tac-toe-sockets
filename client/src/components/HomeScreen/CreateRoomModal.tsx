import React, { useState } from 'react';

import { useCreateRoomMutation } from '../../globalApi';

import ModalBase from '../ModalBase';

const CloseSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='fill-white hover:fill-gray-800 w-fit h-fit'><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>

type NewRoom = {
    name: string;
} & ({
    isPrivate: false;
} | {
    isPrivate: true;
    password: string;
});

type Props = {
    isVisible: boolean;
    closeModal: () => void;
}

function CreateRoomModal(props: Props) {
    const [ createRoom, { error, isError, isSuccess } ] = useCreateRoomMutation();
    const [newRoom, setNewRoom] = useState<NewRoom>({name: '', isPrivate: false});

    function checkboxHandler() {
        if (newRoom.isPrivate) {
            setNewRoom({...newRoom, isPrivate: false});
        } else {
            setNewRoom({...newRoom, isPrivate: true, password: '' });
        }
    }

    function setNewRoomFields(field: 'name' | 'password', value: string) {
        setNewRoom({...newRoom, [field]: value});
    }

    function closeAndResetModal() {
        props.closeModal();
        setNewRoom({name: '', isPrivate: false});
    }

    function createRoomAndReset() {
        createRoom({name: newRoom.name, isPrivate: false}).unwrap().then((result: any) => {
            closeAndResetModal();
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <ModalBase isVisible={props.isVisible} setIsVisible={closeAndResetModal}>
            <div className='relative p-4 pt-16 border-2 rounded-md border-gray-600 bg-zinc-900 bg-opacity-80 items-center text-center min-w-[300px] w-8/12 sm:w-3/12'>

                <button className='absolute top-1 right-1 w-8 h-8' onClick={closeAndResetModal}>
                    { CloseSVG }
                </button>
                
                <div className='text-center text-5xl'>
                    Create room
                </div>

                <div className='mt-10 grid gap-y-1 text-start grid-cols-[30%_70%]'>
                    <label htmlFor='roomNameInput'>Name</label>
                    <input name="roomNameInput" type='text' value={newRoom.name} onChange={e => setNewRoomFields('name', e.target.value)}></input>

                    <label htmlFor='roomIsPrivateCheckbox'>Private</label>
                    <input name="roomIsPrivateCheckbox" type='checkbox' checked={newRoom.isPrivate} onChange={checkboxHandler}></input>
                    {
                        newRoom.isPrivate ?
                        <>
                            <label htmlFor='roomPasswordInput'>Password</label>
                            <input name="roomPasswordInput" type='text' value={newRoom.password} 
                                onChange={e => setNewRoomFields('password', e.target.value)}>
                            </input>
                        </> : null
                    }
                </div>

                { error ? <p className='mt-10 text-red-600'>{ (error as any).error }</p> : null }

                <button className='mt-10 w-full p-2 bg-sky-600 rounded-md' onClick={createRoomAndReset}>Create</button>
            
            </div>
        </ModalBase>
    );
}

export default CreateRoomModal;