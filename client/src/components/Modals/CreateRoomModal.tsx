import React from 'react';

import { createSvg, closeSvg } from '../../assets/svgs';

import NativeModal from '../ModalElements/NativeModal';
import { NewRoomParameters } from '../../types';

type Props = {
  isVisible: boolean;
  close: () => void;
  submit: (arg: NewRoomParameters) => void;
}

function isValidNewRoom(arg: Record<string, any>): arg is NewRoomParameters {
  arg.isPrivate = arg.isPrivate || false;
  return arg.name !== undefined 
    ? true 
    : false;
}

function CreateRoomModal(props: Props) {

  function handleSubmit(arg: Record<string, any>) {
    if (isValidNewRoom(arg)) {
      return props.submit(arg);
    }
  }

  return (
    <NativeModal className="w-2/3 sm:1/4 md:w-1/4" isVisible={props.isVisible} close={props.close}>
      <NativeModal.CloseButton clickHandler={props.close}>{ closeSvg }</NativeModal.CloseButton>
      <NativeModal.SVG height='100' width='100' className='mb-4'>{ createSvg }</NativeModal.SVG>
      <NativeModal.Title className='mb-2'>Create room</NativeModal.Title>
      <NativeModal.Text className='mb-4'>
          Please provide room name and password if necessery
      </NativeModal.Text>
      <NativeModal.Input type='text' name='name' placeholder='room name' className='mb-2'/>
      <NativeModal.ConditionalInput 
          className='mb-4'
          checkbox={{ label: 'private', name: 'isPrivate', className: 'scale-150 mb-2' }}
          input={{ type: 'password', name: 'password', placeholder: 'password' }}
      />
      <NativeModal.SubmitButton onClick={handleSubmit}>Create room</NativeModal.SubmitButton>
    </NativeModal>
  );
}

export default CreateRoomModal;