import React, { ReactNode } from 'react';

import NativeModal from '../ModalElements/NativeModal';

type Props = {
  isVisible: boolean;
  close: () => void;
  children?: ReactNode;
  submit: (rematch: boolean) => void;
  className?: string;
}

function RematchModal(props: Props) {
  return (
    <NativeModal className="w-2/3 sm:1/4 md:w-1/4" isVisible={props.isVisible} close={props.close}>
      <NativeModal.Title className='mb-2'>Rematch?</NativeModal.Title>
      <NativeModal.Text>Oponent is asking for rematch</NativeModal.Text>
      <NativeModal.Text className='mb-4'>Would you like to play again?</NativeModal.Text>
      <div className='flex flex-row gap-2'>
        <NativeModal.SubmitButton onClick={() => props.submit(true)}>Yes</NativeModal.SubmitButton>
        <NativeModal.SubmitButton onClick={() => props.submit(false)}>No</NativeModal.SubmitButton>
      </div>
    </NativeModal>
  );
}

export default RematchModal;