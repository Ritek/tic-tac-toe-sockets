import React, { ReactNode } from 'react';
import { userAddSvg } from '../../assets/svgs';

import NativeModal from '../ModalElements/NativeModal';

type Props = {
    isVisible: boolean;
    close: () => void;
    children?: ReactNode;
    className?: string;
    submit: (username: string) => void;
}

function hasUsername(obj: Record<string, any>): obj is {username: string} {
    return 'username' in obj;
}

function UsernameModal(props: Props) {

    function handleSubmit(obj: Record<string, any>) {
        if (hasUsername(obj)) {
            props.submit(obj.username);
        }
    }

    return (
        <NativeModal className="w-2/3 sm:1/4 md:w-1/4" isVisible={props.isVisible} close={props.close}>
          <NativeModal.SVG height='100' width='100' className='mb-4 fill-white'>{ userAddSvg }</NativeModal.SVG>
          <NativeModal.Title className='mb-2'>Enter a username</NativeModal.Title>
          <NativeModal.Text className='mb-4'>
            Create temporary username to continue
          </NativeModal.Text>
          <NativeModal.Input type='text' minLength={3} maxLength={10} name='username' 
            placeholder='username' className='mb-2 invalid:bg-rose-700'
          />
          <i>Min 3 characters, max 10 characters</i>
          <NativeModal.SubmitButton onClick={handleSubmit}>Join</NativeModal.SubmitButton>
        </NativeModal>
      );
}

export default UsernameModal;