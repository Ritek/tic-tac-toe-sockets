import React from 'react';

import { closeSvg, joinSvg, lockSvg } from '../../assets/svgs';

import NativeModal from '../ModalElements/NativeModal';

import { JoinRoomParameters } from '../../types';

type Props = {
  isVisible: boolean;
  close: () => void;
  submit: (arg: JoinRoomParameters) => void;
  selectedRoomName: string;
  isPrivate: boolean;
}

function isValidRoomCredentials(arg: Record<string, any>): arg is JoinRoomParameters {
  return arg.name !== undefined
    ? true 
    : false;
}

function JoinRoomModal(props: Props) {

  function handleSubmit(arg: Record<string, any>) {
    const joinRoomParams = {
      name: props.selectedRoomName,
      password: arg.password
    }

    if (isValidRoomCredentials(joinRoomParams)) {
      return props.submit(joinRoomParams);
    }
  }

  return (
    <NativeModal className="w-2/3 sm:1/4 md:w-1/4" isVisible={props.isVisible} close={props.close}>
      <NativeModal.CloseButton clickHandler={props.close}>{ closeSvg }</NativeModal.CloseButton>
      {props.isPrivate  
        ? <NativeModal.SVG height='100' width='100' className='mb-4'>{ lockSvg }</NativeModal.SVG>
        : <NativeModal.SVG height='100' width='100' className='mb-4'>{ joinSvg }</NativeModal.SVG>
      }
      <NativeModal.Text>You are about join room</NativeModal.Text>
      <NativeModal.Text className='mb-4'>
        <b>"{ props.selectedRoomName }"</b>
      </NativeModal.Text>
      {props.isPrivate  
        ? <NativeModal.Input type='password' name='password' placeholder='password' className='mb-4' />
        : null
      }
      <NativeModal.SubmitButton onClick={handleSubmit}>Join room</NativeModal.SubmitButton>
    </NativeModal>
  );
}

export default JoinRoomModal